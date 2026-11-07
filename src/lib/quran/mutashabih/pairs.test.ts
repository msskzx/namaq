import { describe, expect, it } from 'vitest';
import { groups } from './data';
import { ayahPairs, MIN_PAIRS, pairsBySurah, pairsFor, surahOf, surahPairs } from './pairs';
import { curatedComparisons } from '../curatedComparisons';

const pairs = ayahPairs(groups);
const bySurah = pairsBySurah(pairs);
const listed = surahPairs(bySurah);
const byId = new Map(groups.map(group => [group.id, group]));

describe('compare pairs from the متشابه engine', () => {
  it('pairs only ayat of two different surahs, lower surah first, once each', () => {
    const ids = new Set<string>();
    for (const pair of pairs) {
      expect(surahOf(pair.a.key)).toBeLessThan(surahOf(pair.b.key));
      const id = `${pair.a.key}-${pair.a.through}|${pair.b.key}-${pair.b.through}`;
      expect(ids.has(id)).toBe(false);
      ids.add(id);
    }
  });

  it('takes every pair and every matched word from an engine group', () => {
    for (const pair of pairs) {
      const group = byId.get(pair.group)!;
      const keys = (side: typeof pair.a) => [side.key, side.through].filter(Boolean);
      for (const side of [pair.a, pair.b]) expect(group.places.some(place => place.key === side.key && place.through === side.through)).toBe(true);
      expect(pair.columns.length).toBeGreaterThan(0);
      for (const column of pair.columns) {
        expect(keys(pair.a)).toContain(column.a.key);
        expect(keys(pair.b)).toContain(column.b.key);
      }
    }
  });

  it('matches the branches comparison for a two-place group word for word', () => {
    const group = groups.find(group => group.places.length === 2 && group.places[0].key === '52:40')!;
    const [pair] = pairsFor(bySurah, 52, 68).filter(pair => pair.group === group.id);
    expect(pair.columns.map(column => [column.a.index, column.b.index, column.level]))
      .toEqual(group.columns[0].columns.filter(column => column.level).map(column => [column.a!.index, column.b!.index, column.level]));
  });

  it('lists surah pairs in mushaf order with their pair counts and no short pages', () => {
    expect(listed).toEqual([...listed].sort((p, q) => p.a - q.a || p.b - q.b));
    for (const surahPair of listed) {
      expect(surahPair.count).toBe(pairsFor(bySurah, surahPair.a, surahPair.b).length);
      expect(surahPair.count).toBeGreaterThanOrEqual(MIN_PAIRS);
    }
    expect(listed.find(pair => pair.a === 52 && pair.b === 68)).toBeUndefined();
    expect(listed.find(pair => pair.a === 56 && pair.b === 69)?.count).toBe(3);
  });

  it.each(curatedComparisons.map(story => [story.id, story] as const))('lists the %s story pair', (_, story) => {
    expect(listed.find(pair => pair.a === story.a && pair.b === story.b)?.count).toBeGreaterThanOrEqual(MIN_PAIRS);
  });
});
