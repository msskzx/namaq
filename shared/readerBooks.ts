import { num } from './quran/arabicNumber';
import type { UkbariData } from './quran/irab';
import type { KashshafData } from './quran/kashshaf';
import type { BookEntry, ReaderBookId } from './bookReader';

/**
 * The books the book reader turns (docs/plans/book-reader.md): each one's passages as reader entries, and where a
 * printed page of it is on Quranpedia. Al-Sa'di ships with the app; the others are the books the phone downloads.
 */
export const READER_BOOKS: ReaderBookId[] = ['sadi', 'ukbari', 'kashshaf'];
export const isReaderBook = (value: unknown): value is ReaderBookId => READER_BOOKS.includes(value as ReaderBookId);

type SadiRow = [number, number, number, number, number, string];
export const sadiEntries = (rows: unknown[]): BookEntry[] => (rows as SadiRow[]).map(([surah, from, to, , , text]) => ({ surah, from, to, text }));
export const kashshafEntries = (data: KashshafData): BookEntry[] => data.entries.map(([surah, from, to, , , , text]) => ({ surah, from, to, text }));
// Al-'Ukbari's passages are on words of one ayah each.
export const ukbariEntries = (data: UkbariData): BookEntry[] => data.entries.map(([surah, ayah, , , , text]) => ({ surah, from: ayah, to: ayah, text }));

const QURANPEDIA: Record<ReaderBookId, number> = { sadi: 3, kashshaf: 346, ukbari: 309 };
/** Quranpedia's copy of a printed page. */
export const quranpediaPage = (book: ReaderBookId, part: number, page: number) => `https://quranpedia.net/book/${QURANPEDIA[book]}/${part}/${page}`;
/** «ص ٤١», or «٣/٢١٤» in a book of several parts. */
export const pageName = (book: ReaderBookId, part: number, page: number) => (book === 'kashshaf' ? `${num(part)}/${num(page)}` : `ص ${num(page)}`);
