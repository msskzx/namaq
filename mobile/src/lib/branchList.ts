import surahRows from '@shared/data/quran/surahs.json';
import { branchInventory, distinctBranchPieces, type BranchPiece } from '@shared/quran/branchInventory';
import { searchSharedPhrases } from '@shared/quran/branchSearch';
import { textIs } from '@shared/quran/branches';
import { hasGroupFilters, type GroupFilters } from '@shared/quran/mutashabih/browse';
import { matchesSurah } from '@shared/quran/surahSearch';
import type { JuzRange } from '@shared/quran/juz';
import type { Bookmark } from '@shared/bookmarks';

/** What narrows the trees on the branches tab: the filter sheet, the search box and a picked surah. Kept on the phone. */
export type ListState = { filters: GroupFilters; range: JuzRange | null; query: string; surah?: number; saved: boolean };
export const EMPTY_LIST: ListState = { filters: {}, range: null, query: '', saved: false };

const surahOf = (key: string) => Number(key.split(':')[0]);

/** The other ids a tree was saved under on the website, so a saved tree reads as saved whichever id holds it. */
export const aliasesOf = (piece: BranchPiece) => [piece.legacyId, ...(piece.legacyIds ?? []), ...(piece.group?.aliases ?? [])];
export const isSavedIn = (piece: BranchPiece, list: Bookmark[]) => {
  const ids = new Set([piece.id, ...aliasesOf(piece)]);
  return list.some(item => ids.has(item.id));
};

/** Saved trees newest first, as the website lists them with its saved-only switch. */
function savedFirst(pieces: BranchPiece[], bookmarks: Bookmark[]) {
  const at = new Map<string, number>();
  bookmarks.forEach((item, i) => { if (!at.has(item.id)) at.set(item.id, i); });
  const rank = (piece: BranchPiece) => Math.min(...[piece.id, ...aliasesOf(piece)].map(id => at.get(id) ?? Infinity));
  return pieces.filter(piece => rank(piece) < Infinity).sort((a, b) => rank(a) - rank(b));
}

/** The trees swiped through, worked out as the website's branches page does from the same filters, search and surah. */
export function branchList(state: ListState, bookmarks: Bookmark[] = []): BranchPiece[] {
  const inventory = branchInventory(state.filters, state.range);
  const query = state.query.trim();
  let found = query ? distinctBranchPieces(searchSharedPhrases(inventory, query)) : inventory;
  if (state.saved) found = query ? found.filter(piece => isSavedIn(piece, bookmarks)) : savedFirst(found, bookmarks);
  if (state.surah) found = found.filter(piece => piece.keys.some(key => surahOf(key) === state.surah));
  return found;
}

/** Where a search opens: the tree whose phrase is exactly what was typed, else the first found. */
export function openingIndex(pieces: BranchPiece[], query: string) {
  const exact = query.trim() ? pieces.findIndex(piece => textIs(piece.text, query)) : -1;
  return Math.max(0, exact);
}

export const isFiltered = (state: ListState) => !!(state.range || state.saved || hasGroupFilters(state.filters) || state.filters.sort);

export type SurahHit = { number: number; name: string; count: number };
const SURAH_HITS = 3;
export const SUGGESTIONS = 10;

/** What the search box suggests while typing: surahs that have trees, then phrases (as on the website). */
export function suggestions(state: ListState, query: string): { surahs: SurahHit[]; phrases: BranchPiece[] } {
  const typed = query.trim();
  if (!typed) return { surahs: [], phrases: [] };
  const inventory = branchInventory(state.filters, state.range);
  const counts: Record<number, number> = {};
  inventory.forEach(piece => new Set(piece.keys.map(surahOf)).forEach(number => { counts[number] = (counts[number] ?? 0) + 1; }));
  const surahs = surahRows.filter(row => counts[row.number] && matchesSurah(row, typed)).slice(0, SURAH_HITS).map(row => ({ number: row.number, name: row.name, count: counts[row.number] }));
  return { surahs, phrases: searchSharedPhrases(inventory, typed).slice(0, SUGGESTIONS) };
}

/** The filter sheet's draft: a range of juz, surahs or pages, or picked surahs or juz, with the website's group filters. */
export type FilterUnit = 'juz' | 'surah' | 'page' | 'surahs' | 'juzs';
export const UNIT_MAX: Record<FilterUnit, number> = { juz: 30, surah: 114, page: 604, surahs: 114, juzs: 30 };
export type FilterDraft = { unit: FilterUnit; from: string; to: string; picked: number[]; filters: GroupFilters; saved: boolean };

const SCOPE_KEYS = ['surahs', 'juz', 'surahFrom', 'surahTo', 'pageFrom', 'pageTo'] as const;
const listOf = (value: string | undefined) => (value ?? '').split(',').map(Number).filter(n => Number.isInteger(n) && n > 0);

export function draftOf(state: ListState): FilterDraft {
  const { filters, range } = state;
  const rest = { ...filters };
  SCOPE_KEYS.forEach(key => delete rest[key]);
  const base = { filters: rest, saved: state.saved, picked: [] as number[] };
  if (filters.surahFrom || filters.surahTo) return { ...base, unit: 'surah', from: filters.surahFrom ?? '1', to: filters.surahTo ?? '114' };
  if (filters.pageFrom || filters.pageTo) return { ...base, unit: 'page', from: filters.pageFrom ?? '1', to: filters.pageTo ?? '604' };
  if (filters.surahs) return { ...base, unit: 'surahs', from: '1', to: '114', picked: listOf(filters.surahs) };
  if (filters.juz) return { ...base, unit: 'juzs', from: '1', to: '30', picked: listOf(filters.juz) };
  return { ...base, unit: 'juz', from: String(range?.from ?? 1), to: String(range?.to ?? 30) };
}

const western = (text: string) => text.replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x660)).trim();

/** The range typed in the sheet, or null while it is not a valid one (whole numbers within the unit, from ≤ to). */
export function draftRange(draft: FilterDraft): JuzRange | null {
  const max = UNIT_MAX[draft.unit];
  const [from, to] = [draft.from, draft.to].map(value => Number(western(value)));
  const ok = [draft.from, draft.to].every(value => western(value) !== '') && [from, to].every(n => Number.isInteger(n) && n >= 1 && n <= max) && from <= to;
  return ok ? { from, to } : null;
}

/** The list state a submitted sheet gives; the search and picked surah are cleared, as on the website. Null while the range is invalid. */
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
  return { filters, range, query: '', saved: draft.saved };
}
