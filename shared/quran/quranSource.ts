import type { MushafPage } from './readerPage';

// docs/adr/quran-one-text-source.md
const SIGNS = /[ۖ-ۜ۞ۤ۩]/g;
const WRITTEN_JOINED: Record<string, string> = { 'لَّوۡمَا': 'لَّوۡ مَا', 'وَمَالِيَ': 'وَمَا لِيَ', 'مَالِيَ': 'مَا لِيَ' };
const STORED_JOINED = new Set(['بَعْدَ مَا', 'إِلْ يَاسِينَ']);

/** A word of the source without its pause and sajda signs. */
export const plainWord = (word: string) => word.replace(SIGNS, '');

/** Every ayah of the mushaf pages, as the words the King Fahd Complex Hafs text writes. */
export function sourceAyat(pages: MushafPage[]): Map<string, string[]> {
  const ayat = new Map<string, string[]>();
  let surah = 0;
  let ayah = 1;
  for (const page of pages) {
    for (const item of page.items) {
      if ('surah' in item) [surah, ayah] = [item.surah, 1];
      if (!('line' in item)) continue;
      for (const token of item.line) {
        if (typeof token === 'number') ayah = token + 1;
        else if (token && token !== '۞') ayat.set(`${surah}:${ayah}`, [...(ayat.get(`${surah}:${ayah}`) ?? []), token]);
      }
    }
  }
  return ayat;
}

/** The stored words of an ayah beside the source words they stand for, one pair per word; undefined when the counts differ. */
export function wordPairs(stored: string[], source: string[]): [string, string][] | undefined {
  const from = stored.flatMap(word => (STORED_JOINED.has(word) ? word.split(' ') : [word]));
  const to = source.flatMap(word => (WRITTEN_JOINED[word] ?? word).split(/\s+/));
  return from.length === to.length ? from.map((word, at) => [word, plainWord(to[at])]) : undefined;
}
