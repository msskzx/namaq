import { num } from './quran/arabicNumber';
import type { UkbariData } from './quran/irab';
import type { KashshafData } from './quran/kashshaf';
import type { BookEntry, PageBreak, ReaderBookId } from './bookReader';

/**
 * The books the book reader turns (docs/plans/book-reader.md): each one's passages as reader entries, and where a
 * printed page of it is on Quranpedia. Al-Sa'di ships with the app; the others are the books the phone downloads.
 */
export const READER_BOOKS: ReaderBookId[] = ['sadi', 'ukbari', 'kashshaf', 'iskafi', 'kirmani', 'zubayr'];
export const isReaderBook = (value: unknown): value is ReaderBookId => READER_BOOKS.includes(value as ReaderBookId);

type SadiRow = [number, number, number, number, number, string];
export const sadiEntries = (rows: unknown[]): BookEntry[] => (rows as SadiRow[]).map(([surah, from, to, , , text]) => ({ surah, from, to, text }));
export const kashshafEntries = (data: KashshafData): BookEntry[] => data.entries.map(([surah, from, to, , , , text]) => ({ surah, from, to, text }));
// Al-'Ukbari's passages are on words of one ayah each.
export const ukbariEntries = (data: UkbariData): BookEntry[] => data.entries.map(([surah, ayah, , , , text]) => ({ surah, from: ayah, to: ayah, text }));

/**
 * A book of mutashabih whole (scripts/quran/buildMutashabihBooks.ts): its surah chapters, each on a whole surah (surah 0 the
 * author's preface), and where its printed pages start.
 */
export type MutashabihBookData = { source: { book: number; sha: string }; entries: [surah: number, text: string][]; breaks: PageBreak[] };
export const mutashabihEntries = (data: MutashabihBookData): BookEntry[] => data.entries.map(([surah, text]) => ({ surah, from: 0, to: 0, text }));

const QURANPEDIA: Partial<Record<ReaderBookId, number>> = { sadi: 3, kashshaf: 346, ukbari: 309 };
/** The books of mutashabih are read from Turath's export of al-Maktaba al-Shamila (scripts/quran/buildMutashabihBooks.ts). */
const SHAMELA: Partial<Record<ReaderBookId, number>> = { kirmani: 3580, iskafi: 1340, zubayr: 1419 };
/** Where the edition a page comes from can be read: Quranpedia's copy of the printed page, or the book on al-Shamila. */
export const quranpediaPage = (book: ReaderBookId, part: number, page: number) =>
  SHAMELA[book] ? `https://shamela.ws/book/${SHAMELA[book]}` : `https://quranpedia.net/book/${QURANPEDIA[book]}/${part}/${page}`;

const CITED: Record<string, ReaderBookId> = { K: 'kirmani', I: 'iskafi', G: 'zubayr' };
/**
 * Where a branch card's citation of a book of mutashabih (shared/quran/mutashabih/evidence.json, K, I or G before its number) is in
 * the reader: the book, and its printed page from the locator («§ الأنعام، ج 2 ص 490», «§ الفاتحة، ص 65») as «part:page».
 */
export function citationInBook(citation: { id: string; locator: string }): { book: ReaderBookId; printed: string } | null {
  const book = CITED[citation.id[0]];
  const page = citation.locator.match(/ص\s*(\d+)/);
  return book && page ? { book, printed: `${citation.locator.match(/ج\s*(\d+)/)?.[1] ?? 1}:${page[1]}` } : null;
}
/** «ص ٤١», or «٣/٢١٤» in a book of several parts. */
export const pageName = (book: ReaderBookId, part: number, page: number) => (book === 'kashshaf' ? `${num(part)}/${num(page)}` : `ص ${num(page)}`);
