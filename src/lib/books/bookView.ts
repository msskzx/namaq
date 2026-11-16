import { entryLabel, paragraphsOf, runsIn, type BookEntry, type BookPage, type ReaderBookId } from '@shared/bookReader';
import { ayahHref } from '@shared/ayahMarks';
import surahRows from '@shared/data/quran/surahs.json';

const names: Record<number, string> = Object.fromEntries(surahRows.map(row => [row.number, row.name]));
export const surahName = (surah: number) => names[surah] ?? String(surah);

export type ViewParagraph = { entry: number; at: number; runs: { text: string; quran: boolean }[] };
/** A passage's part on a page: its pill (when the passage starts here) and its paragraphs. */
export type ViewSlice = { key: string; head?: { label: string; href: string }; ayah: string; paragraphs: ViewParagraph[] };

/** What one printed page shows, worked out on the server so the browser gets only that page. */
export function pageView(book: ReaderBookId, entries: BookEntry[], page: BookPage): ViewSlice[] {
  return page.slices.map(slice => {
    const entry = entries[slice.entry];
    const previous = entries[slice.entry - 1];
    // Al-'Ukbari speaks on several words of one ayah in a row: the pill shows over the first only.
    const heads = slice.from === 0 && !(book === 'ukbari' && previous && previous.surah === entry.surah && previous.from === entry.from);
    const ayah = `${entry.surah}:${entry.from}`;
    return {
      key: `${slice.entry}:${slice.from}`,
      head: heads ? { label: entryLabel(entry, surahName(entry.surah)), href: ayahHref(ayah) } : undefined,
      ayah,
      paragraphs: paragraphsOf(entry.text, slice).map(({ at, end }) => ({ entry: slice.entry, at, runs: runsIn(entry.text, at, end) })),
    };
  });
}

/** The book's surahs, each with the page (1-based) its first passage is on. */
export function contentsOf(entries: BookEntry[], pageOf: (entry: number) => number): { surah: number; name: string; page: number }[] {
  const seen = new Map<number, number>();
  entries.forEach((entry, i) => { if (!seen.has(entry.surah)) seen.set(entry.surah, i); });
  return [...seen].map(([surah, entry]) => ({ surah, name: surahName(surah), page: pageOf(entry) + 1 }));
}
