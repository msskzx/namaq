import generated from '@shared/data/quran/compareCards';
import corpus from '@shared/data/quran/trees.json';
import surahRows from '@shared/data/quran/surahs.json';
import { shownCards, surahOrder, type CardSide, type PairCard, type StoredCards, type SurahPair, type Visit } from '@shared/quran/compareCards';
import { pageInScope, type CompareScope, type SurahSpans } from '@shared/quran/compareScope';
import { curatedComparisons } from '@shared/quran/curatedComparisons';
import { compareBookmarkId, savedAs, savedSurahPairs } from '@shared/compareBookmarks';
import { readBookmarks, toggleBookmark, type Bookmark } from '@shared/bookmarks';
import { juzOf } from '@shared/quran/juz';
import { normalizeWord, plainName } from '@shared/quran/normalize';
import { num } from '@shared/quran/arabicNumber';
export { braidOf, type BraidStrand, type BraidWord } from '@shared/quran/braid';
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
    cards = shownCards(stored, wordsOf, a, b);
    if (cache.size > 30) cache.delete(cache.keys().next().value!);
    cache.set(key, cards);
  }
  return cards;
}

export const surahName = (n: number) => surahRows.find(row => row.number === n)?.name ?? String(n);
/** «سورة البقرة وسورة آل عمران», or «سورة الشعراء مع نفسها» for a surah compared with itself. */
export const pairTitle = (lead: number, other: number) => (lead === other ? `سورة ${surahName(lead)} مع نفسها` : `سورة ${surahName(lead)} وسورة ${surahName(other)}`);
export const visitKey = (visit: Pick<Visit, 'lead' | 'other'>) => `${visit.lead}·${visit.other}`;

/** Ayah numbers in order as unbroken runs: «٣٠–٣٣ · ٣٥» for 30, 31, 32, 33, 35. */
export function runsLabel(numbers: number[]) {
  const runs = numbers.reduce<[number, number][]>((list, n) => {
    const last = list[list.length - 1];
    if (last && n === last[1] + 1) last[1] = n;
    else list.push([n, n]);
    return list;
  }, []);
  return runs.map(([from, to]) => `${num(from)}${to > from ? `–${num(to)}` : ''}`).join(' · ');
}

/** "البقرة ٢٥٥–٢٦٠" for a card side, each stretch named when a story part skips ayat; a side silent here is its surah alone. */
export const sideLabel = (side: CardSide) => `${surahName(side.surah)} ${runsLabel(side.ayat.map(ayah => ayah.number))}`.trim();

/** What a side says in a story part its surah does not tell. */
export const silentNote = (surah: number) => `لا تذكر سورة ${surahName(surah)} هذا الجزء`;

/** A story card as one pair of sides per row, each row lined up across the two surahs; any other card as itself. */
export function rowSides(sides: [CardSide, CardSide]): [CardSide, CardSide][] {
  const rows = sides[0].rows;
  if (!rows) return [sides];
  return rows.map((_, row) => sides.map(side => {
    const ayat = side.ayat.filter(ayah => side.rows![row].includes(ayah.number));
    return { surah: side.surah, ayah: ayat[0]?.number ?? side.ayah, ayat };
  }) as [CardSide, CardSide]);
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
  return compareTargetsFor(keys)[0];
}

/** One way from a tree into compare: a listed surah pair holding a kept card of two of its ayat, and those ayah numbers. */
export type CompareTarget = { lead: number; other: number; ayat: [number, number] };

/**
 * Every listed surah pair holding a kept card of two of these ayat, one each, in mushaf order (the website's
 * compareLinksFor): a tree across two surahs opens its pair, one across more lists them to choose from.
 * Seen from the surah of the first shown ayah when it is one of the two, as the tree reads.
 */
function hitsOf(key: string) {
  if (!pairsByAyah) {
    pairsByAyah = new Map();
    for (const { a, b } of listedPairs) {
      const engine = (stored.cards[`${a}:${b}`] ?? []).filter(item => !item.x);
      const story = stored.stories?.[`${a}:${b}`];
      const ids = new Set(engine.flatMap(item => item.p));
      // On a story page only the engine pairs whose two ayat a shown card holds link in, as on the website.
      const shown = story?.flatMap(item => item.p.filter(id => ids.has(id) && (!item.a || id.split('|').every((key, s) => item.a![s].includes(Number(key.split(':')[1]))))));
      for (const id of shown ?? engine.flatMap(item => item.p)) for (const key of id.split('|')) pairsByAyah.set(key, [...(pairsByAyah.get(key) ?? []), { id, a, b }]);
    }
  }
  return pairsByAyah.get(key) ?? [];
}

export function compareTargetsFor(keys: string[]): CompareTarget[] {
  const shown = new Set(keys);
  const first = Number(keys[0]?.split(':')[0]);
  const bySurahs = new Map<string, CompareTarget>();
  for (const hit of keys.flatMap(hitsOf)) {
    if (!hit.id.split('|').every(key => shown.has(key)) || bySurahs.has(`${hit.a}:${hit.b}`)) continue;
    const [x, y] = hit.id.split('|').map(key => key.split(':').map(Number)).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const flip = first === hit.b && hit.a !== hit.b;
    bySurahs.set(`${hit.a}:${hit.b}`, { lead: flip ? hit.b : hit.a, other: flip ? hit.a : hit.b, ayat: flip ? [y[1], x[1]] : [x[1], y[1]] });
  }
  return [...bySurahs.entries()].sort(([p], [q]) => {
    const [pa, pb] = p.split(':').map(Number);
    const [qa, qb] = q.split(':').map(Number);
    return pa - qa || pb - qb;
  }).map(([, target]) => target);
}

/**
 * Every listed surah pair holding a kept card of this one ayah (the reader's ayah menu), in mushaf order:
 * seen from the ayah's own surah, with the ayah and its partner as `ayat`.
 */
export function compareTargetsOfAyah(key: string): CompareTarget[] {
  const [own, number] = key.split(':').map(Number);
  const bySurahs = new Map<string, CompareTarget>();
  for (const hit of hitsOf(key)) {
    if (bySurahs.has(`${hit.a}:${hit.b}`)) continue;
    const partner = hit.id.split('|').find(other => other !== key) ?? key;
    const [surah, ayah] = partner.split(':').map(Number);
    bySurahs.set(`${hit.a}:${hit.b}`, { lead: own, other: surah, ayat: [number, ayah] });
  }
  return [...bySurahs.values()].sort((p, q) => Math.min(p.lead, p.other) - Math.min(q.lead, q.other) || Math.max(p.lead, p.other) - Math.max(q.lead, q.other));
}

/** Whether a card shows this ayah on either side, or as one of its one-to-many partners. */
export const holdsAyah = (card: PairCard, key: string) =>
  card.sides.some(side => side.ayat.some(ayah => `${side.surah}:${ayah.number}` === key)) ||
  !!card.many?.options.some(option => `${card.sides[card.many!.side].surah}:${option.ayah.number}` === key);

const size = (card: PairCard) => card.sides.reduce((sum, side) => sum + side.ayat.length, card.many?.options.length ?? 0);
const sideOf = (card: PairCard, key: string) => {
  const at = card.sides.findIndex(side => side.ayat.some(ayah => `${side.surah}:${ayah.number}` === key));
  return at < 0 && card.many?.options.some(option => `${card.sides[card.many!.side].surah}:${option.ayah.number}` === key) ? card.many.side : at;
};

/**
 * The card a page opens on for these ayat: the smallest one showing them across its two sides (so a saved card opens
 * on itself, not on a one-to-many card or a story part that also holds them), else the one holding them all, else the first
 * holding the first; -1 for none.
 */
export function focusIndex(cards: PairCard[], ayat: string[]) {
  let across = -1;
  cards.forEach((card, at) => {
    const sides = new Set(ayat.map(key => sideOf(card, key)));
    if (!sides.has(-1) && sides.size === 2 && (across < 0 || size(card) < size(cards[across]))) across = at;
  });
  if (across >= 0) return across;
  const all = cards.findIndex(card => ayat.every(key => holdsAyah(card, key)));
  return all >= 0 ? all : cards.findIndex(card => holdsAyah(card, ayat[0]));
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
