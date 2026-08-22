import 'dotenv/config';
import neo4j from 'neo4j-driver';
import { prisma } from '../../src/lib/prisma';
import { getDriver } from '../../src/lib/neo4j';
import { CanonicalBattle, CanonicalParticipation, reconcileBattles } from '../../src/lib/canonicalBattles';

const apply = process.argv.includes('--apply');
const strict = process.argv.includes('--strict');

const battleGraphQuery = `
  MATCH (battle:Battle)
  RETURN battle.slug AS slug,
         battle.name AS name,
         battle.nameTransliterated AS nameTransliterated,
         battle.hijriYear AS hijriYear,
         battle.location AS location,
         battle.locationEn AS locationEn
`;

const participationGraphQuery = `
  MATCH (person:Person)-[rel:PARTICIPATED_IN]->(battle:Battle)
  RETURN person.slug AS personSlug,
         battle.slug AS battleSlug,
         rel.status AS status,
         rel.isMuslim AS isMuslim,
         rel.courage AS courage
`;

const battleUpsertQuery = `
  UNWIND $battles AS battle
  MERGE (node:Battle {slug: battle.slug})
  SET node.name = battle.name
  FOREACH (_ IN CASE WHEN battle.nameTransliterated IS NULL THEN [] ELSE [1] END |
    SET node.nameTransliterated = battle.nameTransliterated)
  FOREACH (_ IN CASE WHEN battle.hijriYear IS NULL THEN [] ELSE [1] END |
    SET node.hijriYear = battle.hijriYear)
  FOREACH (_ IN CASE WHEN battle.location IS NULL THEN [] ELSE [1] END |
    SET node.location = battle.location)
  FOREACH (_ IN CASE WHEN battle.locationEn IS NULL THEN [] ELSE [1] END |
    SET node.locationEn = battle.locationEn)
`;

// MATCH (not MERGE) on person/battle: this only links people and battles that
// already have a synced node. A participation whose person or battle node is
// missing is silently skipped here and stays reported as postgresOnly until
// that node exists (via people:sync or a battles:sync re-run).
const participationUpsertQuery = `
  UNWIND $participations AS p
  MATCH (person:Person {slug: p.personSlug}), (battle:Battle {slug: p.battleSlug})
  MERGE (person)-[rel:PARTICIPATED_IN]->(battle)
  SET rel.status = p.status, rel.isMuslim = p.isMuslim
  FOREACH (_ IN CASE WHEN p.courage IS NULL THEN [] ELSE [1] END |
    SET rel.courage = p.courage)
`;

function printList(label: string, items: string[]) {
  console.log(`${label}: ${items.length}${items.length ? ` (${items.join(', ')})` : ''}`);
}

async function main() {
  const postgresBattles: CanonicalBattle[] = await prisma.battle.findMany({
    select: { slug: true, name: true, nameTransliterated: true, hijriYear: true, location: true, locationEn: true },
    orderBy: { slug: 'asc' },
  });
  const postgresParticipationRows = await prisma.battleParticipation.findMany({
    select: {
      status: true,
      isMuslim: true,
      courage: true,
      person: { select: { slug: true } },
      battle: { select: { slug: true } },
    },
  });
  const postgresParticipations: CanonicalParticipation[] = postgresParticipationRows.map((row) => ({
    personSlug: row.person.slug,
    battleSlug: row.battle.slug,
    status: row.status,
    isMuslim: row.isMuslim,
    courage: row.courage,
  }));

  const session = getDriver().session({
    database: process.env.NEO4J_DATABASE || 'neo4j',
    defaultAccessMode: neo4j.session.READ,
  });

  try {
    const [battleResult, participationResult] = await Promise.all([
      session.run(battleGraphQuery),
      session.run(participationGraphQuery),
    ]);
    const graphBattles: CanonicalBattle[] = battleResult.records.map((record) => ({
      slug: record.get('slug') ?? '',
      name: record.get('name') ?? '',
      nameTransliterated: record.get('nameTransliterated') ?? null,
      hijriYear: record.get('hijriYear') ?? null,
      location: record.get('location') ?? null,
      locationEn: record.get('locationEn') ?? null,
    }));
    const graphParticipations: CanonicalParticipation[] = participationResult.records.map((record) => ({
      personSlug: record.get('personSlug') ?? '',
      battleSlug: record.get('battleSlug') ?? '',
      status: record.get('status') ?? [],
      isMuslim: record.get('isMuslim') ?? false,
      courage: record.get('courage') ?? null,
    }));

    const report = reconcileBattles(postgresBattles, graphBattles, postgresParticipations, graphParticipations);

    console.log(`Canonical battles reconciliation (${apply ? 'apply' : 'dry run'})`);
    printList('PostgreSQL battles', postgresBattles.map((battle) => battle.slug));
    printList('Neo4j battles', graphBattles.map((battle) => battle.slug));
    printList('Battles missing from Neo4j', report.battlesPostgresOnly);
    printList('Graph-only battles (kept)', report.battlesGraphOnly);
    console.log(`Battle property mismatches: ${report.battleMismatches.length}`);
    for (const mismatch of report.battleMismatches) {
      console.log(`  ${mismatch.slug}.${mismatch.field}: PostgreSQL=${JSON.stringify(mismatch.postgres)}, Neo4j=${JSON.stringify(mismatch.neo4j)}`);
    }

    printList('Participations missing from Neo4j', report.participationsPostgresOnly);
    printList('Graph-only participations (kept)', report.participationsGraphOnly);
    console.log(`Participation property mismatches: ${report.participationMismatches.length}`);
    for (const mismatch of report.participationMismatches) {
      console.log(`  ${mismatch.key}.${mismatch.field}: PostgreSQL=${JSON.stringify(mismatch.postgres)}, Neo4j=${JSON.stringify(mismatch.neo4j)}`);
    }

    const validationIssues = [
      ...report.invalidPostgresBattles,
      ...report.invalidNeo4jBattles,
      ...report.invalidPostgresParticipations,
      ...report.invalidNeo4jParticipations,
    ];
    if (validationIssues.length) {
      console.error('Invalid canonical data:');
      for (const issue of validationIssues) console.error(`  ${issue}`);
      process.exitCode = 1;
      return;
    }

    const hasDrift = report.battlesPostgresOnly.length || report.battleMismatches.length
      || report.participationsPostgresOnly.length || report.participationMismatches.length;

    if (apply) {
      const writeSession = getDriver().session({
        database: process.env.NEO4J_DATABASE || 'neo4j',
        defaultAccessMode: neo4j.session.WRITE,
      });
      try {
        // PostgreSQL is authoritative for battle rosters. These MERGEs only
        // create missing nodes/relationships or update shared properties;
        // they never delete nodes, relationships, or Neo4j-only properties.
        await writeSession.executeWrite(async (transaction) => {
          await transaction.run(battleUpsertQuery, { battles: postgresBattles });
          await transaction.run(participationUpsertQuery, { participations: postgresParticipations });
        });
        console.log(`Synchronized ${postgresBattles.length} battles and ${postgresParticipations.length} participations to Neo4j.`);
      } finally {
        await writeSession.close();
      }
    } else if (hasDrift) {
      console.log('No data changed. Re-run with --apply to synchronize PostgreSQL battles and participations to Neo4j.');
    }

    if (strict && hasDrift) {
      process.exitCode = 1;
    }
  } finally {
    await session.close();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Canonical battles reconciliation failed:', error);
  process.exitCode = 1;
});
