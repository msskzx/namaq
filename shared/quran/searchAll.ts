import { normalizeWord, plainName } from './normalize';
import { searchSurahs, type SearchableSurah } from './surahSearch';
import { searchable } from './searchText';

/** One search across the app (owner, 2026-11-13): surah names always first, since they are few. docs/plans/search-everything.md */
export type SearchHit =
  | { kind: 'surah'; number: number; name: string }
  | { kind: 'ayah'; key: string; words: string[]; from: number; to: number }
  | { kind: 'word'; id: number; name: string; count: number }
  | { kind: 'tree'; id: string; text: string }
  | { kind: 'compare'; a: number; b: number; title: string }
  | { kind: 'event'; slug: string; event: number; title: string; prophet: string }
  | { kind: 'tuhfa'; chapter: number; verse: number; first: string; second: string }
  | { kind: 'note'; key: string; text: string };

export type SearchKind = SearchHit['kind'];
export const SEARCH_ORDER: SearchKind[] = ['surah', 'ayah', 'word', 'tree', 'compare', 'event', 'tuhfa', 'note'];
export type SearchGroup = { kind: SearchKind; hits: SearchHit[] };

export type CompareItem = { a: number; b: number; title: string };
export type EventItem = { slug: string; event: number; title: string; prophet: string };
export type TuhfaItem = { chapter: number; verse: number; first: string; second: string };

/** What each page can be searched in. The big indexes (ayat, trees, words) come as finders, so each side loads them its own way. */
export type SearchSources = {
  surahs: SearchableSurah[];
  ayat?: (query: string) => Extract<SearchHit, { kind: 'ayah' }>[];
  words?: (query: string) => Extract<SearchHit, { kind: 'word' }>[];
  trees?: (query: string) => Extract<SearchHit, { kind: 'tree' }>[];
  compare?: CompareItem[];
  events?: EventItem[];
  tuhfa?: TuhfaItem[];
  notes?: { key: string; text: string }[];
};

const loose = (text: string) => normalizeWord(plainName(text)).replace(/[«»،؛؟.,:;!?()\-]/g, ' ');
const terms = (query: string) => loose(query).split(/\s+/).filter(Boolean);

/** Whether every typed word is somewhere in the text, ignoring marks, hamza seats and a typed article. */
export function holdsTerms(text: string, query: string) {
  const wanted = terms(query);
  if (!wanted.length) return false;
  const hay = loose(text);
  // «الإدغام» also finds «إدغامٌ»: the article typed out of habit is not needed.
  return wanted.every(term => hay.includes(term) || (term.length > 4 && term.startsWith('ال') && hay.includes(term.slice(2))));
}

/** Every group with results, in SEARCH_ORDER. Each finder runs only for a query it can use (two letters or more). */
export function searchAll(sources: SearchSources, query: string): SearchGroup[] {
  const typed = query.trim();
  if (!typed) return [];
  const text = searchable(typed);
  const groups: Record<SearchKind, SearchHit[]> = {
    surah: searchSurahs(sources.surahs, typed).map(surah => ({ kind: 'surah', number: surah.number, name: surah.name })),
    ayah: text && sources.ayat ? sources.ayat(typed) : [],
    word: text && sources.words ? sources.words(typed) : [],
    tree: text && sources.trees ? sources.trees(typed) : [],
    compare: (sources.compare ?? []).filter(item => holdsTerms(item.title, typed)).map(item => ({ kind: 'compare', ...item })),
    event: (sources.events ?? []).filter(item => holdsTerms(`${item.prophet} ${item.title}`, typed)).map(item => ({ kind: 'event', ...item })),
    tuhfa: (sources.tuhfa ?? []).filter(item => holdsTerms(`${item.first} ${item.second}`, typed)).map(item => ({ kind: 'tuhfa', ...item })),
    note: (sources.notes ?? []).filter(item => holdsTerms(item.text, typed)).map(item => ({ kind: 'note', ...item })),
  };
  return SEARCH_ORDER.filter(kind => groups[kind].length).map(kind => ({ kind, hits: groups[kind] }));
}
