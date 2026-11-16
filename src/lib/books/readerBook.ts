import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { bookPagesOf, type BookEntry, type BookPage, type PageBreak, type ReaderBookId } from '@shared/bookReader';
import { kashshafEntries, sadiEntries, ukbariEntries } from '@shared/readerBooks';
import type { KashshafData } from '@shared/quran/kashshaf';
import type { UkbariData } from '@shared/quran/irab';
import breaks from '@shared/data/quran/bookPages.json';

/** A book the website reader turns (docs/plans/book-reader.md): its passages and printed pages, built once per server. */
export type ReaderBook = { entries: BookEntry[]; pages: BookPage[] };

// The books are several megabytes each, so they are read from disk when first asked for rather than bundled into the page.
const DATA = path.join(process.cwd(), 'shared', 'data', 'quran');
const json = async <T>(file: string): Promise<T> => JSON.parse(await readFile(path.join(DATA, file), 'utf8')) as T;
/** The generated `export default JSON.parse("…")` modules hold their JSON as one string literal. */
const generated = async <T>(file: string): Promise<T> => {
  const source = await readFile(path.join(DATA, file), 'utf8');
  return JSON.parse(JSON.parse(source.slice(source.indexOf('"'), source.lastIndexOf('"') + 1))) as T;
};

const LOADERS: Record<ReaderBookId, () => Promise<BookEntry[]>> = {
  sadi: async () => sadiEntries((await json<{ passages: unknown[] }>('tafsirSadi.json')).passages),
  kashshaf: async () => kashshafEntries(await generated<KashshafData>('kashshaf.js')),
  ukbari: async () => ukbariEntries(await generated<UkbariData>('irabUkbari.js')),
};

const cache = new Map<ReaderBookId, Promise<ReaderBook>>();

export function readerBook(id: ReaderBookId): Promise<ReaderBook> {
  let book = cache.get(id);
  if (!book) {
    book = LOADERS[id]().then(entries => ({ entries, pages: bookPagesOf(entries, (breaks as unknown as Record<string, PageBreak[]>)[id] ?? []) }));
    book.catch(() => cache.delete(id));
    cache.set(id, book);
  }
  return book;
}
