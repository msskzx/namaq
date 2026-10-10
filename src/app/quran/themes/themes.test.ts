import { describe, expect, it } from 'vitest';
import themes from './data/themes.json';

const AYAT = { a: 128, b: 89 };

describe('themes between An-Nahl and Az-Zukhruf', () => {
  it('keeps every range inside its surah and in order', () => {
    for (const t of themes) {
      expect(t.a.from).toBeGreaterThanOrEqual(1);
      expect(t.a.from).toBeLessThanOrEqual(t.a.to);
      expect(t.a.to).toBeLessThanOrEqual(AYAT.a);
      expect(t.b.from).toBeGreaterThanOrEqual(1);
      expect(t.b.from).toBeLessThanOrEqual(t.b.to);
      expect(t.b.to).toBeLessThanOrEqual(AYAT.b);
    }
  });

  it('lists the owner-checked parallels, including the lifted harm and the broken pledge', () => {
    const has = (a: [number, number], b: [number, number]) => themes.some((t) => t.a.from === a[0] && t.a.to === a[1] && t.b.from === b[0] && t.b.to === b[1]);
    expect(has([3, 3], [9, 9])).toBe(true);
    expect(has([57, 57], [16, 16])).toBe(true);
    expect(has([53, 55], [48, 50])).toBe(true);
  });

  it('has no duplicate pair of ranges', () => {
    const keys = themes.map((t) => `${t.a.from}-${t.a.to}:${t.b.from}-${t.b.to}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
