import surahRows from '@shared/data/quran/surahs.json';
import { branchInventory, distinctBranchPieces, outsideMatches, type BranchPiece } from '@shared/quran/branchInventory';
import { ALL_KINDS, PAGE_DEFAULT_KIND, PAGE_KINDS, searchSharedPhrases } from '@shared/quran/branchSearch';
import { textIs } from '@shared/quran/branches';
import { hasGroupFilters, type GroupFilters } from '@shared/quran/mutashabih/browse';
import { matchesSurah } from '@shared/quran/surahSearch';
import type { JuzRange } from '@shared/quran/juz';
import type { Bookmark } from '@shared/bookmarks';

import { EMPTY_LIST, type ListState } from './listState';
export { EMPTY_LIST, type ListState };

const surahOf = (key: string) => Number(key.split(':')[0]);

export const aliasesOf = (piece: BranchPiece) => [piece.legacyId, ...(piece.legacyIds ?? []), ...(piece.group?.aliases ?? [])];
export const isSavedIn = (piece: BranchPiece, list: Bookmark[]) => {
  const ids = new Set([piece.id, ...aliasesOf(piece)]);
  return list.some(item => ids.has(item.id));
};

function savedFirst(pieces: BranchPiece[], bookmarks: Bookmark[]) {
  const at = new Map<string, number>();
  bookmarks.forEach((item, i) => { if (!at.has(item.id)) at.set(item.id, i); });
  const rank = (piece: BranchPiece) => Math.min(...[piece.id, ...aliasesOf(piece)].map(id => at.get(id) ?? Infinity));
  return pieces.filter(piece => rank(piece) < Infinity).sort((a, b) => rank(a) - rank(b));
}

export function branchList(state: ListState, bookmarks: Bookmark[] = []): BranchPiece[] {
  const inventory = branchInventory({ ...state.filters, categories: kindsShown(state) }, state.range);
  const query = state.query.trim();
  let found = query ? distinctBranchPieces(searchSharedPhrases(inventory, query)) : inventory;
  if (state.saved) found = query ? found.filter(piece => isSavedIn(piece, bookmarks)) : savedFirst(found, bookmarks);
  if (state.surah) found = found.filter(piece => piece.keys.some(key => surahOf(key) === state.surah));
  if (state.ayah) found = found.filter(piece => piece.keys.includes(state.ayah!));
  return found;
}

let treeAyat: Set<string> | undefined;
export const hasTrees = (key: string) => (treeAyat ??= new Set(branchList(BOTH_KINDS_LIST).flatMap(piece => piece.keys))).has(key);

export function openingIndex(pieces: BranchPiece[], query: string) {
  const exact = query.trim() ? pieces.findIndex(piece => textIs(piece.text, query)) : -1;
  return Math.max(0, exact);
}

export const kindsShown = (state: ListState) => state.filters.categories ?? (state.saved ? 'mutashabeh,pondering' : PAGE_DEFAULT_KIND);
export const tabOf = (state: ListState) => PAGE_KINDS.find(kind => kind.id === kindsShown(state))?.id;
export const isFiltered = (state: ListState) => !!(state.range || state.saved || hasGroupFilters(tabOf(state) ? { ...state.filters, categories: undefined } : state.filters) || state.filters.sort);

export type SurahHit = { number: number; count: number };
const SURAH_HITS = 3;
export const SUGGESTIONS = 10;

export function suggestions(state: ListState, query: string, bookmarks: Bookmark[] = []): { surahs: SurahHit[]; phrases: BranchPiece[]; outside: BranchPiece[] } {
  const typed = query.trim();
  if (!typed) return { surahs: [], phrases: [], outside: [] };
  const inventory = branchList({ ...state, query: '' }, bookmarks);
  const counts: Record<number, number> = {};
  inventory.forEach(piece => new Set(piece.keys.map(surahOf)).forEach(number => { counts[number] = (counts[number] ?? 0) + 1; }));
  const surahs = surahRows.filter(row => counts[row.number] && matchesSurah(row, typed)).slice(0, SURAH_HITS).map(row => ({ number: row.number, count: counts[row.number] }));
  const matched = distinctBranchPieces(searchSharedPhrases(inventory, typed));
  return { surahs, phrases: matched.slice(0, SUGGESTIONS), outside: outsideMatches(typed, matched) };
}

export type FilterUnit = 'juz' | 'surah' | 'page' | 'surahs' | 'juzs';
export const UNIT_MAX: Record<FilterUnit, number> = { juz: 30, surah: 114, page: 604, surahs: 114, juzs: 30 };
export type FilterDraft = { unit: FilterUnit; from: string; to: string; picked: number[]; filters: GroupFilters; saved: boolean; query?: string };

const SCOPE_KEYS = ['surahs', 'juz', 'surahFrom', 'surahTo', 'pageFrom', 'pageTo'] as const;
const listOf = (value: string | undefined) => (value ?? '').split(',').map(Number).filter(n => Number.isInteger(n) && n > 0);

export function draftOf(state: ListState): FilterDraft {
  const { filters, range } = state;
  const rest = { ...filters };
  SCOPE_KEYS.forEach(key => delete rest[key]);
  const base = { filters: rest, saved: state.saved, picked: [] as number[], query: state.query };
  if (state.surah && !filters.surahFrom && !filters.surahTo && !filters.pageFrom && !filters.surahs && !filters.juz) return { ...base, unit: 'surah', from: String(state.surah), to: String(state.surah) };
  if (filters.surahFrom || filters.surahTo) return { ...base, unit: 'surah', from: filters.surahFrom ?? '1', to: filters.surahTo ?? '114' };
  if (filters.pageFrom || filters.pageTo) return { ...base, unit: 'page', from: filters.pageFrom ?? '1', to: filters.pageTo ?? '604' };
  if (filters.surahs) return { ...base, unit: 'surahs', from: '1', to: '114', picked: listOf(filters.surahs) };
  if (filters.juz) return { ...base, unit: 'juzs', from: '1', to: '30', picked: listOf(filters.juz) };
  return { ...base, unit: 'juz', from: String(range?.from ?? 1), to: String(range?.to ?? 30) };
}

const western = (text: string) => text.replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x660)).trim();

export function draftRange(draft: FilterDraft): JuzRange | null {
  const max = UNIT_MAX[draft.unit];
  const [from, to] = [draft.from, draft.to].map(value => Number(western(value)));
  const ok = [draft.from, draft.to].every(value => western(value) !== '') && [from, to].every(n => Number.isInteger(n) && n >= 1 && n <= max) && from <= to;
  return ok ? { from, to } : null;
}

export function applyDraft(draft: FilterDraft): ListState | null {
  const filters: GroupFilters = { ...draft.filters };
  SCOPE_KEYS.forEach(key => delete filters[key]);
  let range: JuzRange | null = null;
  if (draft.unit === 'surahs' || draft.unit === 'juzs') {
    if (draft.picked.length) filters[draft.unit === 'surahs' ? 'surahs' : 'juz'] = [...draft.picked].sort((a, b) => a - b).join(',');
  } else {
    const picked = draftRange(draft);
    if (!picked) return null;
    if (draft.unit === 'juz') range = picked.from === 1 && picked.to === 30 ? null : picked;
    else if (picked.from !== 1 || picked.to !== UNIT_MAX[draft.unit]) {
      filters[draft.unit === 'surah' ? 'surahFrom' : 'pageFrom'] = String(picked.from);
      filters[draft.unit === 'surah' ? 'surahTo' : 'pageTo'] = String(picked.to);
    }
  }
  return { filters, range, query: draft.query ?? '', saved: draft.saved };
}

export const findPiece = (pieces: BranchPiece[], id: string) =>
  pieces.find(piece => piece.id === id || piece.group?.id === id || aliasesOf(piece).includes(id));

export const ALL_KINDS_LIST: ListState = { ...EMPTY_LIST, filters: { categories: ALL_KINDS } };
export const PONDERING_LIST: ListState = { ...EMPTY_LIST, filters: { categories: 'pondering' } };
export const BOTH_KINDS_LIST: ListState = { ...EMPTY_LIST, filters: { categories: 'mutashabeh,pondering' } };

export function listShowing(state: ListState, id: string, bookmarks: Bookmark[] = []): { list: ListState; piece: BranchPiece } | null {
  for (const list of [state, EMPTY_LIST, PONDERING_LIST, ALL_KINDS_LIST]) {
    const piece = findPiece(branchList(list, bookmarks), id);
    if (piece) return { list, piece };
  }
  return null;
}
