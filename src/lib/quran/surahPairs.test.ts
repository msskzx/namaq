import { describe, expect, it } from 'vitest';
import { groupBySurah } from './surahPairs';

describe('groupBySurah', () => {
  it('lists a pair under both of its surahs', () => {
    const groups = groupBySurah([[2, 3], [3, 2], [2, 40]]);
    expect(groups.find(g => g.surah === 2)!.partners).toEqual([{ other: 3, count: 2 }, { other: 40, count: 1 }]);
    expect(groups.find(g => g.surah === 3)!.partners).toEqual([{ other: 2, count: 2 }]);
    expect(groups.find(g => g.surah === 40)!.partners).toEqual([{ other: 2, count: 1 }]);
  });

  it('counts pairs inside one surah apart from its partners, and in its total', () => {
    const [only] = groupBySurah([[55, 55], [55, 55], [55, 56]]);
    expect(only).toEqual({ surah: 55, self: 2, partners: [{ other: 56, count: 1 }], total: 3 });
  });

  it('orders surahs by number and partners by count, then number', () => {
    const groups = groupBySurah([[9, 1], [9, 4], [9, 2], [9, 2]]);
    expect(groups.map(g => g.surah)).toEqual([1, 2, 4, 9]);
    expect(groups.find(g => g.surah === 9)!.partners.map(p => p.other)).toEqual([2, 1, 4]);
  });

  it('keeps a surah with no pair, with nothing under it', () => {
    expect(groupBySurah([[2, 3]], [1, 2, 3]).find(g => g.surah === 1)).toEqual({ surah: 1, self: 0, partners: [], total: 0 });
  });
});
