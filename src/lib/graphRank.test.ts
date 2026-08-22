import { describe, expect, it } from 'vitest';
import { buildGraphAdjacency, computeGraphRank, graphNodeKey, type GraphRankEdge, type GraphRankNode } from './graphRank';

describe('graphNodeKey', () => {
  it('prefixes the slug with its type, so same-slug different-type nodes stay distinct', () => {
    expect(graphNodeKey({ type: 'person', slug: 'badr' })).toBe('person:badr');
    expect(graphNodeKey({ type: 'battle', slug: 'badr' })).toBe('battle:badr');
  });
});

describe('buildGraphAdjacency', () => {
  it('gives every node an entry, even with zero edges', () => {
    const nodes: GraphRankNode[] = [{ type: 'person', slug: 'a' }, { type: 'battle', slug: 'b' }];
    const adjacency = buildGraphAdjacency(nodes, []);
    expect(adjacency.get('person:a')).toEqual(new Set());
    expect(adjacency.get('battle:b')).toEqual(new Set());
  });

  it('links nodes across types', () => {
    const nodes: GraphRankNode[] = [{ type: 'person', slug: 'ali' }, { type: 'battle', slug: 'badr' }];
    const edges: GraphRankEdge[] = [
      { source: { type: 'person', slug: 'ali' }, target: { type: 'battle', slug: 'badr' } },
    ];
    const adjacency = buildGraphAdjacency(nodes, edges);
    expect(adjacency.get('person:ali')).toEqual(new Set(['battle:badr']));
    expect(adjacency.get('battle:badr')).toEqual(new Set(['person:ali']));
  });

  it('does not conflate a person and a battle sharing the same slug', () => {
    const nodes: GraphRankNode[] = [{ type: 'person', slug: 'badr' }, { type: 'battle', slug: 'badr' }];
    const edges: GraphRankEdge[] = [
      { source: { type: 'person', slug: 'other' }, target: { type: 'battle', slug: 'badr' } },
    ];
    const adjacency = buildGraphAdjacency(nodes, edges);
    expect(adjacency.get('person:badr')).toEqual(new Set());
  });

  it('ignores edges referencing unknown nodes', () => {
    const nodes: GraphRankNode[] = [{ type: 'person', slug: 'a' }];
    const edges: GraphRankEdge[] = [
      { source: { type: 'person', slug: 'a' }, target: { type: 'battle', slug: 'ghost' } },
    ];
    const adjacency = buildGraphAdjacency(nodes, edges);
    expect(adjacency.get('person:a')).toEqual(new Set());
  });
});

describe('computeGraphRank', () => {
  it('ranks a cross-type hub above its spokes', () => {
    const nodes: GraphRankNode[] = [
      { type: 'battle', slug: 'hub' },
      { type: 'person', slug: 's1' },
      { type: 'person', slug: 's2' },
      { type: 'title', slug: 's3' },
      { type: 'event', slug: 's4' },
    ];
    const edges: GraphRankEdge[] = nodes.slice(1).map((spoke) => ({ source: nodes[0], target: spoke }));

    const ranked = computeGraphRank(nodes, edges);
    const hub = ranked.find((entry) => entry.slug === 'hub')!;
    const spokes = ranked.filter((entry) => entry.slug !== 'hub');

    expect(hub.rank).toBe(1);
    for (const spoke of spokes) {
      expect(hub.score).toBeGreaterThan(spoke.score);
    }
  });

  it('returns entries carrying the original node type alongside rank and score', () => {
    const nodes: GraphRankNode[] = [{ type: 'title', slug: 'caliph' }];
    const ranked = computeGraphRank(nodes, []);
    expect(ranked).toEqual([{ type: 'title', slug: 'caliph', rank: 1, score: expect.any(Number) }]);
  });
});
