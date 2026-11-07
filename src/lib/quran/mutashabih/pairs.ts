import type { Group, Level, Position } from './types';
import type { SimilarAyahPair } from './similar';

export type PairColumn = { a: Position; b: Position; level: Level };
/** Two similar ayat from different surahs, lower surah first. `group` is the branches family both belong to, if any. */
export type AyahPair = { a: string; b: string; group?: string; columns: PairColumn[] };
export type SurahPair = { a: number; b: number; count: number };

/** A surah pair is listed only when it has at least this many similar ayah pairs, so no page is one or two cards long. */
export const MIN_PAIRS = 3;

export const surahOf = (key: string) => Number(key.split(':')[0]);
const ayahOf = (key: string) => Number(key.split(':')[1]);
export const keyOrder = (key: string) => surahOf(key) * 1000 + ayahOf(key);
const pairId = (a: number, b: number) => `${a}:${b}`;

/** The compare page's similar ayah pairs, with a link to the branches family that holds both ayat. */
export function ayahPairs(similar: SimilarAyahPair[], groups: Group[]): AyahPair[] {
  const families = new Map<string, string>();
  for (const group of groups) for (const x of group.places) for (const y of group.places) {
    if (x.key !== y.key) families.set(`${x.key}|${y.key}`, families.get(`${x.key}|${y.key}`) ?? group.id);
  }
  return similar.map(pair => {
    const flip = keyOrder(pair.a) > keyOrder(pair.b);
    const [a, b] = flip ? [pair.b, pair.a] : [pair.a, pair.b];
    const columns = pair.columns.map(([i, j, level]) => ({ a: { key: a, index: flip ? j : i }, b: { key: b, index: flip ? i : j }, level }));
    return { a, b, group: families.get(`${a}|${b}`), columns };
  }).sort((p, q) => keyOrder(p.a) - keyOrder(q.a) || keyOrder(p.b) - keyOrder(q.b));
}

/** Ayah pairs grouped by surah pair, keyed "a:b" with a < b. */
export function pairsBySurah(pairs: AyahPair[]) {
  const bySurah = new Map<string, AyahPair[]>();
  for (const pair of pairs) {
    const id = pairId(surahOf(pair.a), surahOf(pair.b));
    bySurah.set(id, [...(bySurah.get(id) ?? []), pair]);
  }
  return bySurah;
}

/** Surah pairs with at least MIN_PAIRS similar ayah pairs, in mushaf order. */
export function surahPairs(bySurah: Map<string, AyahPair[]>, min = MIN_PAIRS): SurahPair[] {
  return [...bySurah].flatMap(([id, pairs]) => {
    const [a, b] = id.split(':').map(Number);
    return pairs.length >= min ? [{ a, b, count: pairs.length }] : [];
  }).sort((p, q) => p.a - q.a || p.b - q.b);
}

export function pairsFor(bySurah: Map<string, AyahPair[]>, x: number, y: number) {
  return bySurah.get(pairId(Math.min(x, y), Math.max(x, y))) ?? [];
}

/** The listed pair that links a surah to the surah most similar to it. */
export function closestPair(listed: SurahPair[], surah: number) {
  return listed.filter(pair => pair.a === surah || pair.b === surah).sort((p, q) => q.count - p.count)[0];
}
