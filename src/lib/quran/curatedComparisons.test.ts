import { describe, expect, it } from 'vitest';
import { curatedComparisons, curatedComparisonHref } from './curatedComparisons';

const selections = [
  ['moses-pharaoh', 7, 103, 137, 26, 10, 68],
  ['noah', 7, 59, 64, 26, 105, 122],
  ['hud', 7, 65, 72, 26, 123, 140],
  ['salih', 7, 73, 79, 26, 141, 159],
  ['lot', 7, 80, 84, 26, 160, 175],
  ['shuayb', 7, 85, 93, 26, 176, 191],
  ['creation-iblis', 15, 26, 44, 38, 71, 85],
] as const;

describe('curated passage comparisons', () => {
  it('contains exactly the seven agreed passage pairs in their reading order', () => {
    expect(curatedComparisons.map(preset => [preset.id, preset.a.surah, preset.a.from, preset.a.to, preset.b.surah, preset.b.from, preset.b.to])).toEqual(selections);
    for (const preset of curatedComparisons) {
      expect(preset.name.ar.trim()).not.toBe('');
      expect(preset.name.en.trim()).not.toBe('');
      expect(preset.name.ar).not.toBe(preset.name.en);
    }
  });

  it.each(selections)('shares the exact %s ranges without unrelated filters', (id, a, af, at, b, bf, bt) => {
    const preset = curatedComparisons.find(preset => preset.id === id)!;
    const href = new URL(curatedComparisonHref(preset), 'https://namaq.test');
    expect(href.pathname).toBe('/quran/compare');
    expect(Object.fromEntries(href.searchParams)).toEqual({ a: String(a), af: String(af), at: String(at), b: String(b), bf: String(bf), bt: String(bt), view: 'ayat', preset: id });
  });
});
