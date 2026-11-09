import type { Group, Level, Position } from '@shared/quran/mutashabih/types';
import type { SimilarAyahPair } from './similar';

export type PairColumn = { a: Position; b: Position; level: Level };
/** Two similar ayat from different surahs, lower surah first. `group` is the branches family both belong to, if any. */
export type AyahPair = { a: string; b: string; group?: string; columns: PairColumn[] };
import type { SurahPair } from '@shared/quran/compareCards';

export { closestPair, type SurahPair } from '@shared/quran/compareCards';

/** A surah pair is listed only when it has at least this many similar ayah pairs. */
export const MIN_PAIRS = 1;

export const surahOf = (key: string) => Number(key.split(':')[0]);
export const ayahOf = (key: string) => Number(key.split(':')[1]);
export const keyOrder = (key: string) => surahOf(key) * 1000 + ayahOf(key);
const pairId = (a: number, b: number) => `${a}:${b}`;

/** The compare page's similar ayah pairs, with a link to the branches family that holds both ayat. */
export function ayahPairs(similar: SimilarAyahPair[], groups: Group[]): AyahPair[] {
  const families = new Map<string, string>();
  for (const group of groups) {
    const keys = group.places.flatMap(place => [place.key, ...(place.through ? [place.through] : [])]);
    for (const x of keys) for (const y of keys) if (x !== y && !families.has(`${x}|${y}`)) families.set(`${x}|${y}`, group.id);
  }
  return similar.map(pair => {
    const flip = keyOrder(pair.a) > keyOrder(pair.b);
    const [a, b] = flip ? [pair.b, pair.a] : [pair.a, pair.b];
    const columns = pair.columns.map(([i, j, level]) => ({ a: { key: a, index: flip ? j : i }, b: { key: b, index: flip ? i : j }, level }));
    return { a, b, group: families.get(`${a}|${b}`), columns };
  }).sort((p, q) => keyOrder(p.a) - keyOrder(q.a) || keyOrder(p.b) - keyOrder(q.b));
}

/** How far apart two neighbouring pairs of a chain may be on either side (3 ayat between them), and how much more one side may advance. */
const MAX_STEP = 4;
const MAX_DRIFT = 2;

/** Runs of pairs that move forward together on both sides (1~1, 2~2 or 1~1, 1~2), in order. A pair that shares an ayah with a run
 *  but sits far from it (7:106~26:154 beside 7:106~26:31) starts its own run; of several runs it could continue, it takes the closest. */
export function pairChains(pairs: AyahPair[]): AyahPair[][] {
  const chains: AyahPair[][] = [];
  for (const pair of pairs) {
    let best: AyahPair[] | undefined;
    let cost = Infinity;
    for (const chain of chains) {
      const last = chain[chain.length - 1];
      const [da, db] = [ayahOf(pair.a) - ayahOf(last.a), ayahOf(pair.b) - ayahOf(last.b)];
      if (da < 0 || db < 0 || da + db === 0 || da > MAX_STEP || db > MAX_STEP || Math.abs(da - db) > MAX_DRIFT) continue;
      if (da + db < cost) { best = chain; cost = da + db; }
    }
    if (best) best.push(pair);
    else chains.push([pair]);
  }
  return joinOverlapping(chains);
}

const spanOf = (chain: AyahPair[], side: 'a' | 'b') => {
  const ayat = chain.map(pair => ayahOf(pair[side]));
  return [Math.min(...ayat), Math.max(...ayat)];
};
const overlap = ([a, b]: number[], [c, d]: number[], gap = 0) => a <= d + gap && c <= b + gap;

/** Two runs whose ayah ranges overlap on one side and overlap or touch on the other are one passage (69:3-4~101:3 with 69:4~101:1-2). */
function joinOverlapping(chains: AyahPair[][]) {
  const joined = [...chains];
  for (let i = 0; i < joined.length; i++) for (let j = i + 1; j < joined.length; j++) {
    const [ax, ay, bx, by] = [spanOf(joined[i], 'a'), spanOf(joined[j], 'a'), spanOf(joined[i], 'b'), spanOf(joined[j], 'b')];
    if (!(overlap(ax, ay) && overlap(bx, by, 1)) && !(overlap(bx, by) && overlap(ax, ay, 1))) continue;
    joined[i] = [...joined[i], ...joined[j]].sort((p, q) => keyOrder(p.a) - keyOrder(q.a) || keyOrder(p.b) - keyOrder(q.b));
    joined.splice(j, 1);
    // The grown run may now reach one already passed.
    i = -1;
    break;
  }
  return joined;
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
