import treeData from '@/app/quran/branches/trees.json';
import { groups } from '@/lib/quran/mutashabih/data';
import { ayahOf, ayahPairs, keyOrder, pairChains, pairsBySurah, pairsFor, surahPairs, surahOf, type AyahPair } from '@/lib/quran/mutashabih/pairs';
import type { SimilarAyahPair } from '@/lib/quran/mutashabih/similar';
import { keptPair, verdictFor, type Verdict } from '@/lib/quran/curation/comparePairs';
import type { SpreadAyah } from '@/components/quran/PageSpread';
import data from './pairs.json';

const words = new Map((treeData.ayat as { key: string; words: string[] }[]).map(ayah => [ayah.key, ayah.words]));
const found = ayahPairs(data.pairs as SimilarAyahPair[], groups);
/** Curation runs after the engine: pairs a reader judged to share only vocabulary are left out. */
const bySurah = pairsBySurah(found.filter(keptPair));
const foundBySurah = pairsBySurah(found);

/** Every surah pair the engine links, by the compare criteria, often enough to get its own page. */
export const listedPairs = surahPairs(bySurah);

export type CardSide = { surah: number; ayah: number; ayat: SpreadAyah[] };
/** `pairs` lists the ayah pairs of a range card; a single-pair card has `verdict` instead. */
export type PairCard = { id: string; group?: string; verdict?: Verdict; pairs?: { id: string; verdict?: Verdict }[]; sides: [CardSide, CardSide] };

const LEVELS = ['exact', 'letters', 'lemma', 'root'];
const kindOf = (level: string) => (level === 'root' ? 'related' : level === 'lemma' ? 'root' : 'exact') as NonNullable<SpreadAyah['marks']>[number]['kind'];

/** A word matched in two pairs of a range keeps one link, so tapping any of its partners lights them all. Strongest matches come first. */
function wordMarks(pairs: AyahPair[]) {
  const marks = new Map<string, { kind: ReturnType<typeof kindOf>; link: string }>();
  const columns = pairs.flatMap((pair, p) => pair.columns.map((column, c) => ({ ...column, id: `${p}-${c}` })))
    .sort((x, y) => LEVELS.indexOf(x.level ?? '') - LEVELS.indexOf(y.level ?? ''));
  for (const column of columns) {
    const [a, b] = [`${column.a.key}:${column.a.index}`, `${column.b.key}:${column.b.index}`];
    const link = marks.get(a)?.link ?? marks.get(b)?.link ?? column.id;
    // Root-only matches are marked lightly: words sharing a root can differ in meaning («بين» and «بيان»).
    for (const word of [a, b]) if (!marks.has(word)) marks.set(word, { kind: kindOf(column.level ?? ''), link });
  }
  return marks;
}

function side(pairs: AyahPair[], which: 'a' | 'b', marks: ReturnType<typeof wordMarks>): CardSide {
  const surah = surahOf(pairs[0][which]);
  const numbers = pairs.map(pair => ayahOf(pair[which]));
  const [from, to] = [Math.min(...numbers), Math.max(...numbers)];
  const ayat = Array.from({ length: to - from + 1 }, (_, i) => {
    const number = from + i;
    const key = `${surah}:${number}`;
    const list = words.get(key) ?? [];
    return { number, words: list, marks: Object.fromEntries(list.flatMap((_, index) => {
      const mark = marks.get(`${key}:${index}`);
      return mark ? [[index, mark]] : [];
    })) };
  });
  return { surah, ayah: from, ayat };
}

const rangeId = (cardSide: CardSide) => `${cardSide.surah}:${cardSide.ayah}${cardSide.ayat.length > 1 ? `-${cardSide.ayat[cardSide.ayat.length - 1].number}` : ''}`;

function card(pairs: AyahPair[], review: boolean): PairCard {
  const marks = wordMarks(pairs);
  const sides: PairCard['sides'] = [side(pairs, 'a', marks), side(pairs, 'b', marks)];
  const group = pairs.every(pair => pair.group === pairs[0].group) ? pairs[0].group : undefined;
  const verdict = review && pairs.length === 1 ? verdictFor(pairs[0].a, pairs[0].b) : undefined;
  return {
    id: pairs.length === 1 ? `${pairs[0].a}|${pairs[0].b}` : `${rangeId(sides[0])}|${rangeId(sides[1])}`,
    ...(group ? { group } : {}),
    ...(verdict ? { verdict } : {}),
    ...(pairs.length > 1 ? { pairs: pairs.map(pair => ({ id: `${pair.a}|${pair.b}`, ...(review && verdictFor(pair.a, pair.b) ? { verdict: verdictFor(pair.a, pair.b) } : {}) })) } : {}),
    sides,
  };
}

/** The similar ayah pairs of two surahs as cards, lower surah first, in mushaf order. Kept pairs that continue each other become one
 *  range card (docs/plans/curated-passage-comparisons.md). `review` also shows the pairs curation left out, each with its verdict. */
export function pairCards(x: number, y: number, review = false): PairCard[] {
  const pairs = pairsFor(review ? foundBySurah : bySurah, x, y);
  return [...pairChains(pairs.filter(keptPair)), ...pairs.filter(pair => !keptPair(pair)).map(pair => [pair])]
    .sort((p, q) => keyOrder(p[0].a) - keyOrder(q[0].a) || keyOrder(p[0].b) - keyOrder(q[0].b))
    .map(chain => card(chain, review));
}

export type ReviewState = 'checked' | 'ask';

/** Where the owner's review of each listed surah pair stands: every pair checked, or a question waiting. Pairs not yet fully checked are left out. */
export function reviewStates(): Record<string, ReviewState> {
  const states: Record<string, ReviewState> = {};
  for (const { a, b } of listedPairs) {
    const verdicts = pairsFor(foundBySurah, a, b).map(pair => verdictFor(pair.a, pair.b));
    if (verdicts.some(verdict => verdict?.ask)) states[`${a}:${b}`] = 'ask';
    else if (verdicts.every(verdict => verdict?.checked)) states[`${a}:${b}`] = 'checked';
  }
  return states;
}
