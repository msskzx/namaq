import { describe, expect, it } from 'vitest';
import pairs from './data/index';

const AYAT: Record<string, [number, number]> = { '16-43': [128, 89], '70-80': [44, 42] };

describe.each(Object.keys(pairs))('themes between surahs %s', (key) => {
  const themes = pairs[key];
  const [a, b] = AYAT[key];

  it('keeps every range inside its surah and in order', () => {
    for (const t of themes) {
      expect(t.a.from).toBeGreaterThanOrEqual(1);
      expect(t.a.from).toBeLessThanOrEqual(t.a.to);
      expect(t.a.to).toBeLessThanOrEqual(a);
      expect(t.b.from).toBeGreaterThanOrEqual(1);
      expect(t.b.from).toBeLessThanOrEqual(t.b.to);
      expect(t.b.to).toBeLessThanOrEqual(b);
    }
  });

  it('has no duplicate pair of ranges', () => {
    const keys = themes.map((t) => `${t.a.from}-${t.a.to}:${t.b.from}-${t.b.to}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('themes pair registry', () => {
  it('has a size entry for every registered pair', () => {
    expect(Object.keys(pairs).sort()).toEqual(Object.keys(AYAT).sort());
  });

  const has = (key: string, a: [number, number], b: [number, number]) =>
    pairs[key].some((t) => t.a.from === a[0] && t.a.to === a[1] && t.b.from === b[0] && t.b.to === b[1]);

  it('lists the owner-checked parallels, including the lifted harm and the broken pledge', () => {
    expect(has('16-43', [3, 3], [9, 9])).toBe(true);
    expect(has('16-43', [57, 57], [16, 16])).toBe(true);
    expect(has('16-43', [53, 55], [48, 50])).toBe(true);
  });

  it('lists the kin pair of Al-Ma\'arij and \'Abasa', () => {
    expect(has('70-80', [10, 14], [34, 37])).toBe(true);
  });
});
