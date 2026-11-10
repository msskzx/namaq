/// <reference types="expo/types" />
import surahRows from '@shared/data/quran/surahs.json';
import { mushafPages, type MushafPage } from '@shared/quran/readerPage';

/** The 604 pages of the 1441 Madinah mushaf, bundled with the app; each file is read the first time its page is shown. */
const files = require.context('../../../shared/data/quran/mushaf', false, /^\.\/\d+\.json$/);

export const PAGES = 604;
const cache = new Map<number, MushafPage>();

export function pageData(page: number): MushafPage {
  let data = cache.get(page);
  if (!data) cache.set(page, (data = files(`./${page}.json`) as MushafPage));
  return data;
}

export const surahs = surahRows;
export const surahNames: Record<number, string> = Object.fromEntries(surahs.map(row => [row.number, row.name]));
export const ayahCounts: ReadonlyMap<number, number> = new Map(surahs.map(row => [row.number, row.numberOfAyat]));

/** The surah running at the top of a page that opens mid-surah. */
export const surahBefore = (page: number) => surahs.findLast(row => row.page != null && row.page < page)?.number;

let starts: Map<string, number> | undefined;
/** The page an ayah starts on. */
export function pageOfAyah(key: string): number | undefined {
  starts ??= mushafPages(Array.from({ length: PAGES }, (_, i) => pageData(i + 1)));
  return starts.get(key);
}
