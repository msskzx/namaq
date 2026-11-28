import { reportError } from './errors';
export type Bookmark = { id: string; text: string; href: string; savedAt: number };

export type BookmarkStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  subscribe?(listener: () => void): () => void;
};

const browserStorage: BookmarkStorage = {
  getItem: key => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  subscribe: listener => {
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  },
};

const KEY = 'bookmarks';
const listeners = new Set<() => void>();
let storage = browserStorage;
let cache: { raw: string | null; list: Bookmark[] } = { raw: null, list: [] };

export function setBookmarkStorage(next: BookmarkStorage) {
  storage = next;
  cache = { raw: null, list: [] };
  listeners.forEach(listener => listener());
}

export function readBookmarks(): Bookmark[] {
  let raw: string | null = null;
  try { raw = storage.getItem(KEY); } catch (error) { reportError('bookmarks: read', error); }
  if (raw === cache.raw) return cache.list;
  let list: Bookmark[] = [];
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) list = parsed.filter(item => item && typeof item.id === 'string' && typeof item.href === 'string');
  } catch (error) { reportError('bookmarks: parse', error); }
  cache = { raw, list };
  return list;
}

function write(list: Bookmark[]) {
  try { storage.setItem(KEY, JSON.stringify(list)); } catch (error) { reportError('bookmarks: save', error); }
  listeners.forEach(listener => listener());
}

export const isBookmarked = (id: string) => readBookmarks().some(item => item.id === id);

export function toggleBookmark(item: Omit<Bookmark, 'savedAt'>, aliases: string[] = []): boolean {
  const list = readBookmarks();
  const ids = new Set([item.id, ...aliases]);
  if (list.some(saved => ids.has(saved.id))) {
    write(list.filter(saved => !ids.has(saved.id)));
    return false;
  }
  write([{ ...item, savedAt: Date.now() }, ...list]);
  return true;
}

export function subscribeBookmarks(listener: () => void) {
  listeners.add(listener);
  const external = storage.subscribe?.(listener);
  return () => { listeners.delete(listener); external?.(); };
}

const NONE: Bookmark[] = [];
export const serverBookmarks = () => NONE;
