import 'dotenv/config';
import neo4j from 'neo4j-driver';
import { prisma } from '../../src/lib/prisma';
import { getDriver } from '../../src/lib/neo4j';
import {
  CanonicalPerson,
  hasBlockingReconciliationIssues,
  reconcilePeople,
} from '../../src/lib/canonicalPeople';

const apply = process.argv.includes('--apply');
const strict = process.argv.includes('--strict');

const graphQuery = `
  MATCH (person:Person)
  RETURN person.slug AS slug,
         person.name AS name,
         person.fullName AS fullName,
         person.nameTransliterated AS nameTransliterated
`;

const upsertQuery = `
  UNWIND $people AS person
  MERGE (node:Person {slug: person.slug})
  SET node.name = person.name
  FOREACH (_ IN CASE WHEN person.fullName IS NULL THEN [] ELSE [1] END |
    SET node.fullName = person.fullName)
  FOREACH (_ IN CASE WHEN person.nameTransliterated IS NULL THEN [] ELSE [1] END |
    SET node.nameTransliterated = person.nameTransliterated)
`;

function printList(label: string, items: string[]) {
  console.log(`${label}: ${items.length}${items.length ? ` (${items.join(', ')})` : ''}`);
}

async function main() {
  const postgresPeople: CanonicalPerson[] = await prisma.person.findMany({
    select: { slug: true, name: true, fullName: true, nameTransliterated: true },
    orderBy: { slug: 'asc' },
  });
  const session = getDriver().session({
    database: process.env.NEO4J_DATABASE || 'neo4j',
    defaultAccessMode: neo4j.session.READ,
  });

  try {
    const result = await session.run(graphQuery);
    const graphPeople = result.records.map((record) => ({
      slug: record.get('slug') ?? '',
      name: record.get('name') ?? '',
      fullName: record.get('fullName') ?? null,
      nameTransliterated: record.get('nameTransliterated') ?? null,
    })) as CanonicalPerson[];
    const report = reconcilePeople(postgresPeople, graphPeople);

    console.log(`Canonical people reconciliation (${apply ? 'apply' : 'dry run'})`);
    printList('PostgreSQL profiles', postgresPeople.map((person) => person.slug));
    printList('Neo4j people', graphPeople.map((person) => person.slug));
    printList('Profiles missing from Neo4j', report.postgresOnly);
    printList('Graph-only people (kept)', report.graphOnly);
    console.log(`Property mismatches: ${report.mismatches.length}`);
    for (const mismatch of report.mismatches) {
      console.log(`  ${mismatch.slug}.${mismatch.field}: PostgreSQL=${JSON.stringify(mismatch.postgres)}, Neo4j=${JSON.stringify(mismatch.neo4j)}`);
    }

    const validationIssues = [...report.invalidPostgresPeople, ...report.invalidNeo4jPeople];
    if (validationIssues.length) {
      console.error('Invalid canonical data:');
      for (const issue of validationIssues) console.error(`  ${issue}`);
      process.exitCode = 1;
      return;
    }

    if (apply) {
      const writeSession = getDriver().session({
        database: process.env.NEO4J_DATABASE || 'neo4j',
        defaultAccessMode: neo4j.session.WRITE,
      });
      try {
        // PostgreSQL is authoritative for profile-backed people. This MERGE only
        // creates missing nodes/updates shared properties; it never deletes nodes,
        // relationships, or Neo4j-only properties.
        await writeSession.executeWrite((transaction) =>
          transaction.run(upsertQuery, { people: postgresPeople }),
        );
        console.log(`Synchronized ${postgresPeople.length} PostgreSQL profiles to Neo4j.`);
      } finally {
        await writeSession.close();
      }
    } else if (report.postgresOnly.length || report.mismatches.length) {
      console.log('No data changed. Re-run with --apply to synchronize profile-backed people to Neo4j.');
    }

    if (strict && (hasBlockingReconciliationIssues(report) || report.postgresOnly.length || report.mismatches.length)) {
      process.exitCode = 1;
    }
  } finally {
    await session.close();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Canonical people reconciliation failed:', error);
  process.exitCode = 1;
});
