import treeData from '@/app/quran/branches/trees.json';
import { compareVerdicts, type Verdict } from '@/lib/quran/curation/comparePairs';
import { withUnappliedReviews } from '@/lib/quran/curation/reviewLog';
import { compareAnchor } from '@/lib/compareBookmarks';
import { juzOf } from '@/lib/quran/juz';
import type { SurahSpans } from '@/lib/quran/compareScope';
import type { SurahPair } from '@/lib/quran/mutashabih/pairs';
import type { SpreadAyah } from '@/components/quran/PageSpread';
import generated from './compareCards';
import { MARK_KINDS } from './markKinds';

export type CardSide = { surah: number; ayah: number; ayat: SpreadAyah[] };
/** One ayah against several far ones: `side` holds the partners. `shared` is the one ayah with the marks of that pairing. */
export type ManyOption = { id: string; ayah: SpreadAyah; shared: SpreadAyah };
/** `pairs` lists the ayah pairs of a range or one-to-many card; a single-pair card has `verdict` instead. */
export type PairCard = { id: string; group?: string; verdict?: Verdict; pairs?: { id: string; verdict?: Verdict }[]; many?: { side: 0 | 1; options: ManyOption[] }; span?: [number, number][]; sides: [CardSide, CardSide] };
export type ReviewState = 'checked' | 'ask' | 'dropped';

type StoredCard = { p: string[]; g?: string; s?: [number, number][]; m?: number[][]; n?: 0 | 1; o?: number[][][] };
/** `npm run quran:compare-cards` writes this from the pairs and verdicts (docs/plans/curated-passage-comparisons.md). */
const stored = generated as unknown as { listed: SurahPair[]; review: SurahPair[]; cards: Record<string, StoredCard[]> };

const words = new Map((treeData.ayat as { key: string; words: string[] }[]).map(ayah => [ayah.key, ayah.words]));

export const listedPairs = stored.listed;
/** Review still lists every page the engine finds, so a page whose cards were all left out can be looked at again. */
export const reviewPairs = stored.review;

/** Where the owner's review of each page stands: a question waiting, every pair checked, or checked and too few kept to be listed. */
export function reviewStates(): Record<string, ReviewState> {
  const states: Record<string, ReviewState> = {};
  const listed = new Set(listedPairs.map(pair => `${pair.a}:${pair.b}`));
  const current = withUnappliedReviews(compareVerdicts);
  for (const { a, b } of reviewPairs) {
    const verdicts = (stored.cards[`${a}:${b}`] ?? []).flatMap(card => card.p).map(id => current[id]);
    if (verdicts.some(verdict => verdict?.ask)) states[`${a}:${b}`] = 'ask';
    else if (verdicts.every(verdict => verdict?.checked)) states[`${a}:${b}`] = listed.has(`${a}:${b}`) && verdicts.some(verdict => verdict?.keep !== false) ? 'checked' : 'dropped';
  }
  return states;
}

/** The first and last juz and mushaf page each surah reaches, for the side pane's filter. */
export const surahSpans: SurahSpans = { juz: {}, page: {} };
const widen = (spans: Record<number, [number, number]>, surah: number, value: number) => {
  const span = spans[surah];
  spans[surah] = span ? [Math.min(span[0], value), Math.max(span[1], value)] : [value, value];
};
for (const ayah of treeData.ayat as { key: string; page: number }[]) {
  const surah = Number(ayah.key.split(':')[0]);
  widen(surahSpans.juz, surah, juzOf(ayah.key));
  widen(surahSpans.page, surah, ayah.page);
}

const parts = (key: string) => key.split(':').map(Number);

function ayatOf(surah: number, numbers: number[], codes: number[]): SpreadAyah[] {
  return numbers.map((number, offset) => ({
    number,
    words: words.get(`${surah}:${number}`) ?? [],
    marks: Object.fromEntries(codes.flatMap(code => {
      const rest = Math.floor(code / 1000);
      const place = Math.floor(rest / 3);
      return Math.floor(place / 200) === offset ? [[place % 200, { kind: MARK_KINDS[rest % 3], link: String(code % 1000) }]] : [];
    })),
  }));
}

type ReviewVerdicts = Record<string, Verdict> | undefined;

const pairVerdict = (review: ReviewVerdicts) => (id: string) => {
  const verdict = review?.[id];
  return { id, ...(verdict ? { verdict } : {}) };
};

function rangeCard(item: StoredCard, review: ReviewVerdicts): PairCard {
  const keys = item.p.map(id => id.split('|'));
  const sides = [0, 1].map(side => {
    const surah = parts(keys[0][side])[0];
    const numbers = keys.map(key => parts(key[side])[1]);
    const [from, to] = item.s?.[side] ?? [Math.min(...numbers), Math.max(...numbers)];
    return { surah, ayah: from, to, ayat: ayatOf(surah, Array.from({ length: to - from + 1 }, (_, i) => from + i), item.m![side]) };
  });
  const rangeId = (side: (typeof sides)[number]) => `${side.surah}:${side.ayah}${side.to > side.ayah ? `-${side.to}` : ''}`;
  const verdict = item.p.length === 1 ? review?.[item.p[0]] : undefined;
  return {
    id: item.p.length === 1 ? item.p[0] : `${rangeId(sides[0])}|${rangeId(sides[1])}`,
    ...(item.g ? { group: item.g } : {}),
    ...(verdict ? { verdict } : {}),
    ...(item.p.length > 1 ? { pairs: item.p.map(pairVerdict(review)) } : {}),
    sides: sides.map(({ surah, ayah, ayat }) => ({ surah, ayah, ayat })) as PairCard['sides'],
  };
}

function manyCard(item: StoredCard, review: ReviewVerdicts): PairCard {
  const side = item.n!;
  const shared = side === 0 ? 1 : 0;
  const keys = item.p.map(id => id.split('|'));
  const surah = parts(keys[0][side])[0];
  const sharedKey = keys[0][shared];
  const [sharedSurah, sharedAyah] = parts(sharedKey);
  const options = keys.map((key, i) => ({
    id: item.p[i],
    ayah: ayatOf(surah, [parts(key[side])[1]], item.o![i][1])[0],
    shared: ayatOf(sharedSurah, [sharedAyah], item.o![i][0])[0],
  }));
  const partners = `${surah}:${options.map(option => option.ayah.number).join(',')}`;
  const sides = [] as unknown as PairCard['sides'];
  sides[side] = { surah, ayah: options[0].ayah.number, ayat: [options[0].ayah] };
  sides[shared] = { surah: sharedSurah, ayah: sharedAyah, ayat: [options[0].shared] };
  return {
    id: side === 1 ? `${sharedKey}|${partners}` : `${partners}|${sharedKey}`,
    ...(item.g ? { group: item.g } : {}),
    pairs: item.p.map(pairVerdict(review)),
    many: { side, options },
    sides,
  };
}

function cardsOf(key: string, review: boolean) {
  const verdicts = review ? withUnappliedReviews(compareVerdicts) : undefined;
  return (stored.cards[key] ?? [])
    .filter(item => review || item.p.length > 1 || compareVerdicts[item.p[0]]?.keep)
    .map(item => (item.o ? manyCard(item, verdicts) : rangeCard(item, verdicts)));
}

/** The cards of two surahs, lower surah first, in mushaf order. `review` also shows the pairs curation left out, each with its verdict. */
export function pairCards(x: number, y: number, review = false): PairCard[] {
  return cardsOf(`${Math.min(x, y)}:${Math.max(x, y)}`, review);
}

const holders = new Map<string, string>();
for (const { a, b } of listedPairs) for (const card of cardsOf(`${a}:${b}`, false)) {
  for (const id of card.pairs?.map(pair => pair.id) ?? [card.id]) if (compareVerdicts[id]?.keep !== false) holders.set(id, `/quran/compare?a=${a}&b=${b}#${compareAnchor(card.sides[0], card.sides[1])}`);
}
const pairsByAyah = new Map<string, string[]>();
for (const id of holders.keys()) for (const key of id.split('|')) pairsByAyah.set(key, [...(pairsByAyah.get(key) ?? []), id]);

/** The compare card that holds two of these ayat as a kept pair, on a listed page. */
export function compareLinkFor(keys: string[]): string | undefined {
  const shown = new Set(keys);
  const id = keys.flatMap(key => pairsByAyah.get(key) ?? []).find(pair => pair.split('|').every(key => shown.has(key)));
  return id && holders.get(id);
}
