import type { Bookmark } from './bookmarks';

const PREFIX = 'compare:';

/** A saved compare card, keyed by its ayah pair ("2:154|16:21"). */
export const compareBookmarkId = (pair: string) => `${PREFIX}${pair}`;

export const isCompareBookmark = (bookmark: Pick<Bookmark, 'id'>) => bookmark.id.startsWith(PREFIX);

/** The two ayah keys of a saved compare card. */
export function compareBookmarkAyat(bookmark: Pick<Bookmark, 'id'>): string[] {
  if (!isCompareBookmark(bookmark)) return [];
  const keys = bookmark.id.slice(PREFIX.length).split('|');
  return keys.length === 2 && keys.every(key => /^\d+:\d+$/.test(key)) ? keys : [];
}

/** The surah pairs ("2:16") that hold at least one saved card. */
export function savedSurahPairs(bookmarks: readonly Pick<Bookmark, 'id'>[]): Set<string> {
  return new Set(bookmarks.flatMap(bookmark => {
    const [a, b] = compareBookmarkAyat(bookmark).map(key => key.split(':')[0]);
    return a ? [`${a}:${b}`] : [];
  }));
}
