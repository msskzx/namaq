import { describe, expect, it } from 'vitest';
import { computeGraphLayout, type GraphLayoutNode } from './graphLayout';
import type { GraphRankEdge } from './graphRank';

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

describe('computeGraphLayout', () => {
  it('returns an empty result for an empty graph', () => {
    expect(computeGraphLayout([], [])).toEqual([]);
  });

  it('places a single node without throwing', () => {
    const nodes: GraphLayoutNode[] = [{ type: 'person', slug: 'lonely', clusterId: 0, radius: 5 }];
    const [position] = computeGraphLayout(nodes, []);
    expect(Number.isFinite(position.x)).toBe(true);
    expect(Number.isFinite(position.y)).toBe(true);
  });

  it('keeps same-cluster nodes closer together than to a different cluster', () => {
    const nodes: GraphLayoutNode[] = [
      { type: 'person', slug: 'a1', clusterId: 0, radius: 5 },
      { type: 'person', slug: 'a2', clusterId: 0, radius: 5 },
      { type: 'battle', slug: 'b1', clusterId: 1, radius: 5 },
      { type: 'title', slug: 'b2', clusterId: 1, radius: 5 },
    ];
    const edges: GraphRankEdge[] = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[2], target: nodes[3] },
    ];

    const positions = computeGraphLayout(nodes, edges);
    const bySlug = new Map(positions.map((p) => [p.slug, p]));

    const withinClusterA = distance(bySlug.get('a1')!, bySlug.get('a2')!);
    const acrossClusters = distance(bySlug.get('a1')!, bySlug.get('b1')!);
    expect(withinClusterA).toBeLessThan(acrossClusters);
  });

  it('does not conflate a person and a battle sharing the same slug', () => {
    const nodes: GraphLayoutNode[] = [
      { type: 'person', slug: 'badr', clusterId: 0, radius: 5 },
      { type: 'battle', slug: 'badr', clusterId: 1, radius: 5 },
    ];
    const positions = computeGraphLayout(nodes, []);
    expect(positions).toHaveLength(2);
    expect(positions.find((p) => p.type === 'person')).toBeDefined();
    expect(positions.find((p) => p.type === 'battle')).toBeDefined();
  });

  it('spreads out heavily overlapping same-cluster nodes to respect collision radius', () => {
    const nodes: GraphLayoutNode[] = Array.from({ length: 6 }, (_, i) => ({
      type: 'person' as const,
      slug: `n${i}`,
      clusterId: 0,
      radius: 20,
    }));
    const positions = computeGraphLayout(nodes, []);

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        expect(distance(positions[i], positions[j])).toBeGreaterThan(30);
      }
    }
  });
});
