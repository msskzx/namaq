/**
 * Community detection for the unified graph, used to collapse dense regions
 * into a single aggregate node until the viewer zooms in (the "Google Maps"
 * level-of-detail effect). Wraps graphology-communities-louvain rather than
 * hand-rolling Louvain: unlike nasabRank.ts's PageRank, modularity
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

  const partition: Record<string, number> = graph.order > 0 ? louvain(graph) : {};

  return nodes.map((node) => ({
    ...node,
    clusterId: partition[graphNodeKey(node)] ?? 0,
  }));
}
