import { describe, expect, it } from 'vitest';
import { nearestBar, stepBar } from './bars';

describe('a strip of bars', () => {
  it('snaps a finger between bars to the nearest bar that has the word', () => {
    const counts = new Array(114).fill(0);
    counts[6] = 2; counts[19] = 1;
    expect(nearestBar(counts, 6)).toBe(6);
    expect(nearestBar(counts, 9)).toBe(6);
    expect(nearestBar(counts, 15)).toBe(19);
    expect(nearestBar(counts, 200)).toBe(19);
    expect(nearestBar(counts, -3)).toBe(6);
  });

  it('steps to the next bar that has the word, and stays at the ends', () => {
    const counts = new Array(114).fill(0);
    counts[6] = 2; counts[19] = 1;
    expect(stepBar(counts, 6, 1)).toBe(19);
    expect(stepBar(counts, 19, -1)).toBe(6);
    expect(stepBar(counts, 19, 1)).toBe(19);
    expect(stepBar(counts, 6, -1)).toBe(6);
  });
});
