import generated from '@shared/data/quran/compareCards';
import corpus from '@shared/data/quran/trees.json';
import surahRows from '@shared/data/quran/surahs.json';
import { decodeCards, surahOrder, type CardSide, type PairCard, type StoredCards, type SurahPair, type Visit } from '@shared/quran/compareCards';
import { pageInScope, type CompareScope, type SurahSpans } from '@shared/quran/compareScope';
import { curatedComparisons } from '@shared/quran/curatedComparisons';
import { compareBookmarkId, savedAs, savedSurahPairs } from '@shared/compareBookmarks';
import { readBookmarks, toggleBookmark, type Bookmark } from '@shared/bookmarks';
import { juzOf } from '@shared/quran/juz';
import { normalizeWord, plainName } from '@shared/quran/normalize';
import { num } from '@shared/quran/arabicNumber';

/** The website's compare cards, as built by `npm run quran:compare-cards`: only the cards a reader kept. */
const stored = generated as unknown as StoredCards;
export const listedPairs: SurahPair[] = stored.listed;

let words: Map<string, string[]> | undefined;
const wordsOf = (key: string) => (words ??= new Map((corpus.ayat as { key: string; words: string[] }[]).map(ayah => [ayah.key, ayah.words]))).get(key);

const cache = new Map<string, PairCard[]>();
/** The cards of two surahs in mushaf order. */
export function cardsFor(a: number, b: number): PairCard[] {
  const key = `${Math.min(a, b)}:${Math.max(a, b)}`;
  let cards = cache.get(key);
  if (!cards) {
    cards = decodeCards(stored, wordsOf, a, b);
    if (cache.size > 30) cache.delete(cache.keys().next().value!);
    cache.set(key, cards);
  }
  return cards;
}

export const surahName = (n: number) => surahRows.find(row => row.number === n)?.name ?? String(n);
export const pairTitle = (lead: number, other: number) => `سورة ${surahName(lead)} وسورة ${surahName(other)}`;
export const visitKey = (visit: Pick<Visit, 'lead' | 'other'>) => `${visit.lead}·${visit.other}`;

/** "البقرة ٢٥٥–٢٦٠" for a card side. */
export function sideLabel(side: CardSide) {
  const last = side.ayat[side.ayat.length - 1]?.number ?? side.ayah;
  return `${surahName(side.surah)} ${num(side.ayah)}${last > side.ayah ? `–${num(last)}` : ''}`;
}

let spans: SurahSpans | undefined;
/** The first and last juz and mushaf page each surah reaches, for the juz filter. */
export function surahSpans(): SurahSpans {
  if (spans) return spans;
  const next: SurahSpans = { juz: {}, page: {} };
  const widen = (list: Record<number, [number, number]>, surah: number, value: number) => {
    const span = list[surah];
    list[surah] = span ? [Math.min(span[0], value), Math.max(span[1], value)] : [value, value];
  };
  for (const ayah of corpus.ayat as { key: string; page: number }[]) {
    const surah = Number(ayah.key.split(':')[0]);
    widen(next.juz, surah, juzOf(ayah.key));
    widen(next.page, surah, ayah.page);
  }
  return (spans = next);
}

export type PairFilter = { scope?: CompareScope; savedOnly?: boolean };

/** The surah pairs left by the filter: both surahs inside the juz range, and with a saved card when asked. */
export function filteredPairs(filter: PairFilter, bookmarks: readonly Pick<Bookmark, 'id'>[] = readBookmarks()): SurahPair[] {
  const saved = filter.savedOnly ? savedSurahPairs(bookmarks) : undefined;
  return listedPairs.filter(pair => (!filter.scope || pageInScope(pair, surahSpans(), filter.scope)) && (!saved || saved.has(`${pair.a}:${pair.b}`)));
}

/** The pages swiping walks: under each surah in mushaf order, every pair it is in (a pair comes once under each of its surahs). */
export const visitsOf = (pairs: SurahPair[]) => surahOrder(pairs);

/** Where to land after the list changed: the same page, else the same pair seen from its other surah, else the first. */
export function landingIndex(visits: Visit[], at: Pick<Visit, 'lead' | 'other'> | undefined) {
  if (!at) return 0;
  const same = visits.findIndex(visit => visit.lead === at.lead && visit.other === at.other);
  if (same >= 0) return same;
  const mirror = visits.findIndex(visit => visit.lead === at.other && visit.other === at.lead);
  return Math.max(0, mirror);
}

const terms = (query: string) => query.trim().split(/\s+/).filter(Boolean).map(term => normalizeWord(term.replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x660))));
const surahMatches = (n: number, term: string) => (/^\d+$/.test(term) ? String(n) === term : normalizeWord(plainName(surahName(n))).includes(term));

/** A pair matches a search when every word names one of its surahs (by name or number) or its story. */
export function pairMatches(pair: { a: number; b: number }, query: string) {
  const story = curatedComparisons.find(item => item.a === pair.a && item.b === pair.b);
  return terms(query).every(term => surahMatches(pair.a, term) || surahMatches(pair.b, term) || (!!story && normalizeWord(story.name.ar).includes(term)));
}

/** The stories pinned at the top of the list, when the filter keeps them. */
export const storiesIn = (pairs: SurahPair[], query: string) => {
  const listed = new Set(pairs.map(pair => `${pair.a}:${pair.b}`));
  return curatedComparisons.filter(story => listed.has(`${story.a}:${story.b}`) && pairMatches(story, query));
};

export const savedIdsOf = (card: PairCard, list: readonly Pick<Bookmark, 'id'>[] = readBookmarks()) => savedAs(card.id, list);

export function toggleCardSaved(card: PairCard, list: readonly Pick<Bookmark, 'id'>[] = readBookmarks()) {
  const [a, b] = card.sides;
  const text = `${a.ayat[0]?.words.slice(0, 6).join(' ') ?? ''} …`;
  return toggleBookmark({ id: compareBookmarkId(card.id), text, href: `/quran/compare?a=${Math.min(a.surah, b.surah)}&b=${Math.max(a.surah, b.surah)}` }, savedAs(card.id, list));
}

/** The ayah keys a card side shows, for the ayah screen. */
export const sideKeys = (side: CardSide) => side.ayat.map(ayah => `${side.surah}:${ayah.number}`);
