import { describe, expect, it } from 'vitest';
import { groups } from './data';
import { ayahPairs, closestPair, MIN_PAIRS, pairsBySurah, pairsFor, surahOf, surahPairs } from './pairs';
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

  it('shows the same two ayat in one card only', () => {
    const ayat = (side: typeof pairs[number]['a']) => [side.key, side.through].filter(Boolean) as string[];
    for (const pair of pairs) {
      const covering = pairs.filter(other => other !== pair && ayat(pair.a).every(key => ayat(other.a).includes(key)) && ayat(pair.b).every(key => ayat(other.b).includes(key)));
      expect(covering).toEqual([]);
    }
    expect(pairsFor(bySurah, 2, 7).filter(pair => pair.a.key === '2:58').map(pair => [pair.a.through, pair.b.key, pair.b.through])).toEqual([['2:59', '7:161', '7:162']]);
  });

  it('links two later places of a group through its first place, at the weaker level', () => {
    const later = groups.flatMap(group => group.places.flatMap((x, i) => group.places.flatMap((y, j) =>
      i > 0 && j > i && surahOf(x.key) < surahOf(y.key) ? [{ group, i, j }] : [])));
    expect(later.length).toBeGreaterThan(0);
    const { group, i, j } = later[0];
    const [x, y] = [group.places[i], group.places[j]];
    const pair = pairs.find(pair => pair.group === group.id && pair.a.key === x.key && pair.b.key === y.key)!;
    expect(pair).toBeTruthy();
    const [first, second] = [group.columns[i - 1], group.columns[j - 1]];
    const rank = ['exact', 'letters', 'lemma', 'root'];
    for (const column of pair.columns) {
      const left = first.columns.find(c => c.b?.key === column.a.key && c.b.index === column.a.index)!;
      const right = second.columns.find(c => c.b?.key === column.b.key && c.b.index === column.b.index)!;
      expect(left.a).toEqual(right.a);
      expect(column.level).toBe(rank[Math.max(rank.indexOf(left.level!), rank.indexOf(right.level!))]);
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

  it('finds the surah most similar to a given surah', () => {
    const best = closestPair(listed, 26)!;
    for (const pair of listed) if (pair.a === 26 || pair.b === 26) expect(pair.count).toBeLessThanOrEqual(best.count);
    expect(closestPair(listed, 1)).toBeUndefined();
  });

  it.each(curatedComparisons.map(story => [story.id, story] as const))('lists the %s story pair', (_, story) => {
    expect(listed.find(pair => pair.a === story.a && pair.b === story.b)?.count).toBeGreaterThanOrEqual(MIN_PAIRS);
  });
});
