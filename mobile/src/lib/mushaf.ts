/// <reference types="expo/types" />
import surahRows from '@shared/data/quran/surahs.json';
import { ayahWords, mushafPages, type MushafPage } from '@shared/quran/readerPage';

const files = require.context('../../../shared/data/quran/mushaf', false, /^\.\/\d+\.json$/);

export const PAGES = 604;
const cache = new Map<number, MushafPage>();

export function pageData(page: number): MushafPage {
  let data = cache.get(page);
  if (!data) cache.set(page, (data = files(`./${page}.json`) as MushafPage));
  return data;
}

export const surahs = surahRows;
export const ayahCounts: ReadonlyMap<number, number> = new Map(surahs.map(row => [row.number, row.numberOfAyat]));

export const surahBefore = (page: number) => surahs.findLast(row => row.page != null && row.page < page)?.number;

let starts: Map<string, number> | undefined;
export function pageOfAyah(key: string): number | undefined {
  starts ??= mushafPages(Array.from({ length: PAGES }, (_, i) => pageData(i + 1)));
  return starts.get(key);
}

export function firstAyahOfPage(page: number): string {
  starts ??= mushafPages(Array.from({ length: PAGES }, (_, i) => pageData(i + 1)));
  let before = '1:1';
  for (const [key, at] of starts) {
    if (at === page) return key;
    if (at > page) break;
    before = key;
  }
  return before;
}

export function ayahText(key: string): string {
  const surah = surahs.find(row => row.number === Number(key.split(':')[0]));
  for (let page = surah?.page ?? PAGES + 1; page <= PAGES; page++) {
    const words = ayahWords(key, pageData(page), surahBefore(page));
    if (words.length) return words.join(' ');
  }
  return '';
}

export const ayahMushafWords = (key: string): string[] => ayahMushafTokens(key).filter(word => word !== '۞');

export function ayahMushafTokens(key: string): string[] {
  const start = pageOfAyah(key);
  if (!start) return [];
  const found: string[] = [];
  for (let page = start; page <= PAGES; page++) {
    const words = ayahWords(key, pageData(page), surahBefore(page));
    if (!words.length) break;
    found.push(...words);
  }
  return found;
}
