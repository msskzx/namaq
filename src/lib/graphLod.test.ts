import { describe, expect, it } from 'vitest';
import { rankToTier, tierToRadius } from './graphLod';

describe('rankToTier', () => {
  it('puts rank 1 in the most prominent tier', () => {
    expect(rankToTier(1, 100)).toBe(0);
  });

  it('puts the least prominent rank in the last tier', () => {
    expect(rankToTier(100, 100, 4)).toBe(3);
  });

  it('splits ranks into roughly even percentile buckets', () => {
    expect(rankToTier(1, 40, 4)).toBe(0);
    expect(rankToTier(11, 40, 4)).toBe(1);
    expect(rankToTier(21, 40, 4)).toBe(2);
    expect(rankToTier(31, 40, 4)).toBe(3);
  });

  it('never returns a tier outside [0, tierCount - 1]', () => {
    expect(rankToTier(0, 10, 4)).toBe(0);
    expect(rankToTier(1000, 10, 4)).toBe(3);
  });

  it('returns 0 for an empty or degenerate graph', () => {
    expect(rankToTier(1, 0)).toBe(0);
  });
});

describe('tierToRadius', () => {
  it('gives the most prominent tier the largest radius', () => {
    expect(tierToRadius(0)).toBeGreaterThan(tierToRadius(1));
    expect(tierToRadius(1)).toBeGreaterThan(tierToRadius(2));
    expect(tierToRadius(2)).toBeGreaterThan(tierToRadius(3));
  });

  it('clamps out-of-range tiers to the nearest valid one', () => {
    expect(tierToRadius(-1)).toBe(tierToRadius(0));
    expect(tierToRadius(99)).toBe(tierToRadius(3));
  });
});
