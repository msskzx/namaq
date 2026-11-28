import { bookPagesOf, type BookEntry, type BookPage, type PageBreak, type ReaderBookId } from '@shared/bookReader';
import { kashshafEntries, mutashabihEntries, sadiEntries, ukbariEntries, type MutashabihBookData } from '@shared/readerBooks';
import type { KashshafData } from '@shared/quran/kashshaf';
import type { UkbariData } from '@shared/quran/irab';
import breaks from '@shared/data/quran/bookPages.json';
import sadiFile from '@shared/data/quran/tafsirSadi.json';
import { bookRevision, bookState, readBook, useBooks } from './books';
import { dataOf } from '@shared/appData';
import { useLoaded } from './hooks/useLoaded';

const sadi = dataOf(sadiFile);

export type ReaderBook = { entries: BookEntry[]; pages: BookPage[] };

const made = new Map<ReaderBookId, { revision: number; book: ReaderBook }>();
const madeOf = (id: ReaderBookId) => {
  const found = made.get(id);
  if (found && found.revision === bookRevision(id)) return found.book;
  made.delete(id);
  return undefined;
};
const make = (id: ReaderBookId, entries: BookEntry[], revision: number, pageBreaks = (breaks as unknown as Record<string, PageBreak[]>)[id] ?? []) => {
  const own = pageBreaks.filter(([entry, at]) => entry < entries.length && at <= entries[entry].text.length);
  const book = { entries, pages: bookPagesOf(entries, own) };
  if (revision === bookRevision(id)) made.set(id, { revision, book });
  return book;
};

async function load(id: ReaderBookId): Promise<ReaderBook | null> {
  const known = madeOf(id);
  if (known) return known;
  const revision = bookRevision(id);
  if (id === 'sadi') return make(id, sadiEntries(sadi.passages), revision);
  if (id === 'kashshaf') { const data = await readBook<KashshafData>(id); return data && make(id, kashshafEntries(data), revision); }
  if (id === 'kirmani' || id === 'iskafi' || id === 'zubayr') { const data = await readBook<MutashabihBookData>(id); return data && make(id, mutashabihEntries(data), revision, data.breaks); }
  const data = await readBook<UkbariData>(id);
  return data && make(id, ukbariEntries(data), revision);
}

export function useReaderBook(id: ReaderBookId): ReaderBook | null | false {
  useBooks();
  const on = bookState(id) === 'on';
  const loaded = useLoaded(on ? id : null, asked => load(asked as ReaderBookId).then(found => (found && found.pages.length ? found : false), () => false as const));
  if (!on) return false;
  return loaded ?? madeOf(id) ?? null;
}
