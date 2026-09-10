/**
 * Community detection for the unified graph, used to collapse dense regions
 * into a single aggregate node until the viewer zooms in (the "Google Maps"
 * level-of-detail effect). Wraps graphology-communities-louvain rather than
 * hand-rolling Louvain: unlike pageRank.ts's PageRank, modularity
 * optimization isn't simple enough to safely reimplement, and graphology is
 * already a dependency for the sigma.js renderer.
 *
 * No I/O: callers (scripts/graph/computeGraphLayout.ts) fetch nodes/edges
 * from Neo4j and write the result back to PostgreSQL.
 */

import Graph from 'graphology';
import louvain from 'graphology-communities-louvain';
import { GraphRankEdge, GraphRankNode, graphNodeKey } from './graphRank';

export interface GraphClusterAssignment extends GraphRankNode {
  clusterId: number;
}

// graphology-communities-louvain defaults to `rng: Math.random` with random
// node-visit order (`randomWalk: true`), so the SAME graph can partition
// into a different number of communities from one run to the next even with
// identical, stably-ordered input -- observed directly (33 vs 34 communities
// on two consecutive dry runs of the same data) while building
// docs/graph-layout.md's reproducibility requirement. A fixed-seed PRNG
// keeps the random walk's benefits (escaping local optima) while making
// "unchanged data" actually reproduce "the same result" rather than merely
// "an equally-valid one" -- mulberry32 rather than a library dependency
// since this project doesn't otherwise depend on a seedable RNG.
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const LOUVAIN_SEED = 1337;

export function computeGraphClusters(nodes: GraphRankNode[], edges: GraphRankEdge[]): GraphClusterAssignment[] {
  const graph = new Graph({ type: 'undirected', multi: false, allowSelfLoops: false });

  for (const node of nodes) {
    const key = graphNodeKey(node);
    if (!graph.hasNode(key)) graph.addNode(key);
  }

  for (const { source, target } of edges) {
    const sourceKey = graphNodeKey(source);
    const targetKey = graphNodeKey(target);
    if (sourceKey === targetKey) continue;
    if (!graph.hasNode(sourceKey) || !graph.hasNode(targetKey)) continue;
    if (!graph.hasEdge(sourceKey, targetKey)) graph.addEdge(sourceKey, targetKey);
  }

  const partition: Record<string, number> = graph.order > 0 ? louvain(graph, { rng: mulberry32(LOUVAIN_SEED) }) : {};

  return nodes.map((node) => ({
    ...node,
    clusterId: partition[graphNodeKey(node)] ?? 0,
  }));
}
