import 'dotenv/config';
import { prisma } from '../../src/lib/prisma';
import { getDriver } from '../../src/lib/neo4j';
import { computeGraphRank, type GraphNodeRank, type GraphRankNodeType } from '../../src/lib/graphRank';
import { computeGraphClusters, type GraphClusterAssignment } from '../../src/lib/graphCluster';
import { computeGraphLayout, type GraphLayoutNode, type GraphLayoutPosition } from '../../src/lib/graphLayout';
import { rankToTier, tierToRadius } from '../../src/lib/graphLod';
import { fetchUnifiedGraph } from '../../src/lib/fetchUnifiedGraph';

const apply = process.argv.includes('--apply');
const strict = process.argv.includes('--strict');

async function fetchPostgresSlugsByType(): Promise<Map<GraphRankNodeType, Set<string>>> {
  const [people, battles, titles, events] = await Promise.all([
    prisma.person.findMany({ select: { slug: true } }),
    prisma.battle.findMany({ select: { slug: true } }),
    prisma.title.findMany({ select: { slug: true } }),
    prisma.event.findMany({ select: { slug: true } }),
  ]);

  return new Map<GraphRankNodeType, Set<string>>([
    ['person', new Set(people.map((p) => p.slug))],
    ['battle', new Set(battles.map((b) => b.slug))],
    ['title', new Set(titles.map((t) => t.slug))],
    ['event', new Set(events.map((e) => e.slug))],
  ]);
}

async function main() {
  const postgresSlugsByType = await fetchPostgresSlugsByType();

  try {
    const { nodes, edges } = await fetchUnifiedGraph();

    console.log(`Unified graph rank/cluster/layout computation (${apply ? 'apply' : 'dry run'})`);
    console.log(`Neo4j nodes: ${nodes.length}`);
    console.log(`Neo4j edges: ${edges.length}`);

    if (nodes.length === 0) {
      console.error('No nodes found across Person/Battle/Title/Event labels — nothing to compute.');
      process.exitCode = strict ? 1 : 0;
      return;
    }

    const ranked: GraphNodeRank[] = computeGraphRank(nodes, edges);
    const clustered: GraphClusterAssignment[] = computeGraphClusters(nodes, edges);
    const clusterByKey = new Map(clustered.map((entry) => [`${entry.type}:${entry.slug}`, entry.clusterId]));

    const layoutNodes: GraphLayoutNode[] = ranked.map((entry) => ({
      type: entry.type,
      slug: entry.slug,
      clusterId: clusterByKey.get(`${entry.type}:${entry.slug}`) ?? 0,
      radius: tierToRadius(rankToTier(entry.rank, ranked.length)),
    }));
    const positions: GraphLayoutPosition[] = computeGraphLayout(layoutNodes, edges);
    const positionByKey = new Map(positions.map((entry) => [`${entry.type}:${entry.slug}`, entry]));

    const clusterCount = new Set(clustered.map((entry) => entry.clusterId)).size;
    console.log(`Communities found: ${clusterCount}`);

    const rows = ranked.map((entry) => {
      const key = `${entry.type}:${entry.slug}`;
      const position = positionByKey.get(key);
      return {
        type: entry.type,
        slug: entry.slug,
        graphRank: entry.rank,
        clusterId: clusterByKey.get(key) ?? 0,
        layoutX: position?.x ?? 0,
        layoutY: position?.y ?? 0,
      };
    });

    const toWrite = rows.filter((row) => postgresSlugsByType.get(row.type)?.has(row.slug));
    const graphOnly = rows.filter((row) => !postgresSlugsByType.get(row.type)?.has(row.slug));
    console.log(`Entities to update: ${toWrite.length}`);
    console.log(
      `Graph-only entities (no PostgreSQL row, skipped): ${graphOnly.length}${
        graphOnly.length ? ` (${graphOnly.map((row) => `${row.type}:${row.slug}`).join(', ')})` : ''
      }`,
    );

    if (apply) {
      const computedAt = new Date();
      const updates = toWrite.map((row) => {
        const data = { graphRank: row.graphRank, clusterId: row.clusterId, layoutX: row.layoutX, layoutY: row.layoutY, graphRankComputedAt: computedAt };
        switch (row.type) {
          case 'person':
            return prisma.person.update({ where: { slug: row.slug }, data });
          case 'battle':
            return prisma.battle.update({ where: { slug: row.slug }, data });
          case 'title':
            return prisma.title.update({ where: { slug: row.slug }, data });
          case 'event':
            return prisma.event.update({ where: { slug: row.slug }, data });
        }
      });
      await prisma.$transaction(updates);
      console.log(`Wrote graphRank/clusterId/layoutX/layoutY for ${toWrite.length} PostgreSQL rows.`);
    } else {
      console.log('No data changed. Re-run with --apply to persist rank/cluster/layout to PostgreSQL.');
    }

    if (strict && toWrite.length === 0) {
      console.error('Strict mode: nothing was computed (empty graph or connectivity problem).');
      process.exitCode = 1;
    }
  } finally {
    await prisma.$disconnect();
    await getDriver().close();
  }
}

main().catch((error) => {
  console.error('Unified graph rank/cluster/layout computation failed:', error);
  process.exitCode = 1;
});
