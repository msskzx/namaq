import { describe, expect, it } from 'vitest';
import { pageInScope, parseScope, scopeParam, type CompareScope } from './compareScope';

const spans = {
  juz: { 2: [1, 3], 3: [3, 4], 56: [27, 27], 69: [29, 29] },
  page: { 2: [2, 49], 3: [50, 76], 56: [534, 537], 69: [566, 567] },
} as { juz: Record<number, [number, number]>; page: Record<number, [number, number]> };
const inScope = (a: number, b: number, scope: CompareScope) => pageInScope({ a, b }, spans, scope);

describe('the compare filter', () => {
  it('keeps a page when either surah has ayat in a juz range', () => {
    expect(inScope(2, 69, { unit: 'juz', from: 26, to: 30 })).toBe(true);
    expect(inScope(56, 69, { unit: 'juz', from: 28, to: 28 })).toBe(false);
    expect(inScope(2, 3, { unit: 'juz', from: 4, to: 10 })).toBe(true);
  });

  it('filters by chapter range, page range and picked chapters or juz', () => {
    expect(inScope(2, 69, { unit: 'surah', from: 60, to: 70 })).toBe(true);
    expect(inScope(2, 3, { unit: 'surah', from: 60, to: 70 })).toBe(false);
    expect(inScope(2, 3, { unit: 'page', from: 60, to: 60 })).toBe(true);
    expect(inScope(56, 69, { unit: 'page', from: 1, to: 100 })).toBe(false);
    expect(inScope(2, 56, { unit: 'surahs', list: [56, 90] })).toBe(true);
    expect(inScope(2, 3, { unit: 'surahs', list: [56] })).toBe(false);
    expect(inScope(2, 3, { unit: 'juzs', list: [4, 30] })).toBe(true);
    expect(inScope(56, 69, { unit: 'juzs', list: [28] })).toBe(false);
  });

  it('reads and writes the address', () => {
    expect(parseScope({ juz: '26-30' })).toEqual({ unit: 'juz', from: 26, to: 30 });
    expect(parseScope({ surah: '2-5' })).toEqual({ unit: 'surah', from: 2, to: 5 });
    expect(parseScope({ page: '1-20' })).toEqual({ unit: 'page', from: 1, to: 20 });
    expect(parseScope({ surahs: '2,3' })).toEqual({ unit: 'surahs', list: [2, 3] });
    expect(parseScope({ juzs: '25' })).toEqual({ unit: 'juzs', list: [25] });
    for (const bad of [{ juz: '30-26' }, { juz: '0-5' }, { juz: '26-31' }, { surahs: 'x' }, {}]) expect(parseScope(bad)).toBeUndefined();
    expect(scopeParam({ unit: 'juz', from: 26, to: 30 })).toBe('&juz=26-30');
    expect(scopeParam({ unit: 'surahs', list: [2, 3] })).toBe('&surahs=2,3');
    expect(scopeParam(undefined)).toBe('');
  });
});
