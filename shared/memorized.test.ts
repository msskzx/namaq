import { describe, expect, it } from 'vitest';
import { withMemorizedScope, touchesMemorized, isMemorized, memorizedFilters, memorizedKeys, recallOfDay } from './memorized';

describe('memorized', () => {
  const juz30 = { unit: 'juz' as const, picked: [30] };
  const ikhlas = { unit: 'surah' as const, picked: [112, 114] };

  it('knows which ayat are memorized, by juz or surah; nothing said counts everything', () => {
    expect(isMemorized('78:1', juz30)).toBe(true);
    expect(isMemorized('77:50', juz30)).toBe(false);
    expect(isMemorized('112:4', ikhlas)).toBe(true);
    expect(isMemorized('113:1', ikhlas)).toBe(false);
    expect(isMemorized('2:255', null)).toBe(true);
  });

  it('puts first what touches a picked range', () => {
    expect(touchesMemorized(['78:1', '114:6'], juz30)).toBe(true);
    expect(touchesMemorized(['78:1', '2:1'], juz30)).toBe(true);
    expect(touchesMemorized(['2:1', '3:1'], juz30)).toBe(false);
    expect(touchesMemorized(['78:1'], null)).toBe(false);
    expect(touchesMemorized(['78:1'], { all: true })).toBe(false);
  });

  it('asks about memorized ayat only', () => {
    expect(memorizedKeys(ikhlas)).toEqual(['112:1', '112:2', '112:3', '112:4', '114:1', '114:2', '114:3', '114:4', '114:5', '114:6']);
    expect(memorizedKeys({ all: true }).length).toBe(6236);
    expect(memorizedKeys(null)).toEqual([]);
    for (let day = 0; day < 30; day++) expect(isMemorized(recallOfDay(juz30, day)!, juz30)).toBe(true);
    expect(recallOfDay(null, 3)).toBeUndefined();
  });

  it('gives the quiz filters', () => {
    expect(memorizedFilters(juz30)).toEqual({ juz: '30' });
    expect(memorizedFilters(ikhlas)).toEqual({ surahs: '112,114' });
    expect(memorizedFilters({ all: true })).toEqual({});
  });

  it('swaps a quiz range for what is memorized, keeping the other filters', () => {
    expect(withMemorizedScope({ categories: 'mutashabeh', surahFrom: '2', surahTo: '3' }, juz30)).toEqual({ categories: 'mutashabeh', juz: '30' });
    expect(withMemorizedScope({ categories: 'mutashabeh', juz: '1' }, { all: true })).toEqual({ categories: 'mutashabeh' });
  });
});
