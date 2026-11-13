import { describe, expect, it } from 'vitest';
import { dailyPair } from './daily';

describe('daily pair', () => {
  it('is one ayah from each of two surahs, the same all day', () => {
    const morning = dailyPair(new Date(2026, 10, 13, 6));
    const night = dailyPair(new Date(2026, 10, 13, 23));
    expect(morning?.id).toBe(night?.id);
    expect(morning?.sides.map(side => side.ayat.length)).toEqual([1, 1]);
    expect(morning?.sides[0].surah).not.toBe(morning?.sides[1].surah);
  });

  it('changes from day to day', () => {
    const ids = new Set(Array.from({ length: 14 }, (_, i) => dailyPair(new Date(2026, 10, 1 + i))?.id));
    expect(ids.size).toBeGreaterThan(10);
  });
});
