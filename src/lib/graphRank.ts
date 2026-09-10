/**
 * The one prominence signal defined across every kind of historical subject
 * -- see docs/graph-subject-search.md. Nodes are keyed by `type:slug`,
 * since slugs are only unique within one type.
 *
 * No I/O: callers (scripts/graph/computeGraphLayout.ts) fetch nodes/edges
 * from Neo4j and write the result back to PostgreSQL and Neo4j.
 */

import { CentralityAlgorithm, computePageRank, rankByScore } from './pageRank';

export type GraphRankNodeType = 'person' | 'battle' | 'title' | 'event';

export interface GraphRankNode {
  type: GraphRankNodeType;
  slug: string;
}

export interface GraphRankEdge {
  source: GraphRankNode;
  target: GraphRankNode;
}

export interface GraphNodeRank extends GraphRankNode {
  rank: number;
  score: number;
}

export const graphNodeKey = (node: GraphRankNode) => `${node.type}:${node.slug}`;

/**
 * Set-based rather than a multigraph, so a reciprocal pair stored as two edges
 * (FATHER one way, SON the other) counts once. Every node gets an entry, even
 * an empty one, so an isolated subject never breaks the ranking.
 */
export function buildGraphAdjacency(nodes: GraphRankNode[], edges: GraphRankEdge[]): Map<string, Set<string>> {
  const adjacency = new Map<string, Set<string>>();
  for (const node of nodes) adjacency.set(graphNodeKey(node), new Set());

  for (const { source, target } of edges) {
    const sourceKey = graphNodeKey(source);
    const targetKey = graphNodeKey(target);
    if (sourceKey === targetKey) continue;
    if (!adjacency.has(sourceKey) || !adjacency.has(targetKey)) continue;
    adjacency.get(sourceKey)!.add(targetKey);
    adjacency.get(targetKey)!.add(sourceKey);
  }

  return adjacency;
}

export function computeGraphRank(
  nodes: GraphRankNode[],
  edges: GraphRankEdge[],
  algorithm: CentralityAlgorithm = computePageRank,
): GraphNodeRank[] {
  const keys = nodes.map(graphNodeKey);
  const adjacency = buildGraphAdjacency(nodes, edges);
  const scores = algorithm(adjacency, keys);
  const ranked = rankByScore(scores, keys);

  const nodesByKey = new Map(nodes.map((node) => [graphNodeKey(node), node]));
  return ranked.map((entry) => {
    const node = nodesByKey.get(entry.key)!;
    return { type: node.type, slug: node.slug, rank: entry.rank, score: entry.score };
  });
}
