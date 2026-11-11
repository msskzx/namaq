import treeData from '@shared/data/quran/trees.json';
import surahRows from '@shared/data/quran/surahs.json';
import { num } from '@shared/quran/arabicNumber';
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

/** The first compare card (mushaf order of surah pairs) holding two of these ayat as a kept pair, on a listed page. */
export function compareLinkFor(keys: string[]): string | undefined {
  return compareLinksFor(keys)[0]?.href;
}

/** A tree's way into compare: one listed surah pair holding a kept card of two of its ayat. */
export type CompareLink = { href: string; label: string; labelEn: string };

const surahName = (n: number) => surahRows.find(row => row.number === n);

/**
 * Every listed surah pair holding a kept card of two of these ayat, one link each in mushaf order: a tree across
 * two surahs has one, a tree across more gets a short list to choose from (the «في المقارنة» button).
 */
export function compareLinksFor(keys: string[]): CompareLink[] {
  const shown = new Set(keys);
  const ids = [...new Set(keys.flatMap(key => pairsByAyah.get(key) ?? []))].filter(pair => pair.split('|').every(key => shown.has(key)));
  const bySurahs = new Map<string, string>();
  for (const id of ids) {
    const [x, y] = id.split('|').map(key => key.split(':').map(Number));
    const pair = x[0] < y[0] ? [x, y] : [y, x];
    const at = `${pair[0][0]}:${pair[1][0]}`;
    if (!bySurahs.has(at)) bySurahs.set(at, id);
  }
  return [...bySurahs].sort(([p], [q]) => {
    const [pa, pb] = p.split(':').map(Number);
    const [qa, qb] = q.split(':').map(Number);
    return pa - qa || pb - qb;
  }).map(([, id]) => {
    const [x, y] = id.split('|').map(key => key.split(':').map(Number)).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const [a, b] = [surahName(x[0]), surahName(y[0])];
    const itself = x[0] === y[0];
    return {
      href: holders.get(id)!,
      label: `${a?.name} مع ${itself ? 'نفسها' : b?.name} · ${num(x[1])} · ${num(y[1])}`,
      labelEn: `${a?.nameTransliterated} with ${itself ? 'itself' : b?.nameTransliterated} · ${x[1]} · ${y[1]}`,
    };
  });
}
