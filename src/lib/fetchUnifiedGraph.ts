import neo4j from 'neo4j-driver';
import { getDriver } from './neo4j';
import { GraphRankEdge, GraphRankNode, GraphRankNodeType } from './graphRank';

const KNOWN_TYPES = new Set<GraphRankNodeType>(['person', 'battle', 'title', 'event']);

// A single unified query over every entity type this graph spans, rather
// than one query per type: this is exactly what "unified graph" means for
// rank/clustering/layout purposes, and keeps the query in sync with the
// label set automatically as new types are added. Shared by every caller
// that needs the whole graph (scripts/graph/computeGraphLayout.ts,
// graphIntegrity.live.test.ts) so the query and label-mapping logic only
// exist in one place. This is I/O (unlike the rest of src/lib), same as
// neo4j.ts/prisma.ts.
const nodesQuery = `
  MATCH (n)
  WHERE n:Person OR n:Battle OR n:Title OR n:Event
  RETURN labels(n) AS labels, n.slug AS slug, n.name AS name
`;

const edgesQuery = `
  MATCH (a)-[r]->(b)
  WHERE (a:Person OR a:Battle OR a:Title OR a:Event) AND (b:Person OR b:Battle OR b:Title OR b:Event)
  RETURN labels(a) AS sourceLabels, a.slug AS sourceSlug, labels(b) AS targetLabels, b.slug AS targetSlug
`;

function labelsToType(labels: string[]): GraphRankNodeType | null {
  for (const label of labels) {
    const type = label.toLowerCase();
    if (KNOWN_TYPES.has(type as GraphRankNodeType)) return type as GraphRankNodeType;
  }
  return null;
}

export interface UnifiedGraphNode extends GraphRankNode {
  /** The node's display name (Neo4j `name` property), for duplicate detection. */
  label: string;
}

export async function fetchUnifiedGraph(): Promise<{ nodes: UnifiedGraphNode[]; edges: GraphRankEdge[] }> {
  const session = getDriver().session({
    database: process.env.NEO4J_DATABASE || 'neo4j',
    defaultAccessMode: neo4j.session.READ,
  });

  try {
    const nodesResult = await session.run(nodesQuery);
    const edgesResult = await session.run(edgesQuery);

    const nodes: UnifiedGraphNode[] = nodesResult.records
      .map((record) => ({
        type: labelsToType(record.get('labels')),
        slug: record.get('slug') as string,
        label: (record.get('name') as string) ?? '',
      }))
      .filter((node): node is UnifiedGraphNode => node.type !== null && Boolean(node.slug));

    const edges: GraphRankEdge[] = edgesResult.records
      .map((record) => ({
        source: { type: labelsToType(record.get('sourceLabels')), slug: record.get('sourceSlug') as string },
        target: { type: labelsToType(record.get('targetLabels')), slug: record.get('targetSlug') as string },
      }))
      .filter(
        (edge): edge is GraphRankEdge =>
          edge.source.type !== null && edge.target.type !== null && Boolean(edge.source.slug) && Boolean(edge.target.slug),
      );

    return { nodes, edges };
  } finally {
    await session.close();
  }
}
