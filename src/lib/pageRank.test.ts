import { describe, expect, it } from 'vitest';
import { computePageRank, rankByScore } from './pageRank';

function adjacencyOf(keys: string[], pairs: [string, string][]): Map<string, Set<string>> {
  const adjacency = new Map(keys.map((key) => [key, new Set<string>()]));
  for (const [a, b] of pairs) {
    adjacency.get(a)!.add(b);
    adjacency.get(b)!.add(a);
  }
  return adjacency;
}

describe('computePageRank', () => {
  it('ranks a hub above its spokes', () => {
    const keys = ['hub', 's1', 's2', 's3', 's4'];
    const adjacency = adjacencyOf(keys, keys.slice(1).map((spoke): [string, string] => ['hub', spoke]));
    const scores = computePageRank(adjacency, keys);
    const hubScore = scores.get('hub')!;
    for (const spoke of keys.slice(1)) {
      expect(hubScore).toBeGreaterThan(scores.get(spoke)!);
    }
  });

  it('conserves total rank mass at (approximately) 1', () => {
    const keys = ['a', 'b', 'c', 'd'];
    const scores = computePageRank(adjacencyOf(keys, [['a', 'b'], ['c', 'd']]), keys);
    const total = [...scores.values()].reduce((sum, score) => sum + score, 0);
    expect(total).toBeCloseTo(1, 6);
  });

  it('scores symmetric, disconnected pairs equally', () => {
    const keys = ['a', 'b', 'c', 'd'];
    const scores = computePageRank(adjacencyOf(keys, [['a', 'b'], ['c', 'd']]), keys);
    expect(scores.get('a')).toBeCloseTo(scores.get('c')!, 10);
    expect(scores.get('b')).toBeCloseTo(scores.get('d')!, 10);
  });

  // Every key dangling is the case where the mass redistribution above has to
  // carry the whole iteration; without it the scores would decay to zero.
  it('does not crash and still produces conserved mass for a fully isolated graph', () => {
    const keys = ['a', 'b', 'c'];
    const scores = computePageRank(adjacencyOf(keys, []), keys);
    const total = [...scores.values()].reduce((sum, score) => sum + score, 0);
    expect(total).toBeCloseTo(1, 6);
  });

  it('returns an empty ranking for an empty key list', () => {
    expect(computePageRank(new Map(), [])).toEqual(new Map());
  });
});

describe('rankByScore', () => {
  it('produces a contiguous 1..N ranking ordered by descending score', () => {
    const scores = new Map([['a', 0.1], ['b', 0.5], ['c', 0.3]]);
    const ranked = rankByScore(scores, ['a', 'b', 'c']);
    expect(ranked.map((r) => r.key)).toEqual(['b', 'c', 'a']);
    expect(ranked.map((r) => r.rank)).toEqual([1, 2, 3]);
  });

  it('tie-breaks equal scores deterministically by key', () => {
    const scores = new Map([['zebra', 0.5], ['alpha', 0.5]]);
    const ranked = rankByScore(scores, ['zebra', 'alpha']);
    expect(ranked.map((r) => r.key)).toEqual(['alpha', 'zebra']);
  });
});
