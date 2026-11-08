import type { Bookmark } from './bookmarks';

const PREFIX = 'compare:';

/** A saved compare card, keyed by its ayah pair ("2:154|16:21") or, for a range card, its two ranges ("7:106-125|26:31-50"). */
export const compareBookmarkId = (pair: string) => `${PREFIX}${pair}`;

export const isCompareBookmark = (bookmark: Pick<Bookmark, 'id'>) => bookmark.id.startsWith(PREFIX);

/** The ayah keys that name a saved compare card: each ayah, or the first and last of a range. */
export function compareBookmarkAyat(bookmark: Pick<Bookmark, 'id'>): string[] {
  if (!isCompareBookmark(bookmark)) return [];
  const sides = bookmark.id.slice(PREFIX.length).split('|').map(side => side.match(/^(\d+):(\d+)(?:-(\d+))?$/));
  if (sides.length !== 2 || sides.some(side => !side)) return [];
  return sides.flatMap(side => [`${side![1]}:${side![2]}`, ...(side![3] ? [`${side![1]}:${side![3]}`] : [])]);
}

/** The surah pairs ("2:16") that hold at least one saved card. */
export function savedSurahPairs(bookmarks: readonly Pick<Bookmark, 'id'>[]): Set<string> {
  return new Set(bookmarks.flatMap(bookmark => {
    const surahs = compareBookmarkAyat(bookmark).map(key => key.split(':')[0]);
    return surahs.length ? [`${surahs[0]}:${surahs[surahs.length - 1]}`] : [];
  }));
}
