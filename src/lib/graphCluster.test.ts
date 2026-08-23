import { describe, expect, it } from 'vitest';
import { computeGraphClusters } from './graphCluster';
import type { GraphRankEdge, GraphRankNode } from './graphRank';

describe('computeGraphClusters', () => {
  it('assigns every node a clusterId, even an isolated one', () => {
    const nodes: GraphRankNode[] = [{ type: 'person', slug: 'lonely' }];
    const result = computeGraphClusters(nodes, []);
    expect(result).toEqual([{ type: 'person', slug: 'lonely', clusterId: expect.any(Number) }]);
  });

  it('returns an empty result for an empty graph', () => {
    expect(computeGraphClusters([], [])).toEqual([]);
  });

  it('keeps two densely-connected but mutually disconnected cross-type groups apart', () => {
    const groupA: GraphRankNode[] = [
      { type: 'person', slug: 'a1' },
      { type: 'person', slug: 'a2' },
      { type: 'battle', slug: 'a3' },
    ];
    const groupB: GraphRankNode[] = [
      { type: 'title', slug: 'b1' },
      { type: 'event', slug: 'b2' },
      { type: 'person', slug: 'b3' },
    ];
    const nodes = [...groupA, ...groupB];

    const denseEdges = (group: GraphRankNode[]): GraphRankEdge[] => {
      const edges: GraphRankEdge[] = [];
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          edges.push({ source: group[i], target: group[j] });
        }
      }
      return edges;
    };

    const result = computeGraphClusters(nodes, [...denseEdges(groupA), ...denseEdges(groupB)]);
    const clusterIdBySlug = new Map(result.map((entry) => [entry.slug, entry.clusterId]));

    const groupAClusters = new Set(groupA.map((node) => clusterIdBySlug.get(node.slug)));
    const groupBClusters = new Set(groupB.map((node) => clusterIdBySlug.get(node.slug)));

    expect(groupAClusters.size).toBe(1);
    expect(groupBClusters.size).toBe(1);
    expect([...groupAClusters][0]).not.toBe([...groupBClusters][0]);
  });

  it('does not conflate a person and a battle sharing the same slug', () => {
    const nodes: GraphRankNode[] = [{ type: 'person', slug: 'badr' }, { type: 'battle', slug: 'badr' }];
    const result = computeGraphClusters(nodes, []);
    expect(result).toHaveLength(2);
    expect(result.find((entry) => entry.type === 'person')?.slug).toBe('badr');
    expect(result.find((entry) => entry.type === 'battle')?.slug).toBe('badr');
  });
});
