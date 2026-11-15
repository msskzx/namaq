import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import { Directory, File, Paths } from 'expo-file-system';
import { BOOKS, bookOf, bookPath, isBookId, type BookId, type BookKind } from '@shared/books';
import { readJson, writeJson } from './storage';
import { WEBSITE } from './branches';

/**
 * The person's books (shared/books.ts): which are on the phone, and downloading or removing one. A built-in book is
 * removed by hiding it, since the app's own files cannot shrink; a downloaded one is a file under the app's documents.
 */
export type BookState = 'on' | 'off' | 'downloading' | 'failed';

const HIDDEN = 'books-hidden';
const SAVED = 'books-saved';
const ids = (key: string) => (readJson<unknown[]>(key) ?? []).filter(isBookId);

let hidden = ids(HIDDEN);
let saved = ids(SAVED);
const busy = new Map<BookId, 'downloading' | 'failed'>();
const loaded = new Map<BookId, unknown>();
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

/** The books of a kind the person keeps, in the list's order. */
export const booksOn = (kind: BookKind) => BOOKS.filter(book => book.kind === kind && bookState(book.id) === 'on');

const folder = () => new Directory(Paths.document, 'books');
const readable = (data: unknown) => {
  if (!data || typeof data !== 'object' || !Array.isArray((data as { entries?: unknown }).entries)) throw new Error('not a book');
  return data;
};
const fileOf = (id: BookId) => new File(folder(), `${id}.json`);
const web = Platform.OS === 'web';

export async function addBook(id: BookId) {
  if (bookOf(id).builtIn) {
    hidden = hidden.filter(other => other !== id);
    writeJson(HIDDEN, hidden);
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
      const file = await File.downloadFileAsync(url, fileOf(id), { idempotent: true });
      // A cut-off or wrong download is not kept: the book must read as its data.
      try { loaded.set(id, readable(JSON.parse(await file.text()))); } catch (error) { file.delete(); throw error; }
    }
    saved = [...saved.filter(other => other !== id), id];
    writeJson(SAVED, saved);
    busy.delete(id);
  } catch {
    busy.set(id, 'failed');
  }
  changed();
}

export function removeBook(id: BookId) {
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
    const data = web ? await (await fetch(`${WEBSITE}${bookPath(id)}`)).json() : JSON.parse(await fileOf(id).text());
    loaded.set(id, data);
    return data as T;
  } catch {
    return null;
  }
}
