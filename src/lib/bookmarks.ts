/** Saved trees, kept in this browser for now. Accounts can later sync this list behind the same functions. */
export type Bookmark = { id: string; text: string; href: string; savedAt: number };

const KEY = 'bookmarks';
const listeners = new Set<() => void>();
let cache: { raw: string | null; list: Bookmark[] } = { raw: null, list: [] };

export function readBookmarks(): Bookmark[] {
  let raw: string | null = null;
  try { raw = localStorage.getItem(KEY); } catch {}
  if (raw === cache.raw) return cache.list;
  let list: Bookmark[] = [];
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) list = parsed.filter(item => item && typeof item.id === 'string' && typeof item.href === 'string');
  } catch {}
  cache = { raw, list };
  return list;
}

function write(list: Bookmark[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
  listeners.forEach(listener => listener());
}

export const isBookmarked = (id: string) => readBookmarks().some(item => item.id === id);

/** Saves the tree, or removes it when it is already saved. Returns whether it is saved now. */
export function toggleBookmark(item: Omit<Bookmark, 'savedAt'>): boolean {
  const list = readBookmarks();
  if (list.some(saved => saved.id === item.id)) {
    write(list.filter(saved => saved.id !== item.id));
    return false;
  }
  write([{ ...item, savedAt: Date.now() }, ...list]);
  return true;
}

export function subscribeBookmarks(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => { listeners.delete(listener); window.removeEventListener('storage', listener); };
}

const NONE: Bookmark[] = [];
export const serverBookmarks = () => NONE;
