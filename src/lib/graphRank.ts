/**
 * Cross-type prominence rank for the unified graph (Person, Battle, Title,
 * Event together), as opposed to nasabRank.ts's family-only PageRank used
 * for the sidebar sort. Reuses computePageRank/rankByScore from
 * nasabRank.ts unchanged — that math is already generic over string keys,
 * so there's nothing person-specific to duplicate here. Nodes are keyed by
 * `type:slug` (not slug alone) since slugs are only guaranteed unique
 * within one entity type.
 *
 * No I/O: callers (scripts/graph/computeGraphLayout.ts) fetch nodes/edges
 * from Neo4j and write the result back to PostgreSQL.
 */

import { CentralityAlgorithm, computePageRank, rankByScore } from './nasabRank';

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

/** Same undirected, dedup-by-Set construction as buildFamilyGraph, keyed by type:slug. */
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
    const node = nodesByKey.get(entry.slug)!;
    return { type: node.type, slug: node.slug, rank: entry.rank, score: entry.score };
  });
}
