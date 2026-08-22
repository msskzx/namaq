import 'dotenv/config';
import neo4j from 'neo4j-driver';
import { prisma } from '../../src/lib/prisma';
import { getDriver } from '../../src/lib/neo4j';
import { CanonicalTitle, CanonicalTitleHolder, reconcileTitles } from '../../src/lib/canonicalTitles';

const apply = process.argv.includes('--apply');
const strict = process.argv.includes('--strict');

const titleGraphQuery = `
  MATCH (title:Title)
  RETURN title.slug AS slug,
         title.name AS name,
         title.nameTransliterated AS nameTransliterated,
         title.desc AS desc
`;

const holderGraphQuery = `
  MATCH (person:Person)-[:HOLDS_TITLE]->(title:Title)
  RETURN person.slug AS personSlug,
         title.slug AS titleSlug
`;

const titleUpsertQuery = `
  UNWIND $titles AS title
  MERGE (node:Title {slug: title.slug})
  SET node.name = title.name
  FOREACH (_ IN CASE WHEN title.nameTransliterated IS NULL THEN [] ELSE [1] END |
    SET node.nameTransliterated = title.nameTransliterated)
  FOREACH (_ IN CASE WHEN title.desc IS NULL THEN [] ELSE [1] END |
    SET node.desc = title.desc)
`;

// MATCH (not MERGE) on person/title: this only links people and titles that
// already have a synced node. A holder whose person or title node is
// missing is silently skipped here and stays reported as postgresOnly until
// that node exists (via people:sync or a titles:sync re-run).
const holderUpsertQuery = `
  UNWIND $holders AS h
  MATCH (person:Person {slug: h.personSlug}), (title:Title {slug: h.titleSlug})
  MERGE (person)-[:HOLDS_TITLE]->(title)
`;

function printList(label: string, items: string[]) {
  console.log(`${label}: ${items.length}${items.length ? ` (${items.join(', ')})` : ''}`);
}

async function main() {
  const postgresTitles: CanonicalTitle[] = await prisma.title.findMany({
    select: { slug: true, name: true, nameTransliterated: true, desc: true },
    orderBy: { slug: 'asc' },
  });
  const titlesWithHolders = await prisma.title.findMany({
    select: { slug: true, people: { select: { slug: true } } },
  });
  const postgresHolders: CanonicalTitleHolder[] = titlesWithHolders.flatMap((title) =>
    title.people.map((person) => ({ personSlug: person.slug, titleSlug: title.slug })),
  );

  const session = getDriver().session({
    database: process.env.NEO4J_DATABASE || 'neo4j',
    defaultAccessMode: neo4j.session.READ,
  });

  try {
    // Sequential, not Promise.all: a single session can't run two queries
    // concurrently (the driver throws "Queries cannot be run directly on a
    // session with an open transaction").
    const titleResult = await session.run(titleGraphQuery);
    const holderResult = await session.run(holderGraphQuery);
    const graphTitles: CanonicalTitle[] = titleResult.records.map((record) => ({
      slug: record.get('slug') ?? '',
      name: record.get('name') ?? '',
      nameTransliterated: record.get('nameTransliterated') ?? null,
      desc: record.get('desc') ?? null,
    }));
    const graphHolders: CanonicalTitleHolder[] = holderResult.records.map((record) => ({
      personSlug: record.get('personSlug') ?? '',
      titleSlug: record.get('titleSlug') ?? '',
    }));

    const report = reconcileTitles(postgresTitles, graphTitles, postgresHolders, graphHolders);

    console.log(`Canonical titles reconciliation (${apply ? 'apply' : 'dry run'})`);
    printList('PostgreSQL titles', postgresTitles.map((title) => title.slug));
    printList('Neo4j titles', graphTitles.map((title) => title.slug));
    printList('Titles missing from Neo4j', report.titlesPostgresOnly);
    printList('Graph-only titles (kept)', report.titlesGraphOnly);
    console.log(`Title property mismatches: ${report.titleMismatches.length}`);
    for (const mismatch of report.titleMismatches) {
      console.log(`  ${mismatch.slug}.${mismatch.field}: PostgreSQL=${JSON.stringify(mismatch.postgres)}, Neo4j=${JSON.stringify(mismatch.neo4j)}`);
    }

    printList('Holders missing from Neo4j', report.holdersPostgresOnly);
    printList('Graph-only holders (kept)', report.holdersGraphOnly);

    const validationIssues = [
      ...report.invalidPostgresTitles,
      ...report.invalidNeo4jTitles,
      ...report.invalidPostgresHolders,
      ...report.invalidNeo4jHolders,
    ];
    if (validationIssues.length) {
      console.error('Invalid canonical data:');
      for (const issue of validationIssues) console.error(`  ${issue}`);
      process.exitCode = 1;
      return;
    }

    const hasDrift = report.titlesPostgresOnly.length || report.titleMismatches.length
      || report.holdersPostgresOnly.length;

    if (apply) {
      const writeSession = getDriver().session({
        database: process.env.NEO4J_DATABASE || 'neo4j',
        defaultAccessMode: neo4j.session.WRITE,
      });
      try {
        // PostgreSQL is authoritative for titles and their holders. These
        // MERGEs only create missing nodes/relationships or update shared
        // properties; they never delete nodes, relationships, or Neo4j-only
        // properties.
        await writeSession.executeWrite(async (transaction) => {
          await transaction.run(titleUpsertQuery, { titles: postgresTitles });
          await transaction.run(holderUpsertQuery, { holders: postgresHolders });
        });
        console.log(`Synchronized ${postgresTitles.length} titles and ${postgresHolders.length} holders to Neo4j.`);
      } finally {
        await writeSession.close();
      }
    } else if (hasDrift) {
      console.log('No data changed. Re-run with --apply to synchronize PostgreSQL titles and holders to Neo4j.');
    }

    if (strict && hasDrift) {
      process.exitCode = 1;
    }
  } finally {
    await session.close();
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('Canonical titles reconciliation failed:', error);
    process.exitCode = 1;
  })
  // The Neo4j driver's connection pool keeps the event loop alive, so the
  // process won't exit on its own once main() resolves (see the same
  // process.exit() pattern in neo4j/graphSeed.ts).
  .finally(() => process.exit(process.exitCode ?? 0));
