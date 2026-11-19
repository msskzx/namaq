// The mushaf lines of a story's ayat, worked out on the server (the app's AyatRange draws the same, mobile/src/components/AyahLines.tsx).
import surahRows from '@shared/data/quran/surahs.json';
import { pageOfAyah, type MushafPage } from '@shared/quran/readerPage';
import { pageModel } from '@shared/quran/recitePage';
import { rangeSlice } from '@shared/quran/ayahSlice';

export type AyatPage = { page: number; top?: number; data: MushafPage; slice: { from: number; to: number } };

const loadPage = async (page: number) => (await import(`../../shared/data/quran/mushaf/${page}.json`)).default as MushafPage;
const surahBefore = (page: number) => surahRows.findLast(row => row.page != null && row.page < page)?.number;
const pageOf = async (key: string) => {
  const [surah, ayah] = key.split(':').map(Number);
  const start = surahRows.find(row => row.number === surah)?.page;
  return start ? pageOfAyah(surah, ayah, start, loadPage) : null;
};

/** Ayat `from`..`to` of one surah, page after page, each page cut to the lines that hold them. */
export async function ayatPages(from: string, to: string): Promise<AyatPage[]> {
  const [first, last] = [await pageOf(from), await pageOf(to)];
  if (!first || !last) return [];
  const pages = await Promise.all(Array.from({ length: last - first + 1 }, (_, i) => first + i).map(async page => {
    const data = await loadPage(page);
    const top = surahBefore(page);
    const slice = rangeSlice(pageModel(data, top).lines, data.items, from, to);
    return slice ? [{ page, top, data, slice }] : [];
  }));
  return pages.flat();
}
