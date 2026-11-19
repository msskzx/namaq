import surahRows from '@shared/data/quran/surahs.json';
import ukbari from '@shared/data/quran/irabUkbari';
import type { IrabWord, UkbariData, UkbariEntry } from '@shared/quran/irab';
import { irabWordsAt } from '@shared/quran/irabData';
import { ayahWords, type MushafPage } from '@shared/quran/readerPage';

/** What the reader's i'rab sheet shows for one ayah (src/app/quran/read/AyahPreviewSheet.tsx): the app's sheet reads the same data on the phone. */
export type IrabAyah = { words: string[]; word: number; lines: IrabWord[]; ukbari: UkbariEntry[] };

const loadPage = async (page: number): Promise<MushafPage> => (await import(`@shared/data/quran/mushaf/${page}.json`)).default;
const surahBefore = (page: number) => surahRows.findLast(row => row.page != null && row.page < page)?.number;
const books: UkbariData = ukbari;
const byAyah = new Map<string, UkbariEntry[]>();
for (const entry of books.entries) {
  const key = `${entry[0]}:${entry[1]}`;
  byAyah.set(key, [...(byAyah.get(key) ?? []), entry]);
}

/**
 * The ayah's mushaf words (the ۞ mark left out), across a page turn, and which of them was pressed: `n` counts the
 * ayah's words on page `page`, ۞ included and recite mode's title steps not, as the reader's spans number them
 * (MushafPage.tsx data-word).
 */
/** `w`, when given, is the word's place in the ayah itself (a quiz's look-up), in place of a page and its `n`th word. */
export async function ayahMushafWords(key: string, page?: number, n?: number, w?: number): Promise<{ words: string[]; word: number }> {
  const surah = Number(key.split(':')[0]);
  const words: string[] = [];
  let word = 0;
  let found = false;
  for (let at = surahRows.find(row => row.number === surah)?.page ?? 605; at <= 604; at++) {
    const on = ayahWords(key, await loadPage(at), surahBefore(at));
    if (!on.length) { if (found) break; continue; }
    found = true;
    if (at === page && n !== undefined) word = words.length + on.slice(0, n).filter(w => w !== '۞').length;
    words.push(...on.filter(w => w !== '۞'));
  }
  return { words, word: Math.min(w ?? word, Math.max(0, words.length - 1)) };
}

export async function irabAyah(key: string, page?: number, n?: number, w?: number): Promise<IrabAyah> {
  const { words, word } = await ayahMushafWords(key, page, n, w);
  return { words, word, lines: irabWordsAt(key), ukbari: byAyah.get(key) ?? [] };
}
