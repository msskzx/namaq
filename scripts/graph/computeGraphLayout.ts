import 'dotenv/config';
import neo4j from 'neo4j-driver';
import { prisma } from '../../src/lib/prisma';
import { getDriver } from '../../src/lib/neo4j';
import { computeGraphRank, type GraphNodeRank, type GraphRankNodeType } from '../../src/lib/graphRank';
import { computeGraphClusters, type GraphClusterAssignment } from '../../src/lib/graphCluster';
import { computeGraphLayout, type GraphLayoutNode, type GraphLayoutPosition } from '../../src/lib/graphLayout';
import { fetchUnifiedGraph } from '../../src/lib/fetchUnifiedGraph';

const apply = process.argv.includes('--apply');
const strict = process.argv.includes('--strict');

// Mirrors GraphSurface.tsx's nodeRadius formula (textWidth + fontSize,
// floored at fontSize*2, halved) so offline collision spacing keeps the
// *rendered* label circles from overlapping, not the coarse rank-tier
// circles used for level-of-detail sizing elsewhere (graphLod.ts) -- those
// are a different concern (map-style zoom thinning) and are unaffected.
// This script has no canvas to measure real glyph widths with, so it
// approximates: a fixed average px-per-character at the same 12px font
// size the live renderer uses. Some crossing edges and distant related
// subjects from this approximation are an accepted trade-off (see
// docs/graph-layout-plan.md) -- the goal is "accounts for label length",
// not pixel-perfect parity with the canvas-measured live radius.
const LABEL_FONT_SIZE = 12;
const AVERAGE_CHAR_WIDTH_PX = 7;
export function estimateLabelRadius(label: string): number {
  const estimatedTextWidth = label.length * AVERAGE_CHAR_WIDTH_PX;
  return Math.max(estimatedTextWidth + LABEL_FONT_SIZE, LABEL_FONT_SIZE * 2) / 2;
}

export interface LayoutRow {
  type: GraphRankNodeType;
  slug: string;
  x: number;
  y: number;
}

// Persists layoutX/layoutY on every Neo4j subject the layout was computed
// for, not just ones with a PostgreSQL row -- see
// docs/adr/0005-use-a-precomputed-global-graph-map.md. One UNWIND+MATCH+SET
// statement is one Neo4j transaction (matching type by label the same way
// /api/graph/route.ts's relationSubjects query does, since a slug is only
// unique within its own type), and the returned match count is verified
// against the row count so a silently-unmatched subject (typo'd slug,
// deleted node) surfaces as an error instead of a partially-applied map.
export async function writeLayoutToNeo4j(rows: LayoutRow[]): Promise<void> {
  if (rows.length === 0) return;
  const session = getDriver().session({
    database: process.env.NEO4J_DATABASE || 'neo4j',
    defaultAccessMode: neo4j.session.WRITE,
  });
  try {
    const result = await session.executeWrite((tx) =>
      tx.run(
        `UNWIND $rows AS row
         MATCH (n)
         WHERE n.slug = row.slug AND row.type IN [label IN labels(n) | toLower(label)]
         SET n.layoutX = row.x, n.layoutY = row.y
         RETURN count(n) AS matched`,
        { rows },
      ),
    );
    const matched = result.records[0]?.get('matched') ?? 0;
    if (matched !== rows.length) {
      throw new Error(`Matched ${matched} of ${rows.length} expected Neo4j subjects while writing layout positions.`);
    }
  } finally {
    await session.close();
  }
}

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

    const labelByKey = new Map(nodes.map((node) => [`${node.type}:${node.slug}`, node.label]));
    const layoutNodes: GraphLayoutNode[] = ranked.map((entry) => ({
      type: entry.type,
      slug: entry.slug,
      clusterId: clusterByKey.get(`${entry.type}:${entry.slug}`) ?? 0,
      radius: estimateLabelRadius(labelByKey.get(`${entry.type}:${entry.slug}`) ?? entry.slug),
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

    // Every subject needs a usable position -- see docs/graph-layout-plan.md
    // ("Validate complete, finite coordinates before writing"). A NaN/Infinity
    // here would mean a bug in the layout math, not a data gap, so it aborts
    // the whole run (dry run included) rather than writing a partial map.
    const nonFinite = rows.filter((row) => !Number.isFinite(row.layoutX) || !Number.isFinite(row.layoutY));
    if (nonFinite.length > 0) {
      console.error(
        `${nonFinite.length} subject(s) computed a non-finite position, aborting: ${nonFinite.map((row) => `${row.type}:${row.slug}`).join(', ')}`,
      );
      process.exitCode = 1;
      return;
    }

    const toWrite = rows.filter((row) => postgresSlugsByType.get(row.type)?.has(row.slug));
    const graphOnly = rows.filter((row) => !postgresSlugsByType.get(row.type)?.has(row.slug));
    console.log(`Entities to update: ${toWrite.length}`);
    console.log(
      `Graph-only entities (no PostgreSQL row): ${graphOnly.length}${
        graphOnly.length ? ` (${graphOnly.map((row) => `${row.type}:${row.slug}`).join(', ')})` : ''
      }`,
    );
    console.log(`Neo4j subjects to receive layoutX/layoutY: ${rows.length} (every subject above, PostgreSQL-backed or graph-only)`);

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
      // PostgreSQL and Neo4j writes are separate systems/transactions (see
      // docs/graph-layout-plan.md): either can fail independently, and a
      // rerun of this same command is how you retry -- there is no combined
      // rollback across the two databases.
      await prisma.$transaction(updates);
      console.log(`Wrote graphRank/clusterId/layoutX/layoutY for ${toWrite.length} PostgreSQL rows.`);

      await writeLayoutToNeo4j(rows.map((row) => ({ type: row.type, slug: row.slug, x: row.layoutX, y: row.layoutY })));
      console.log(`Wrote layoutX/layoutY for ${rows.length} Neo4j subjects.`);
    } else {
      console.log('No data changed. Re-run with --apply to persist rank/cluster/layout to PostgreSQL and Neo4j.');
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

// Guards against running the whole CLI (real Postgres/Neo4j writes) as a
// side effect of importing estimateLabelRadius/writeLayoutToNeo4j for tests.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Unified graph rank/cluster/layout computation failed:', error);
    process.exitCode = 1;
  });
}
