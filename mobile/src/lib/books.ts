import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import { Directory, File, Paths } from 'expo-file-system';
import { bookOf, bookPath, isBookId, type BookId } from '@shared/books';
import { readJson, writeJson } from './storage';
import { WEBSITE } from './branches';

/**
 * The person's books (shared/books.ts): which are on the phone, and downloading or removing one. A built-in book is
 * removed by hiding it, since the app's own files cannot shrink; a downloaded one is a file under the app's documents.
 */
export type BookState = 'on' | 'off' | 'downloading' | 'failed';

const HIDDEN = 'books-hidden';
const SAVED = 'books-saved';
const ids = (key: string) => (readJson(key, Array.isArray) ?? []).filter(isBookId);

let hidden = ids(HIDDEN);
let saved = ids(SAVED);
const busy = new Map<BookId, 'downloading' | 'failed'>();
const loaded = new Map<BookId, unknown>();
/** Grows each time a book is installed or removed, so what was built from its old copy is built again (readerBook.ts). */
const revisions = new Map<BookId, number>();
export const bookRevision = (id: BookId) => revisions.get(id) ?? 0;
const revise = (id: BookId) => revisions.set(id, bookRevision(id) + 1);
const listeners = new Set<() => void>();
let version = 0;
const changed = () => { version++; listeners.forEach(listener => listener()); };
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };

export function bookState(id: BookId): BookState {
  const doing = busy.get(id);
  if (doing) return doing;
  return bookOf(id).builtIn ? (hidden.includes(id) ? 'off' : 'on') : saved.includes(id) ? 'on' : 'off';
}

/** Rerenders when any book comes or goes; read each book with bookState. */
export const useBooks = () => useSyncExternalStore(subscribe, () => version);

const folder = () => new Directory(Paths.document, 'books');
/** A book's data must be a book: its source and a list of passages with their text. */
const readable = (data: unknown) => {
  const book = data as { source?: unknown; entries?: unknown } | null;
  if (!book || typeof book !== 'object' || !book.source || typeof book.source !== 'object' || !Array.isArray(book.entries)
    || !book.entries.every(entry => !!entry && typeof entry === 'object' && typeof (entry as { text?: unknown }).text === 'string')) throw new Error('not a book');
  return data;
};
const fileOf = (id: BookId) => new File(folder(), `${id}.json`);
const web = Platform.OS === 'web';

export async function addBook(id: BookId) {
  if (bookOf(id).builtIn) {
    hidden = hidden.filter(other => other !== id);
    writeJson(HIDDEN, hidden);
    revise(id);
    changed();
    return;
  }
  busy.set(id, 'downloading');
  changed();
  try {
    const url = `${WEBSITE}${bookPath(id)}`;
    if (web) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`book ${id}: ${response.status}`);
      loaded.set(id, readable(await response.json()));
    } else {
      const dir = folder();
      if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
      // Downloaded beside the book and moved over it only once it reads as a book, so a cut-off or wrong download never replaces it.
      const part = new File(dir, `${id}.json.part`);
      try {
        await File.downloadFileAsync(url, part, { idempotent: true });
        loaded.set(id, readable(JSON.parse(await part.text())));
        part.moveSync(fileOf(id), { overwrite: true });
      } finally {
        try { const left = new File(dir, `${id}.json.part`); if (left.exists) left.delete(); } catch {}
      }
    }
    saved = [...saved.filter(other => other !== id), id];
    writeJson(SAVED, saved);
    busy.delete(id);
    revise(id);
  } catch {
    busy.set(id, 'failed');
  }
  changed();
}

export function removeBook(id: BookId) {
  revise(id);
  if (bookOf(id).builtIn) {
    hidden = [...hidden.filter(other => other !== id), id];
    writeJson(HIDDEN, hidden);
  } else {
    saved = saved.filter(other => other !== id);
    writeJson(SAVED, saved);
    loaded.delete(id);
    busy.delete(id);
    if (!web) { try { const file = fileOf(id); if (file.exists) file.delete(); } catch {} }
  }
  changed();
}

/** A downloaded book's data, read from its file once; null when it is not on the phone or cannot be read. */
export async function readBook<T>(id: BookId): Promise<T | null> {
  if (bookState(id) !== 'on' || bookOf(id).builtIn) return null;
  if (loaded.has(id)) return loaded.get(id) as T;
  try {
    const data = readable(web ? await (await fetch(`${WEBSITE}${bookPath(id)}`)).json() : JSON.parse(await fileOf(id).text()));
    loaded.set(id, data);
    return data as T;
  } catch {
    return null;
  }
}
