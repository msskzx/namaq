import treeData from '@shared/data/quran/trees.json';
import { compareVerdicts } from '@/lib/quran/curation/comparePairs';
import { withUnappliedReviews } from '@/lib/quran/curation/reviewLog';
import { compareAnchor } from '@shared/compareBookmarks';
import { juzOf } from '@shared/quran/juz';
import type { SurahSpans } from '@shared/quran/compareScope';
import generated from '@shared/data/quran/compareCards';
import { decodeCards, type PairCard, type StoredCards } from '@shared/quran/compareCards';

export type { CardSide, ManyOption, PairCard } from '@shared/quran/compareCards';
export type ReviewState = 'checked' | 'ask' | 'dropped';

/** `npm run quran:compare-cards` writes this from the pairs and verdicts (docs/plans/curated-passage-comparisons.md). */
const stored = generated as unknown as StoredCards;

const words = new Map((treeData.ayat as { key: string; words: string[] }[]).map(ayah => [ayah.key, ayah.words]));

export const listedPairs = stored.listed;
/** Review still lists every page the engine finds, so a page whose cards were all left out can be looked at again. */
export const reviewPairs = stored.review;

/** Where the owner's review of each page stands: a question waiting, every pair checked, or checked with none kept. */
export function reviewStates(): Record<string, ReviewState> {
  const states: Record<string, ReviewState> = {};
  const current = withUnappliedReviews(compareVerdicts);
  for (const { a, b } of reviewPairs) {
    const verdicts = (stored.cards[`${a}:${b}`] ?? []).flatMap(card => card.p).map(id => current[id]);
    if (verdicts.some(verdict => verdict?.ask)) states[`${a}:${b}`] = 'ask';
    else if (verdicts.every(verdict => verdict?.checked)) states[`${a}:${b}`] = verdicts.some(verdict => verdict?.keep !== false) ? 'checked' : 'dropped';
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

function cardsOf(key: string, review: boolean) {
  const [x, y] = key.split(':').map(Number);
  return decodeCards(stored, key => words.get(key), x, y, review ? withUnappliedReviews(compareVerdicts) : undefined);
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
