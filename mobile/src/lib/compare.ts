import generated from '@shared/data/quran/compareCards';
import corpus from '@shared/data/quran/trees.json';
import surahRows from '@shared/data/quran/surahs.json';
import { decodeCards, surahOrder, type CardAyah, type CardMark, type CardSide, type PairCard, type StoredCards, type SurahPair, type Visit } from '@shared/quran/compareCards';
import { pageInScope, type CompareScope, type SurahSpans } from '@shared/quran/compareScope';
import { curatedComparisons } from '@shared/quran/curatedComparisons';
import { compareBookmarkId, savedAs, savedSurahPairs } from '@shared/compareBookmarks';
import { readBookmarks, toggleBookmark, type Bookmark } from '@shared/bookmarks';
import { juzOf } from '@shared/quran/juz';
import { normalizeWord, plainName } from '@shared/quran/normalize';
import { num } from '@shared/quran/arabicNumber';
import { braid, type Strand } from '@shared/quran/braid';
import { sharedByAll } from '@shared/quran/ayahContext';
import type { BranchAyah } from '@shared/quran/branches';
import { EMPTY_LIST, type ListState } from './branchList';

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

/** The compare filter as the branches filter sheet's state, so both tabs share one sheet. */
export function listOfFilter(filter: PairFilter): ListState {
  const scope = filter.scope;
  const filters: ListState['filters'] = {};
  let range: ListState['range'] = null;
  if (scope && 'list' in scope) filters[scope.unit === 'surahs' ? 'surahs' : 'juz'] = scope.list.join(',');
  else if (scope?.unit === 'juz') range = { from: scope.from, to: scope.to };
  else if (scope) {
    filters[scope.unit === 'surah' ? 'surahFrom' : 'pageFrom'] = String(scope.from);
    filters[scope.unit === 'surah' ? 'surahTo' : 'pageTo'] = String(scope.to);
  }
  return { ...EMPTY_LIST, filters, range, saved: !!filter.savedOnly };
}

const listIn = (value: string | undefined) => (value ?? '').split(',').map(Number).filter(n => Number.isInteger(n) && n > 0);

/** The compare filter from a submitted filter sheet. */
export function filterOfList(state: ListState): PairFilter {
  const { filters, range } = state;
  const number = (value: string | undefined, fallback: number) => (value ? Number(value) : fallback);
  let scope: CompareScope | undefined;
  if (filters.surahs) scope = { unit: 'surahs', list: listIn(filters.surahs) };
  else if (filters.juz) scope = { unit: 'juzs', list: listIn(filters.juz) };
  else if (filters.surahFrom || filters.surahTo) scope = { unit: 'surah', from: number(filters.surahFrom, 1), to: number(filters.surahTo, 114) };
  else if (filters.pageFrom || filters.pageTo) scope = { unit: 'page', from: number(filters.pageFrom, 1), to: number(filters.pageTo, 604) };
  else if (range) scope = { unit: 'juz', from: range.from, to: range.to };
  return { ...(scope ? { scope } : {}), ...(state.saved ? { savedOnly: true } : {}) };
}

let pairsByAyah: Map<string, { id: string; a: number; b: number }[]> | undefined;
/**
 * The listed surah pair holding a kept compare card with two of these ayat (the website's «في المقارنة» link).
 * Read from the stored pair ids, so no card is decoded.
 */
export function compareTargetFor(keys: string[]): { lead: number; other: number } | undefined {
  if (!pairsByAyah) {
    pairsByAyah = new Map();
    for (const { a, b } of listedPairs) for (const item of stored.cards[`${a}:${b}`] ?? []) {
      if (item.x) continue;
      for (const id of item.p) for (const key of id.split('|')) pairsByAyah.set(key, [...(pairsByAyah.get(key) ?? []), { id, a, b }]);
    }
  }
  const shown = new Set(keys);
  const hit = keys.flatMap(key => pairsByAyah!.get(key) ?? []).find(pair => pair.id.split('|').every(key => shown.has(key)));
  if (!hit) return undefined;
  // Seen from the surah of the first shown ayah, as the tree reads.
  const first = Number(keys[0].split(':')[0]);
  return first === hit.b ? { lead: hit.b, other: hit.a } : { lead: hit.a, other: hit.b };
}

/** The ayat each side of a card shows: a one-to-many card shows its picked partner against the shared ayah. */
export function shownAyat(card: PairCard, picked = 0): [CardSide, CardSide] {
  const option = card.many?.options[picked];
  if (!card.many || !option) return card.sides;
  const sides = card.sides.map(side => ({ ...side })) as [CardSide, CardSide];
  const many = card.many.side;
  sides[many] = { ...sides[many], ayah: option.ayah.number, ayat: [option.ayah] };
  sides[many === 0 ? 1 : 0] = { ...sides[many === 0 ? 1 : 0], ayat: [option.shared] };
  return sides;
}

/** One word of a braid: its text, its mark on the card, and the ayah number after it when it ends an ayah. */
export type BraidWord = { text: string; mark?: CardMark; end?: number };
export type BraidStrand = { kind: Strand['kind']; a: BraidWord[]; b: BraidWord[] };

const flat = (ayat: CardAyah[]): BraidWord[] => ayat.flatMap(ayah => ayah.words.map((text, i) => ({
  text, mark: ayah.marks?.[i], ...(i === ayah.words.length - 1 ? { end: ayah.number } : {}),
})));

/** A card's two sides as a braid (shared/quran/braid.ts): one tree for a pair, parting and rejoining. */
export function braidOf(sides: [CardSide, CardSide]): BraidStrand[] {
  const a = flat(sides[0].ayat);
  const b = flat(sides[1].ayat);
  return braid(a.map(word => word.text), b.map(word => word.text))
    .map(strand => ({ kind: strand.kind, a: a.slice(...strand.a), b: b.slice(...strand.b) }));
}

let ayahByKey: Map<string, BranchAyah> | undefined;
const ayahAt = (key: string) => (ayahByKey ??= new Map((corpus.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah]))).get(key);

/** An ayah around a card side, with the words the other side's ayah there shares (exact) or shares a root with. */
export type AroundAyah = { key: string; number: number; words: string[]; exact: Set<number>; rooted: Set<number> };
export type Around = { before: (AroundAyah | null)[]; after: (AroundAyah | null)[] };

/** The matrix's ayah before and after each side, coloured where the two sides' neighbours share words. */
export function aroundOf(sides: [CardSide, CardSide]): Around {
  const at = (side: CardSide, step: -1 | 1) => {
    const numbers = side.ayat.map(ayah => ayah.number);
    const number = step < 0 ? Math.min(...numbers) - 1 : Math.max(...numbers) + 1;
    return ayahAt(`${side.surah}:${number}`) ?? null;
  };
  const pair = (step: -1 | 1) => {
    const ayat = sides.map(side => at(side, step));
    const present = ayat.filter((ayah): ayah is BranchAyah => !!ayah);
    const shared = present.length === 2 && present[0].key !== present[1].key
      ? new Map(sharedByAll(present.map(ayah => ({ ayah, before: null, after: null }))).map(context => [context.ayah.key, context.match]))
      : new Map();
    return ayat.map(ayah => ayah && {
      key: ayah.key, number: Number(ayah.key.split(':')[1]), words: ayah.words,
      exact: new Set<number>(shared.get(ayah.key)?.exact), rooted: new Set<number>(shared.get(ayah.key)?.rooted),
    });
  };
  return { before: pair(-1), after: pair(1) };
}
