import treeData from '@/app/quran/branches/trees.json';
import { groups } from '@/lib/quran/mutashabih/data';
import { ayahOf, ayahPairs, keyOrder, pairChains, pairsBySurah, pairsFor, surahPairs, surahOf, type AyahPair } from '@/lib/quran/mutashabih/pairs';
import type { SimilarAyahPair } from '@/lib/quran/mutashabih/similar';
import { keptPair, verdictFor, type Verdict } from '@/lib/quran/curation/comparePairs';
import type { SpreadAyah } from '@/components/quran/PageSpread';
import { compareAnchor } from '@/lib/compareBookmarks';
import { surahPairHref } from '@/lib/quran/curatedComparisons';
import data from './pairs.json';
import passage from './passagePairs.json';

const words = new Map((treeData.ayat as { key: string; words: string[] }[]).map(ayah => [ayah.key, ayah.words]));
const found = ayahPairs([...data.pairs, ...passage.pairs] as SimilarAyahPair[], groups);
/** Curation runs after the engine: pairs a reader judged to share only vocabulary are left out. */
const bySurah = pairsBySurah(found.filter(keptPair));
const foundBySurah = pairsBySurah(found);

/** Every surah pair the engine links, by the compare criteria, often enough to get its own page. */
export const listedPairs = surahPairs(bySurah);
/** Review still lists every page the engine finds, so a page whose cards were all left out can be looked at again. */
export const reviewPairs = surahPairs(foundBySurah);

const listedIds = new Set(listedPairs.map(pair => `${pair.a}:${pair.b}`));
const listedByAyah = new Map<string, AyahPair[]>();
for (const pair of found.filter(keptPair)) {
  if (!listedIds.has(`${surahOf(pair.a)}:${surahOf(pair.b)}`)) continue;
  for (const key of [pair.a, pair.b]) listedByAyah.set(key, [...(listedByAyah.get(key) ?? []), pair]);
}

/** The compare card for two of these ayat, when a listed page holds them as a kept pair. */
export function compareLinkFor(keys: string[]): string | undefined {
  const shown = new Set(keys);
  const pair = keys.flatMap(key => listedByAyah.get(key) ?? []).find(item => shown.has(item.a) && shown.has(item.b));
  if (!pair) return undefined;
  const [a, b] = [pair.a, pair.b].map(key => ({ surah: surahOf(key), ayah: ayahOf(key) }));
  return `${surahPairHref(a.surah, b.surah)}#${compareAnchor(a, b)}`;
}

export type CardSide = { surah: number; ayah: number; ayat: SpreadAyah[] };
/** One ayah against several far ones: `side` holds the partners. `shared` is the one ayah with the marks of that pairing. */
export type ManyOption = { id: string; ayah: SpreadAyah; shared: SpreadAyah };
/** `pairs` lists the ayah pairs of a range or one-to-many card; a single-pair card has `verdict` instead. */
export type PairCard = { id: string; group?: string; verdict?: Verdict; pairs?: { id: string; verdict?: Verdict }[]; many?: { side: 0 | 1; options: ManyOption[] }; sides: [CardSide, CardSide] };

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
  const group = pairs.find(pair => pair.group)?.group;
  const verdict = review && pairs.length === 1 ? verdictFor(pairs[0].a, pairs[0].b) : undefined;
  return {
    id: pairs.length === 1 ? `${pairs[0].a}|${pairs[0].b}` : `${rangeId(sides[0])}|${rangeId(sides[1])}`,
    ...(group ? { group } : {}),
    ...(verdict ? { verdict } : {}),
    ...(pairs.length > 1 ? { pairs: pairs.map(pair => ({ id: `${pair.a}|${pair.b}`, ...(review && verdictFor(pair.a, pair.b) ? { verdict: verdictFor(pair.a, pair.b) } : {}) })) } : {}),
    sides,
  };
}

/** One shared ayah against several far partners, as one card opening on its first partner. */
function manyCard(pairs: AyahPair[], shared: 'a' | 'b', review: boolean): PairCard {
  const many = shared === 'a' ? 'b' : 'a';
  const first = card([pairs[0]], review);
  const reference = (key: string) => key.split(':')[1];
  const ids = { [shared]: pairs[0][shared], [many]: `${surahOf(pairs[0][many])}:${pairs.map(pair => reference(pair[many])).join(',')}` };
  return {
    ...first,
    verdict: undefined,
    id: `${ids.a}|${ids.b}`,
    group: pairs.find(pair => pair.group)?.group,
    pairs: pairs.map(pair => ({ id: `${pair.a}|${pair.b}`, ...(review && verdictFor(pair.a, pair.b) ? { verdict: verdictFor(pair.a, pair.b) } : {}) })),
    many: { side: many === 'a' ? 0 : 1, options: pairs.map(pair => {
      const marks = wordMarks([pair]);
      return { id: `${pair.a}|${pair.b}`, ayah: side([pair], many, marks).ayat[0], shared: side([pair], shared, marks).ayat[0] };
    }) },
  };
}

/** Single pairs that share an ayah, largest groups first; a pair joins one group only. */
function manyGroups(singles: AyahPair[]) {
  const candidates = (['a', 'b'] as const).flatMap(shared => {
    const byAyah = new Map<string, AyahPair[]>();
    for (const pair of singles) byAyah.set(pair[shared], [...(byAyah.get(pair[shared]) ?? []), pair]);
    return [...byAyah.values()].map(pairs => ({ shared, pairs }));
  });
  const used = new Set<AyahPair>();
  return candidates.sort((p, q) => q.pairs.length - p.pairs.length).flatMap(({ shared, pairs }) => {
    const free = pairs.filter(pair => !used.has(pair));
    if (free.length < 2) return [];
    free.forEach(pair => used.add(pair));
    return [{ shared, pairs: free }];
  });
}

/** The similar ayah pairs of two surahs as cards, lower surah first, in mushaf order. Kept pairs that continue each other become one
 *  range card, and an ayah paired with several far ones becomes one card (docs/plans/curated-passage-comparisons.md).
 *  `review` also shows the pairs curation left out, each with its verdict. */
export function pairCards(x: number, y: number, review = false): PairCard[] {
  const pairs = pairsFor(review ? foundBySurah : bySurah, x, y);
  const chains = pairChains(pairs.filter(keptPair));
  const groups = manyGroups(chains.filter(chain => chain.length === 1).map(chain => chain[0]));
  const grouped = new Set(groups.flatMap(group => group.pairs));
  const order = (pair: AyahPair) => [keyOrder(pair.a), keyOrder(pair.b)];
  return [
    ...chains.filter(chain => !grouped.has(chain[0])).map(chain => ({ at: chain[0], build: () => card(chain, review) })),
    ...pairs.filter(pair => !keptPair(pair)).map(pair => ({ at: pair, build: () => card([pair], review) })),
    ...groups.map(group => ({ at: group.pairs[0], build: () => manyCard(group.pairs, group.shared, review) })),
  ].sort((p, q) => order(p.at)[0] - order(q.at)[0] || order(p.at)[1] - order(q.at)[1]).map(entry => entry.build());
}

export type ReviewState = 'checked' | 'ask';

/** Where the owner's review of each listed surah pair stands: every pair checked, or a question waiting. Pairs not yet fully checked are left out. */
export function reviewStates(): Record<string, ReviewState> {
  const states: Record<string, ReviewState> = {};
  for (const { a, b } of reviewPairs) {
    const verdicts = pairsFor(foundBySurah, a, b).map(pair => verdictFor(pair.a, pair.b));
    if (verdicts.some(verdict => verdict?.ask)) states[`${a}:${b}`] = 'ask';
    else if (verdicts.every(verdict => verdict?.checked)) states[`${a}:${b}`] = 'checked';
  }
  return states;
}
