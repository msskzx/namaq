import type { Group, Kind, Level, Place, Position } from './types';

/** One side of a similar ayah pair: the ayah (or two joined ayat) and the matched word span. */
export type PairSide = { key: string; through?: string; start: number; end: number };
export type PairColumn = { a: Position; b: Position; level: Level };
/** Two similar ayat from different surahs, as the متشابه engine paired them. */
export type AyahPair = { a: PairSide; b: PairSide; group: string; kind: Kind; columns: PairColumn[] };
export type SurahPair = { a: number; b: number; count: number };

/** A surah pair is listed only when it has at least this many similar ayah pairs, so no page is one or two cards long. */
export const MIN_PAIRS = 3;

const RANK: Record<Level, number> = { exact: 0, letters: 1, lemma: 2, root: 3 };
const weaker = (x: Level, y: Level) => (RANK[x] >= RANK[y] ? x : y);
const at = (position: Position) => `${position.key}#${position.index}`;
export const surahOf = (key: string) => Number(key.split(':')[0]);
const ayahOf = (key: string) => Number(key.split(':')[1]);
export const keyOrder = (key: string) => surahOf(key) * 1000 + ayahOf(key);
const sideOf = (place: Place): PairSide => ({ key: place.key, ...(place.through ? { through: place.through } : {}), start: place.start, end: place.end });
const sideId = (side: PairSide) => `${side.key}-${side.through ?? ''}`;
const pairId = (a: number, b: number) => `${a}:${b}`;

/** Word links from the group's first place to every place (the first place links to itself). */
function links(group: Group) {
  const first = new Map<string, { position: Position; level: Level }>();
  const result = [first];
  for (const entry of group.columns) {
    const map = new Map<string, { position: Position; level: Level }>();
    for (const column of entry.columns) if (column.a && column.b && column.level) {
      map.set(at(column.a), { position: column.b, level: column.level });
      first.set(at(column.a), { position: column.a, level: 'exact' });
    }
    result.push(map);
  }
  return result;
}

/** Every cross-surah pair of places in the engine groups, lower surah first, one entry per ayah pair. */
export function ayahPairs(groups: Group[]): AyahPair[] {
  const found = new Map<string, AyahPair>();
  for (const group of groups) {
    const linked = links(group);
    group.places.forEach((x, i) => group.places.forEach((y, j) => {
      if (j <= i || surahOf(x.key) === surahOf(y.key) || !linked[i] || !linked[j]) return;
      const [p, q, lp, lq] = keyOrder(x.key) < keyOrder(y.key) ? [x, y, linked[i], linked[j]] : [y, x, linked[j], linked[i]];
      const columns: PairColumn[] = [];
      for (const [word, left] of lp) {
        const right = lq.get(word);
        if (right) columns.push({ a: left.position, b: right.position, level: weaker(left.level, right.level) });
      }
      if (!columns.length) return;
      const pair: AyahPair = { a: sideOf(p), b: sideOf(q), group: group.id, kind: group.kind, columns };
      const id = `${sideId(pair.a)}|${sideId(pair.b)}`;
      const existing = found.get(id);
      if (!existing || existing.columns.length < columns.length) found.set(id, pair);
    }));
  }
  return [...found.values()].sort((p, q) => keyOrder(p.a.key) - keyOrder(q.a.key) || keyOrder(p.b.key) - keyOrder(q.b.key));
}

/** Ayah pairs grouped by surah pair, keyed "a:b" with a < b. */
export function pairsBySurah(pairs: AyahPair[]) {
  const bySurah = new Map<string, AyahPair[]>();
  for (const pair of pairs) {
    const id = pairId(surahOf(pair.a.key), surahOf(pair.b.key));
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
