import { useEffect, useState } from 'react';
import { bookPagesOf, type BookEntry, type BookPage, type PageBreak, type ReaderBookId } from '@shared/bookReader';
import { kashshafEntries, sadiEntries, ukbariEntries } from '@shared/readerBooks';
import type { KashshafData } from '@shared/quran/kashshaf';
import type { UkbariData } from '@shared/quran/irab';
import breaks from '@shared/data/quran/bookPages.json';
import sadi from '@shared/data/quran/tafsirSadi.json';
import { bookRevision, bookState, readBook, useBooks } from './books';

export type ReaderBook = { entries: BookEntry[]; pages: BookPage[] };

/** Each book as laid out, with the install it was built from (books.ts bookRevision): a book removed or installed again is built afresh, whether or not a reader was open to see it go. */
const made = new Map<ReaderBookId, { revision: number; book: ReaderBook }>();
const madeOf = (id: ReaderBookId) => {
  const found = made.get(id);
  if (found && found.revision === bookRevision(id)) return found.book;
  made.delete(id);
  return undefined;
};
const make = (id: ReaderBookId, entries: BookEntry[], revision: number) => {
  // A download from another build of the book can hold fewer passages than the breaks were found in: those breaks are left out.
  const own = ((breaks as unknown as Record<string, PageBreak[]>)[id] ?? []).filter(([entry, at]) => entry < entries.length && at <= entries[entry].text.length);
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
  const data = await readBook<UkbariData>(id);
  return data && make(id, ukbariEntries(data), revision);
}

/** A book laid out in its printed pages: null while reading, false when it is not on the phone or cannot be read. */
export function useReaderBook(id: ReaderBookId): ReaderBook | null | false {
  useBooks();
  const on = bookState(id) === 'on';
  // Kept with the book it is for, so another book's reader never draws the book before it while its own loads.
  const [state, setState] = useState<{ id: ReaderBookId; book: ReaderBook | null | false }>(() => ({ id, book: on ? madeOf(id) ?? null : false }));
  useEffect(() => {
    let live = true;
    // A book removed (or downloaded again) is read afresh next time.
    if (!on) { madeOf(id); setState({ id, book: false }); return; }
    setState({ id, book: madeOf(id) ?? null });
    load(id).then(found => { if (live) setState({ id, book: found && found.pages.length ? found : false }); }, () => { if (live) setState({ id, book: false }); });
    return () => { live = false; };
  }, [id, on]);
  return state.id === id ? state.book : null;
}
