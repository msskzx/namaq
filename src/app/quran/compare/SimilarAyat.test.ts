import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/prisma', () => ({ prisma: {} }));
const { similarFor } = await import('./SimilarAyat');

describe('similarFor', () => {
  it('puts the asked surah on side a, ordered by its ayah', () => {
    const pairs = similarFor(80);
    expect(pairs.length).toBeGreaterThan(0);
    expect(pairs.every(p => p.a[0] === 80)).toBe(true);
    expect(pairs.map(p => p.a[1])).toEqual([...pairs.map(p => p.a[1])].sort((x, y) => x - y));
    const mudaththir = pairs.find(p => p.b.join() === '74,54,55')!;
    expect(mudaththir.a).toEqual([80, 11, 12]);
    expect(mudaththir.marksA.map(m => m.slice(0, 3))).toContainEqual([11, 1, 1]);
  });

  it('keeps only the pairs between two surahs, in either order', () => {
    expect(similarFor(76, 73).map(p => [p.a, p.b])).toContainEqual([[76, 29, 29], [73, 19, 19]]);
    expect(similarFor(76, 73).every(p => p.a[0] === 76 && p.b[0] === 73)).toBe(true);
  });
});
