import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { bookPagesOf, type BookEntry, type BookPage, type PageBreak, type ReaderBookId } from '@shared/bookReader';
import { kashshafEntries, mutashabihEntries, sadiEntries, ukbariEntries, type MutashabihBookData } from '@shared/readerBooks';
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

const bookPages = (id: ReaderBookId) => (breaks as unknown as Record<string, PageBreak[]>)[id] ?? [];
const mutashabih = (file: string) => async () => {
  const data = await generated<MutashabihBookData>(file);
  return { entries: mutashabihEntries(data), breaks: data.breaks };
};

const LOADERS: Record<ReaderBookId, () => Promise<{ entries: BookEntry[]; breaks: PageBreak[] }>> = {
  sadi: async () => ({ entries: sadiEntries((await json<{ passages: unknown[] }>('tafsirSadi.json')).passages), breaks: bookPages('sadi') }),
  kashshaf: async () => ({ entries: kashshafEntries(await generated<KashshafData>('kashshaf.js')), breaks: bookPages('kashshaf') }),
  ukbari: async () => ({ entries: ukbariEntries(await generated<UkbariData>('irabUkbari.js')), breaks: bookPages('ukbari') }),
  kirmani: mutashabih('mutashabihKirmani.js'),
  iskafi: mutashabih('mutashabihIskafi.js'),
  zubayr: mutashabih('mutashabihZubayr.js'),
};

const cache = new Map<ReaderBookId, Promise<ReaderBook>>();

export function readerBook(id: ReaderBookId): Promise<ReaderBook> {
  let book = cache.get(id);
  if (!book) {
    book = LOADERS[id]().then(({ entries, breaks }) => ({ entries, pages: bookPagesOf(entries, breaks) }));
    book.catch(() => cache.delete(id));
    cache.set(id, book);
  }
  return book;
}
