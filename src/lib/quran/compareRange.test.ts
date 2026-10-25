import { describe, expect, it } from 'vitest';
import { ayahInRange, parseCompareRange, rangeParams, surahInRange } from './compareRange';

describe('compare range', () => {
  it('reads a juz range by default and a surah range when by=surah', () => {
    expect(parseCompareRange({})).toEqual({ unit: 'juz', range: null });
    expect(parseCompareRange({ juzFrom: '30', juzTo: '25' })).toEqual({ unit: 'juz', range: { from: 25, to: 30 } });
    expect(parseCompareRange({ by: 'surah' })).toEqual({ unit: 'surah', range: null });
    expect(parseCompareRange({ by: 'surah', surahFrom: '90', surahTo: '200' })).toEqual({ unit: 'surah', range: { from: 90, to: 114 } });
    expect(parseCompareRange({ surahFrom: '90', surahTo: '114' })).toEqual({ unit: 'juz', range: null });
  });

  it('writes back only what is set', () => {
    expect(rangeParams({ unit: 'juz', range: null })).toEqual({});
    expect(rangeParams({ unit: 'surah', range: { from: 90, to: 114 } })).toEqual({ by: 'surah', surahFrom: '90', surahTo: '114' });
  });

  it('places an ayah by its own juz, so a surah can be cut by a juz range', () => {
    const range = { unit: 'juz' as const, range: { from: 25, to: 30 } };
    expect(ayahInRange(41, 46, range)).toBe(false);
    expect(ayahInRange(41, 47, range)).toBe(true);
    expect(surahInRange(41, range)).toBe(true);
    expect(surahInRange(40, range)).toBe(false);
    expect(surahInRange(114, range)).toBe(true);
  });

  it('places an ayah by its surah in a surah range', () => {
    const range = { unit: 'surah' as const, range: { from: 90, to: 114 } };
    expect(ayahInRange(89, 30, range)).toBe(false);
    expect(ayahInRange(90, 1, range)).toBe(true);
    expect(surahInRange(89, range)).toBe(false);
  });
});
