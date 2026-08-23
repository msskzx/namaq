import { NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';
import { prisma } from '@/lib/prisma';
import { GraphData, GraphLink, GraphNodeFull } from '@/types/graph';

type EntityType = 'person' | 'battle' | 'title' | 'event';
const KNOWN_TYPES: readonly EntityType[] = ['person', 'battle', 'title', 'event'];

const nodeKey = (type: string, slug: string) => `${type}:${slug}`;

function labelsToType(labels: string[]): EntityType | null {
  for (const label of labels) {
    const type = label.toLowerCase();
    if ((KNOWN_TYPES as readonly string[]).includes(type)) return type as EntityType;
  }
  return null;
}

// A single unified query over every entity type this graph spans, rather
// than one query per type (and, for titles, a separate Postgres-only
// lookup as before): this is what makes it one traversable graph instead
// of Person/Battle from Neo4j merged with a disconnected Postgres-only
// titles view. Mirrors the query shape in
// scripts/graph/computeGraphLayout.ts, which computes graphRank/clusterId/
// layoutX/layoutY over the same node/edge set.
const nodesQuery = `
  MATCH (n)
  WHERE n:Person OR n:Battle OR n:Title OR n:Event
  RETURN labels(n) AS labels, n.slug AS slug, n.name AS name
`;

const edgesQuery = `
  MATCH (a)-[r]->(b)
  WHERE (a:Person OR a:Battle OR a:Title OR a:Event) AND (b:Person OR b:Battle OR b:Title OR b:Event)
  RETURN labels(a) AS sourceLabels, a.slug AS sourceSlug, type(r) AS relType, r.status AS status,
         labels(b) AS targetLabels, b.slug AS targetSlug
`;

interface RankRow {
  slug: string;
  nasabRank?: number | null;
  graphRank: number | null;
  clusterId: number | null;
  layoutX: number | null;
  layoutY: number | null;
}

export async function GET() {
  const session = getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Database configuration is missing' },
      { status: 500 }
    );
  }

  try {
    // Sequential, not Promise.all: a single session can't run two queries
    // concurrently.
    const nodesResult = await session.run(nodesQuery);
    const edgesResult = await session.run(edgesQuery);

    const nodes = new Map<string, GraphNodeFull>();
    for (const record of nodesResult.records) {
      const type = labelsToType(record.get('labels'));
      const slug = record.get('slug');
      if (!type || !slug) continue;
      const key = nodeKey(type, slug);
      if (!nodes.has(key)) {
        nodes.set(key, { id: key, label: record.get('name') ?? slug, slug, group: 1, type });
      }
    }

    const links: GraphLink[] = [];
    for (const record of edgesResult.records) {
      const sourceType = labelsToType(record.get('sourceLabels'));
      const targetType = labelsToType(record.get('targetLabels'));
      const sourceSlug = record.get('sourceSlug');
      const targetSlug = record.get('targetSlug');
      if (!sourceType || !targetType || !sourceSlug || !targetSlug) continue;
      links.push({
        source: nodeKey(sourceType, sourceSlug),
        target: nodeKey(targetType, targetSlug),
        label: record.get('relType'),
        value: 1,
        status: record.get('status') ?? undefined,
      });
    }

    // graphRank/clusterId/layoutX/layoutY (and, for people, nasabRank) live
    // in PostgreSQL, not Neo4j, so they're joined in per type after the
    // graph shape is built, same pattern as the previous nasabRank-only join.
    const nodeList = Array.from(nodes.values());
    const slugsByType = new Map<EntityType, string[]>();
    for (const node of nodeList) {
      const type = (node.type ?? 'person') as EntityType;
      slugsByType.set(type, [...(slugsByType.get(type) ?? []), node.slug]);
    }

    const rankSelect = { slug: true, graphRank: true, clusterId: true, layoutX: true, layoutY: true } as const;
    const [people, battles, titles, events] = await Promise.all([
      prisma.person.findMany({ where: { slug: { in: slugsByType.get('person') ?? [] } }, select: { ...rankSelect, nasabRank: true } }),
      prisma.battle.findMany({ where: { slug: { in: slugsByType.get('battle') ?? [] } }, select: rankSelect }),
      prisma.title.findMany({ where: { slug: { in: slugsByType.get('title') ?? [] } }, select: rankSelect }),
      prisma.event.findMany({ where: { slug: { in: slugsByType.get('event') ?? [] } }, select: rankSelect }),
    ]);

    const rowsByKey = new Map<string, RankRow>([
      ...people.map((row): [string, RankRow] => [nodeKey('person', row.slug), row]),
      ...battles.map((row): [string, RankRow] => [nodeKey('battle', row.slug), row]),
      ...titles.map((row): [string, RankRow] => [nodeKey('title', row.slug), row]),
      ...events.map((row): [string, RankRow] => [nodeKey('event', row.slug), row]),
    ]);

    for (const node of nodeList) {
      const row = rowsByKey.get(node.id);
      if (!row) continue;
      node.graphRank = row.graphRank;
      node.clusterId = row.clusterId;
      if (node.type === 'person') node.nasabRank = row.nasabRank ?? null;
      if (row.layoutX != null && row.layoutY != null) {
        // Pinned (fx/fy), not just a starting position: computeGraphLayout.ts
        // already ran collision avoidance offline for these nodes, so
        // letting the live force simulation move them away from that would
        // just reintroduce the overlap it was computed to avoid. Nodes
        // without a precomputed position (e.g. lineage-only ancestors with
        // no PostgreSQL row) are left free to settle via live physics.
        node.x = row.layoutX;
        node.y = row.layoutY;
        node.fx = row.layoutX;
        node.fy = row.layoutY;
      }
    }

    const body: GraphData = { nodes: nodeList, links };
    return NextResponse.json(body);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch combined graph data' },
      { status: 500 }
    );
  }
}
