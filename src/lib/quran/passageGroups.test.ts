import { describe, expect, it } from 'vitest';
import runs from '@/app/quran/data/runs.json';
import { groupPassages } from './passageGroups';
import type { Passage, Pos } from './passages';

const pos = (surah: number, ayah: number, word: number): Pos => ({ surah, ayah, word });

const passage = (a: [Pos, Pos], b: [Pos, Pos], matched = 10): Passage => ({
  a: { from: a[0], to: a[1] },
  b: { from: b[0], to: b[1] },
  matched,
  places: 2,
  marksA: [],
  marksB: [],
});

describe('groupPassages', () => {
  it('joins two passages whose sides share a range into one group', () => {
    const groups = groupPassages([
      passage([pos(1, 1, 0), pos(1, 1, 9)], [pos(2, 1, 0), pos(2, 1, 9)]),
      passage([pos(1, 1, 5), pos(1, 1, 14)], [pos(3, 1, 0), pos(3, 1, 9)]),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].passages).toEqual([0, 1]);
    expect(groups[0].surahs).toEqual([1, 2, 3]);
  });

  it('chains passages through overlapping sides into one group', () => {
    const groups = groupPassages([
      passage([pos(1, 1, 0), pos(1, 1, 9)], [pos(2, 1, 0), pos(2, 1, 9)]),
      passage([pos(1, 1, 8), pos(1, 1, 15)], [pos(3, 1, 0), pos(3, 1, 9)]),
      passage([pos(3, 1, 5), pos(3, 2, 2)], [pos(4, 1, 0), pos(4, 1, 9)]),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].passages).toEqual([0, 1, 2]);
    expect(groups[0].surahs).toEqual([1, 2, 3, 4]);
  });

  it('keeps passages whose ranges only touch, without sharing a word, in separate groups', () => {
    const groups = groupPassages([
      passage([pos(1, 1, 0), pos(1, 1, 4)], [pos(2, 1, 0), pos(2, 1, 4)]),
      passage([pos(1, 1, 5), pos(1, 1, 9)], [pos(3, 1, 0), pos(3, 1, 4)]),
    ]);
    expect(groups).toHaveLength(2);
    expect(groups.map(g => g.passages)).toEqual([[0], [1]]);
  });

  it('keeps the same range numbers in different surahs apart', () => {
    const groups = groupPassages([
      passage([pos(1, 1, 0), pos(1, 1, 9)], [pos(3, 1, 0), pos(3, 1, 9)]),
      passage([pos(2, 1, 0), pos(2, 1, 9)], [pos(4, 1, 0), pos(4, 1, 9)]),
    ]);
    expect(groups).toHaveLength(2);
  });

  it('merges overlapping sides into one place range, and lists places by surah then position', () => {
    const groups = groupPassages([
      passage([pos(1, 1, 0), pos(1, 2, 3)], [pos(2, 1, 0), pos(2, 1, 4)]),
      passage([pos(1, 2, 0), pos(1, 4, 2)], [pos(3, 1, 0), pos(3, 1, 4)]),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].places).toEqual([
      { surah: 1, from: pos(1, 1, 0), to: pos(1, 4, 2) },
      { surah: 2, from: pos(2, 1, 0), to: pos(2, 1, 4) },
      { surah: 3, from: pos(3, 1, 0), to: pos(3, 1, 4) },
    ]);
  });

  it('reports the input indexes ascending, the largest matched, and the distinct surahs ascending', () => {
    const groups = groupPassages([
      passage([pos(1, 1, 0), pos(1, 1, 9)], [pos(3, 1, 0), pos(3, 1, 9)], 10),
      passage([pos(5, 1, 0), pos(5, 1, 9)], [pos(6, 1, 0), pos(6, 1, 9)], 12),
      passage([pos(1, 1, 5), pos(1, 1, 14)], [pos(2, 1, 0), pos(2, 1, 9)], 14),
    ]);
    expect(groups[0]).toEqual({
      passages: [0, 2],
      places: [
        { surah: 1, from: pos(1, 1, 0), to: pos(1, 1, 14) },
        { surah: 2, from: pos(2, 1, 0), to: pos(2, 1, 9) },
        { surah: 3, from: pos(3, 1, 0), to: pos(3, 1, 9) },
      ],
      surahs: [1, 2, 3],
      matched: 14,
    });
  });

  it('orders groups by matched, largest first', () => {
    const groups = groupPassages([
      passage([pos(1, 1, 0), pos(1, 1, 9)], [pos(2, 1, 0), pos(2, 1, 9)], 10),
      passage([pos(3, 1, 0), pos(3, 1, 9)], [pos(4, 1, 0), pos(4, 1, 9)], 20),
    ]);
    expect(groups.map(g => g.matched)).toEqual([20, 10]);
    expect(groups[0].passages).toEqual([1]);
  });

  it('orders groups with equal matched by their first place', () => {
    const groups = groupPassages([
      passage([pos(4, 1, 0), pos(4, 1, 9)], [pos(5, 1, 0), pos(5, 1, 9)], 10),
      passage([pos(2, 1, 0), pos(2, 1, 9)], [pos(3, 1, 0), pos(3, 1, 9)], 10),
    ]);
    expect(groups[0].passages).toEqual([1]);
    expect(groups[1].passages).toEqual([0]);
  });

  it('returns no groups for no passages', () => {
    expect(groupPassages([])).toEqual([]);
  });

  it('makes 89 groups from the committed passages: 80 in two surahs, 7 in three, 1 in four, 1 in five', () => {
    const groups = groupPassages(runs.passages as Passage[]);
    expect(groups).toHaveLength(89);
    const bySurahCount = (n: number) => groups.filter(g => g.surahs.length === n).length;
    expect(bySurahCount(2)).toBe(80);
    expect(bySurahCount(3)).toBe(7);
    expect(bySurahCount(4)).toBe(1);
    expect(bySurahCount(5)).toBe(1);
  });
});
