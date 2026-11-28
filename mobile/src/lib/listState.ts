import type { GroupFilters } from '@shared/quran/mutashabih/browse';
import type { JuzRange } from '@shared/quran/juz';


export type ListState = { filters: GroupFilters; range: JuzRange | null; query: string; surah?: number; ayah?: string; saved: boolean };
export const EMPTY_LIST: ListState = { filters: {}, range: null, query: '', saved: false };
