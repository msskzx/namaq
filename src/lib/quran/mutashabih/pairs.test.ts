import { describe, expect, it } from 'vitest';
import data from '@/app/quran/compare/pairs.json';
import { groups } from './data';
import { ayahPairs, closestPair, MIN_PAIRS, pairsBySurah, pairsFor, surahOf, surahPairs } from './pairs';
import type { SimilarAyahPair } from './similar';
import { curatedComparisons } from '../curatedComparisons';

const pairs = ayahPairs(data.pairs as SimilarAyahPair[], groups);
const bySurah = pairsBySurah(pairs);
const listed = surahPairs(bySurah);
const byId = new Map(groups.map(group => [group.id, group]));

describe('compare pairs', () => {
  it('puts the lower surah first and keeps each word on its own ayah', () => {
    for (const pair of pairs) {
      expect(surahOf(pair.a)).toBeLessThan(surahOf(pair.b));
      for (const column of pair.columns) {
        expect(column.a.key).toBe(pair.a);
        expect(column.b.key).toBe(pair.b);
      }
    }
  });

  it('puts the lower surah first when the stored pair is the other way round', () => {
    const [pair] = ayahPairs([{ a: '7:1', b: '2:1', columns: [[0, 5, 'exact']] }], []);
    expect(pair).toEqual({ a: '2:1', b: '7:1', group: undefined, columns: [{ a: { key: '2:1', index: 5 }, b: { key: '7:1', index: 0 }, level: 'exact' }] });
  });

  it('links a pair to a branches family only when the family holds both ayat', () => {
    const linked = pairs.filter(pair => pair.group);
    expect(linked.length).toBeGreaterThan(0);
    for (const pair of linked) {
      const keys = byId.get(pair.group!)!.places.flatMap(place => [place.key, place.through]);
      expect(keys).toContain(pair.a);
      expect(keys).toContain(pair.b);
    }
  });

  it('lists surah pairs in mushaf order with their pair counts and no short pages', () => {
    expect(listed).toEqual([...listed].sort((p, q) => p.a - q.a || p.b - q.b));
    for (const surahPair of listed) {
      expect(surahPair.count).toBe(pairsFor(bySurah, surahPair.a, surahPair.b).length);
      expect(surahPair.count).toBeGreaterThanOrEqual(MIN_PAIRS);
    }
    expect(listed.find(pair => pair.a === 52 && pair.b === 68)?.count).toBe(6);
  });

  it('finds the surah most similar to a given surah', () => {
    const best = closestPair(listed, 26)!;
    for (const pair of listed) if (pair.a === 26 || pair.b === 26) expect(pair.count).toBeLessThanOrEqual(best.count);
    expect(closestPair(listed, 1)).toBeUndefined();
  });

  it.each(curatedComparisons.map(story => [story.id, story] as const))('lists the %s story pair', (_, story) => {
    expect(listed.find(pair => pair.a === story.a && pair.b === story.b)?.count).toBeGreaterThanOrEqual(MIN_PAIRS);
  });
});
