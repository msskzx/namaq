import type { GroupFilters } from '@shared/quran/mutashabih/browse';
import type { JuzRange } from '@shared/quran/juz';

// Kept apart from branchList.ts, which reads the trees: settings (and through it the theme) needs only this shape,
// and must stay light because the loading screen reads the theme before any data loads.

/** What narrows the trees on the branches tab: the filter sheet, the search box and a picked surah. Kept on the phone. */
/** `ayah`: only the trees holding this ayah (the reader's ayah menu). */
export type ListState = { filters: GroupFilters; range: JuzRange | null; query: string; surah?: number; ayah?: string; saved: boolean };
export const EMPTY_LIST: ListState = { filters: {}, range: null, query: '', saved: false };
