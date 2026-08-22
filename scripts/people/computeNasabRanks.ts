import 'dotenv/config';
import neo4j from 'neo4j-driver';
import { prisma } from '../../src/lib/prisma';
import { getDriver } from '../../src/lib/neo4j';
import { computeNasabRanks, type FamilyGraphEdge, type PersonRank } from '../../src/lib/nasabRank';

const apply = process.argv.includes('--apply');
const strict = process.argv.includes('--strict');

const nodesQuery = `MATCH (person:Person) RETURN person.slug AS slug`;
const edgesQuery = `
  MATCH (a:Person)-[r]->(b:Person)
  RETURN a.slug AS sourceSlug, type(r) AS type, b.slug AS targetSlug
`;

function printRankTable(label: string, ranked: PersonRank[]) {
  console.log(`\n${label} (${ranked.length}):`);
  for (const { rank, slug, score } of ranked) {
    console.log(`  ${rank}. ${slug} (score=${score.toFixed(6)})`);
  }
}

async function main() {
  const postgresSlugs = new Set(
    (await prisma.person.findMany({ select: { slug: true } })).map((person) => person.slug)
  );

  const session = getDriver().session({
    database: process.env.NEO4J_DATABASE || 'neo4j',
    defaultAccessMode: neo4j.session.READ,
  });

  try {
    const nodesResult = await session.run(nodesQuery);
    const edgesResult = await session.run(edgesQuery);

    const nodeSlugs = nodesResult.records.map((record) => record.get('slug') as string).filter(Boolean);
    const edges: FamilyGraphEdge[] = edgesResult.records.map((record) => ({
      sourceSlug: record.get('sourceSlug'),
      targetSlug: record.get('targetSlug'),
      type: record.get('type'),
    }));

    console.log(`Nasab rank computation (${apply ? 'apply' : 'dry run'})`);
    console.log(`Neo4j Person nodes: ${nodeSlugs.length}`);
    console.log(`Neo4j relationship edges: ${edges.length}`);

    let raw: PersonRank[];
    let final: PersonRank[];
    try {
      ({ raw, final } = computeNasabRanks(nodeSlugs, edges));
    } catch (error) {
      console.error('Rank computation failed:', error instanceof Error ? error.message : error);
      process.exitCode = 1;
      return;
    }

    printRankTable('Raw ranking (before the Prophet override)', raw);
    printRankTable('Final ranking (after the Prophet override)', final);

    const prophetFinalRank = final.find((entry) => entry.slug === 'prophet-muhammad')?.rank;
    console.log(`\nprophet-muhammad final rank: ${prophetFinalRank ?? 'MISSING'}`);

    const toWrite = final.filter((entry) => postgresSlugs.has(entry.slug));
    const graphOnly = final.filter((entry) => !postgresSlugs.has(entry.slug));
    const neo4jSlugSet = new Set(nodeSlugs);
    const postgresOnly = [...postgresSlugs].filter((slug) => !neo4jSlugSet.has(slug)).sort();

    console.log(`\nProfiles to update: ${toWrite.length}`);
    console.log(`Graph-only people (no PostgreSQL profile, skipped): ${graphOnly.length}`);
    console.log(`PostgreSQL profiles missing from Neo4j (untouched): ${postgresOnly.length}${postgresOnly.length ? ` (${postgresOnly.join(', ')})` : ''}`);

    if (apply) {
      const computedAt = new Date();
      await prisma.$transaction(
        toWrite.map(({ slug, rank }) =>
          prisma.person.update({ where: { slug }, data: { nasabRank: rank, nasabRankComputedAt: computedAt } })
        )
      );
      console.log(`\nWrote nasabRank for ${toWrite.length} PostgreSQL profiles.`);
    } else {
      console.log('\nNo data changed. Re-run with --apply to persist these ranks to PostgreSQL.');
    }

    if (strict && toWrite.length === 0) {
      console.error('Strict mode: no profiles were ranked (empty graph or connectivity problem).');
      process.exitCode = 1;
    }
  } finally {
    await session.close();
    await prisma.$disconnect();
    await getDriver().close();
  }
}

main().catch((error) => {
  console.error('Nasab rank computation failed:', error);
  process.exitCode = 1;
});
