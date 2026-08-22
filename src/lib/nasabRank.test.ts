import { describe, expect, it } from 'vitest';
import {
  applyProphetOverride,
  buildFamilyGraph,
  computeNasabRanks,
  computePageRank,
  rankByScore,
  type FamilyGraphEdge,
  type PersonRank,
} from './nasabRank';

describe('buildFamilyGraph', () => {
  it('gives every node slug an entry, even with zero edges', () => {
    const graph = buildFamilyGraph(['a', 'b', 'c'], []);
    expect(graph.get('a')).toEqual(new Set());
    expect(graph.get('b')).toEqual(new Set());
    expect(graph.get('c')).toEqual(new Set());
  });

  it('links nodes for every relation type, not just direct lineage', () => {
    const edges: FamilyGraphEdge[] = [
      { sourceSlug: 'a', targetSlug: 'b', type: 'MAWLA' },
      { sourceSlug: 'a', targetSlug: 'c', type: 'PATERNAL_COUSIN' },
    ];
    const graph = buildFamilyGraph(['a', 'b', 'c'], edges);
    expect(graph.get('a')).toEqual(new Set(['b', 'c']));
  });

  it('dedupes reciprocal edges (e.g. FATHER one way, SON the other) into one connection', () => {
    const edges: FamilyGraphEdge[] = [
      { sourceSlug: 'hasan', targetSlug: 'ali', type: 'FATHER' },
      { sourceSlug: 'ali', targetSlug: 'hasan', type: 'SON' },
    ];
    const graph = buildFamilyGraph(['ali', 'hasan'], edges);
    expect(graph.get('ali')).toEqual(new Set(['hasan']));
    expect(graph.get('hasan')).toEqual(new Set(['ali']));
  });

  it('ignores self-loops and edges referencing unknown slugs', () => {
    const edges: FamilyGraphEdge[] = [
      { sourceSlug: 'a', targetSlug: 'a', type: 'FATHER' },
      { sourceSlug: 'a', targetSlug: 'ghost', type: 'FATHER' },
    ];
    const graph = buildFamilyGraph(['a'], edges);
    expect(graph.get('a')).toEqual(new Set());
  });
});

describe('computePageRank', () => {
  it('ranks a hub above its spokes', () => {
    const nodeSlugs = ['hub', 's1', 's2', 's3', 's4'];
    const graph = buildFamilyGraph(
      nodeSlugs,
      nodeSlugs.slice(1).map((spoke) => ({ sourceSlug: 'hub', targetSlug: spoke, type: 'FATHER' }))
    );
    const scores = computePageRank(graph, nodeSlugs);
    const hubScore = scores.get('hub')!;
    for (const spoke of nodeSlugs.slice(1)) {
      expect(hubScore).toBeGreaterThan(scores.get(spoke)!);
    }
  });

  it('conserves total rank mass at (approximately) 1', () => {
    const nodeSlugs = ['a', 'b', 'c', 'd'];
    const graph = buildFamilyGraph(nodeSlugs, [
      { sourceSlug: 'a', targetSlug: 'b', type: 'FATHER' },
      { sourceSlug: 'c', targetSlug: 'd', type: 'FATHER' },
    ]);
    const scores = computePageRank(graph, nodeSlugs);
    const total = [...scores.values()].reduce((sum, score) => sum + score, 0);
    expect(total).toBeCloseTo(1, 6);
  });

  it('scores symmetric, disconnected pairs equally', () => {
    const nodeSlugs = ['a', 'b', 'c', 'd'];
    const graph = buildFamilyGraph(nodeSlugs, [
      { sourceSlug: 'a', targetSlug: 'b', type: 'FATHER' },
      { sourceSlug: 'c', targetSlug: 'd', type: 'FATHER' },
    ]);
    const scores = computePageRank(graph, nodeSlugs);
    expect(scores.get('a')).toBeCloseTo(scores.get('c')!, 10);
    expect(scores.get('b')).toBeCloseTo(scores.get('d')!, 10);
  });

  it('does not crash and still produces conserved mass for a fully isolated graph', () => {
    const nodeSlugs = ['a', 'b', 'c'];
    const graph = buildFamilyGraph(nodeSlugs, []);
    const scores = computePageRank(graph, nodeSlugs);
    const total = [...scores.values()].reduce((sum, score) => sum + score, 0);
    expect(total).toBeCloseTo(1, 6);
  });
});

describe('rankByScore', () => {
  it('produces a contiguous 1..N ranking ordered by descending score', () => {
    const scores = new Map([['a', 0.1], ['b', 0.5], ['c', 0.3]]);
    const ranked = rankByScore(scores, ['a', 'b', 'c']);
    expect(ranked.map((r) => r.slug)).toEqual(['b', 'c', 'a']);
    expect(ranked.map((r) => r.rank)).toEqual([1, 2, 3]);
  });

  it('tie-breaks equal scores deterministically by slug', () => {
    const scores = new Map([['zebra', 0.5], ['alpha', 0.5]]);
    const ranked = rankByScore(scores, ['zebra', 'alpha']);
    expect(ranked.map((r) => r.slug)).toEqual(['alpha', 'zebra']);
  });
});

describe('applyProphetOverride', () => {
  const asRanked = (slugs: string[]): PersonRank[] =>
    slugs.map((slug, index) => ({ slug, rank: index + 1, score: slugs.length - index }));

  it('promotes the Prophet to rank 1 even when he scored worst, preserving everyone else\'s relative order', () => {
    const raw = asRanked(['abu-bakr', 'umar', 'ali', 'prophet-muhammad']);
    const final = applyProphetOverride(raw);

    expect(final.map((r) => r.slug)).toEqual(['prophet-muhammad', 'abu-bakr', 'umar', 'ali']);
    expect(final.map((r) => r.rank)).toEqual([1, 2, 3, 4]);
    expect(final.find((r) => r.slug === 'prophet-muhammad')!.score).toBe(raw[3].score);
  });

  it('leaves ordering unchanged when the Prophet already ranks 1', () => {
    const raw = asRanked(['prophet-muhammad', 'abu-bakr', 'umar']);
    const final = applyProphetOverride(raw);
    expect(final.map((r) => r.slug)).toEqual(['prophet-muhammad', 'abu-bakr', 'umar']);
  });

  it('throws when the Prophet slug is absent from the ranked list', () => {
    const raw = asRanked(['abu-bakr', 'umar']);
    expect(() => applyProphetOverride(raw)).toThrow(/prophet-muhammad/);
  });
});

describe('computeNasabRanks', () => {
  const nodeSlugs = ['prophet-muhammad', 'hub', 's1', 's2', 's3'];
  const edges: FamilyGraphEdge[] = [
    { sourceSlug: 'hub', targetSlug: 's1', type: 'FATHER' },
    { sourceSlug: 'hub', targetSlug: 's2', type: 'FATHER' },
    { sourceSlug: 'hub', targetSlug: 's3', type: 'FATHER' },
  ];

  it('returns both the raw and final rankings, differing only by the Prophet moving to the front', () => {
    const { raw, final } = computeNasabRanks(nodeSlugs, edges);

    expect(raw.find((r) => r.slug === 'prophet-muhammad')!.rank).toBeGreaterThan(1);
    expect(final[0].slug).toBe('prophet-muhammad');
    expect(final[0].rank).toBe(1);

    const rawWithoutProphet = raw.filter((r) => r.slug !== 'prophet-muhammad').map((r) => r.slug);
    const finalWithoutProphet = final.filter((r) => r.slug !== 'prophet-muhammad').map((r) => r.slug);
    expect(finalWithoutProphet).toEqual(rawWithoutProphet);
  });

  it('forces the Prophet to rank 1 regardless of which algorithm computed everyone else\'s score', () => {
    const alwaysRankProphetLast = () =>
      new Map(nodeSlugs.map((slug) => [slug, slug === 'prophet-muhammad' ? -1000 : Math.random()]));

    const { final } = computeNasabRanks(nodeSlugs, edges, alwaysRankProphetLast);
    expect(final[0].slug).toBe('prophet-muhammad');
    expect(final[0].rank).toBe(1);
  });
});
