import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import { Directory, File, Paths } from 'expo-file-system';
import { bookOf, bookUrl, isBookId, type BookId } from '@shared/books';
import { readJson, writeJson } from './storage';
import { reportError } from '@shared/errors';

export type BookState = 'on' | 'off' | 'downloading' | 'failed';

const HIDDEN = 'books-hidden';
const SAVED = 'books-saved';
const ids = (key: string) => (readJson(key, Array.isArray) ?? []).filter(isBookId);

let hidden = ids(HIDDEN);
let saved = ids(SAVED);
const busy = new Map<BookId, 'downloading' | 'failed'>();
const loaded = new Map<BookId, unknown>();
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

export const useBooks = () => useSyncExternalStore(subscribe, () => version);

const folder = () => new Directory(Paths.document, 'books');
const TEXT_AT: Partial<Record<BookId, number>> = { kashshaf: 6, ukbari: 5, kirmani: 1, iskafi: 1, zubayr: 1 };
const readable = (id: BookId, data: unknown) => {
  if (bookOf(id).kind === 'hadith') {
    const kitabs = (data as { kitabs?: unknown } | null)?.kitabs;
    if (!Array.isArray(kitabs) || !kitabs.length || !kitabs.every(kitab => kitab && Array.isArray(kitab.hadith))) throw new Error('not a hadith book');
    return data;
  }
  const book = data as { source?: unknown; entries?: unknown } | null;
  const at = TEXT_AT[id] ?? -1;
  if (!book || typeof book !== 'object' || !book.source || typeof book.source !== 'object' || !Array.isArray(book.entries)
    || !book.entries.every(entry => Array.isArray(entry) && typeof entry[at] === 'string')) throw new Error('not a book');
  const pageBreaks = (book as { breaks?: unknown }).breaks;
  if (bookOf(id).kind === 'mutashabih' && !(Array.isArray(pageBreaks) && pageBreaks.length
    && pageBreaks.every(row => Array.isArray(row) && row.length === 4 && row.every(Number.isInteger)))) throw new Error('not a book');
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
    const url = bookUrl(id);
    if (web) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`book ${id}: ${response.status}`);
      loaded.set(id, readable(id, await response.json()));
    } else {
      const dir = folder();
      if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
      const part = new File(dir, `${id}.json.part`);
      try {
        await File.downloadFileAsync(url, part, { idempotent: true });
        const data = readable(id, JSON.parse(await part.text()));
        part.moveSync(fileOf(id), { overwrite: true });
        loaded.set(id, data);
      } finally {
        try { const left = new File(dir, `${id}.json.part`); if (left.exists) left.delete(); } catch (error) { reportError('books: delete partial download', error); }
      }
    }
    saved = [...saved.filter(other => other !== id), id];
    writeJson(SAVED, saved);
    busy.delete(id);
    revise(id);
  } catch (error) {
    reportError(`books: download ${id}`, error);
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
    if (!web) { try { const file = fileOf(id); if (file.exists) file.delete(); } catch (error) { reportError('books: delete book file', error); } }
  }
  changed();
}

const reading = new Map<BookId, Promise<unknown>>();
export async function readBook<T>(id: BookId): Promise<T | null> {
  if (bookState(id) !== 'on' || bookOf(id).builtIn) return null;
  if (loaded.has(id)) return loaded.get(id) as T;
  if (!reading.has(id)) reading.set(id, readFromFile(id).finally(() => reading.delete(id)));
  return reading.get(id) as Promise<T | null>;
}

async function readFromFile(id: BookId): Promise<unknown> {
  try {
    const data = readable(id, web ? await (await fetch(bookUrl(id))).json() : JSON.parse(await fileOf(id).text()));
    loaded.set(id, data);
    return data;
  } catch (error) {
    reportError(`books: open ${id}`, error);
    return null;
  }
}
