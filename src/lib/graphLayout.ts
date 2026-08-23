/**
 * Precomputed 2D layout for the unified graph, run offline (not live in the
 * browser) so positions are stable across page loads and a force
 * simulation over ~1-2k nodes doesn't have to re-run on every visit. Nodes
 * are pulled toward a per-cluster center (from graphCluster.ts) so a
 * community renders as a visually coherent region, and forceCollide keeps
 * nodes from overlapping at rest — the actual fix for the collision
 * problem this pipeline exists to solve, applied at the data layer instead
 * of fought live in the renderer.
 *
 * No I/O: callers (scripts/graph/computeGraphLayout.ts) write the result to
 * PostgreSQL.
 */

import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force';
import { GraphRankEdge, GraphRankNode, graphNodeKey } from './graphRank';

export interface GraphLayoutNode extends GraphRankNode {
  clusterId: number;
  /** Collision radius, e.g. derived from a rank tier. */
  radius: number;
}

export interface GraphLayoutPosition extends GraphRankNode {
  x: number;
  y: number;
}

interface SimNode extends SimulationNodeDatum {
  key: string;
  clusterId: number;
  radius: number;
}

export interface GraphLayoutOptions {
  iterations?: number;
}

export function computeGraphLayout(
  nodes: GraphLayoutNode[],
  edges: GraphRankEdge[],
  options: GraphLayoutOptions = {},
): GraphLayoutPosition[] {
  const { iterations = 300 } = options;
  if (nodes.length === 0) return [];

  const simNodes: SimNode[] = nodes.map((node) => ({
    key: graphNodeKey(node),
    clusterId: node.clusterId,
    radius: node.radius,
  }));
  const simNodeByKey = new Map(simNodes.map((node) => [node.key, node]));

  const simLinks: SimulationLinkDatum<SimNode>[] = edges
    .map((edge) => ({ sourceKey: graphNodeKey(edge.source), targetKey: graphNodeKey(edge.target) }))
    .filter(({ sourceKey, targetKey }) => sourceKey !== targetKey && simNodeByKey.has(sourceKey) && simNodeByKey.has(targetKey))
    .map(({ sourceKey, targetKey }) => ({ source: simNodeByKey.get(sourceKey)!, target: simNodeByKey.get(targetKey)! }));

  // Distinct clusters get distinct target centers on a ring, so communities
  // separate into their own regions before local forces settle nodes within them.
  const clusterIds = [...new Set(simNodes.map((node) => node.clusterId))];
  const ringRadius = 200 * Math.max(1, Math.sqrt(clusterIds.length));
  const clusterCenter = new Map<number, { x: number; y: number }>(
    clusterIds.map((id, index) => {
      const angle = (2 * Math.PI * index) / clusterIds.length;
      return [id, { x: ringRadius * Math.cos(angle), y: ringRadius * Math.sin(angle) }];
    }),
  );

  const simulation = forceSimulation(simNodes)
    .force('charge', forceManyBody().strength(-30))
    .force('link', forceLink<SimNode, SimulationLinkDatum<SimNode>>(simLinks).distance(40).strength(0.3))
    .force('collide', forceCollide<SimNode>((node) => node.radius + 4))
    .force('clusterX', forceX<SimNode>((node) => clusterCenter.get(node.clusterId)!.x).strength(0.15))
    .force('clusterY', forceY<SimNode>((node) => clusterCenter.get(node.clusterId)!.y).strength(0.15))
    .stop();

  for (let i = 0; i < iterations; i++) simulation.tick();

  return nodes.map((node) => {
    const simNode = simNodeByKey.get(graphNodeKey(node))!;
    return { type: node.type, slug: node.slug, x: simNode.x ?? 0, y: simNode.y ?? 0 };
  });
}
