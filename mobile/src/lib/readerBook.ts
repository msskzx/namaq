import { useEffect, useState } from 'react';
import { bookPagesOf, type BookEntry, type BookPage, type PageBreak, type ReaderBookId } from '@shared/bookReader';
import { kashshafEntries, sadiEntries, ukbariEntries } from '@shared/readerBooks';
import type { KashshafData } from '@shared/quran/kashshaf';
import type { UkbariData } from '@shared/quran/irab';
import breaks from '@shared/data/quran/bookPages.json';
import sadi from '@shared/data/quran/tafsirSadi.json';
import { bookState, readBook, useBooks } from './books';

export type ReaderBook = { entries: BookEntry[]; pages: BookPage[] };

const made = new Map<ReaderBookId, ReaderBook>();
const make = (id: ReaderBookId, entries: BookEntry[]) => {
  // A download from another build of the book can hold fewer passages than the breaks were found in: those breaks are left out.
  const own = ((breaks as unknown as Record<string, PageBreak[]>)[id] ?? []).filter(([entry, at]) => entry < entries.length && at <= entries[entry].text.length);
  const book = { entries, pages: bookPagesOf(entries, own) };
  made.set(id, book);
  return book;
};

async function load(id: ReaderBookId): Promise<ReaderBook | null> {
  const known = made.get(id);
  if (known) return known;
  if (id === 'sadi') return make(id, sadiEntries(sadi.passages));
  if (id === 'kashshaf') { const data = await readBook<KashshafData>(id); return data && make(id, kashshafEntries(data)); }
  const data = await readBook<UkbariData>(id);
  return data && make(id, ukbariEntries(data));
}

/** A book laid out in its printed pages: null while reading, false when it is not on the phone or cannot be read. */
export function useReaderBook(id: ReaderBookId): ReaderBook | null | false {
  useBooks();
  const on = bookState(id) === 'on';
  // Kept with the book it is for, so another book's reader never draws the book before it while its own loads.
  const [state, setState] = useState<{ id: ReaderBookId; book: ReaderBook | null | false }>(() => ({ id, book: on ? made.get(id) ?? null : false }));
  useEffect(() => {
    let live = true;
    // A book removed (or downloaded again) is read afresh next time.
    if (!on) { made.delete(id); setState({ id, book: false }); return; }
    setState({ id, book: made.get(id) ?? null });
    load(id).then(found => { if (live) setState({ id, book: found && found.pages.length ? found : false }); }, () => { if (live) setState({ id, book: false }); });
    return () => { live = false; };
  }, [id, on]);
  return state.id === id ? state.book : null;
}
