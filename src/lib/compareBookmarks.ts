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

const spans = (pair: string) => {
  const sides = pair.split('|').map(side => side.match(/^(\d+):(\d+)(?:-(\d+))?$/));
  return sides.length === 2 && sides.every(Boolean) ? sides.map(side => ({ surah: side![1], from: Number(side![2]), to: Number(side![3] ?? side![2]) })) : null;
};

/** The saved bookmarks that are this card: the same ayat on both sides, even if verdicts have since grown, trimmed or split its range. */
export function savedAs(card: string, bookmarks: readonly Pick<Bookmark, 'id'>[]): string[] {
  const own = spans(card);
  return bookmarks.filter(bookmark => {
    if (bookmark.id === compareBookmarkId(card)) return true;
    const saved = isCompareBookmark(bookmark) ? spans(bookmark.id.slice(PREFIX.length)) : null;
    return !!own && !!saved && own.every((side, i) => side.surah === saved[i].surah && side.from <= saved[i].to && saved[i].from <= side.to);
  }).map(bookmark => bookmark.id);
}

/** The surah pairs ("2:16") that hold at least one saved card. */
export function savedSurahPairs(bookmarks: readonly Pick<Bookmark, 'id'>[]): Set<string> {
  return new Set(bookmarks.flatMap(bookmark => {
    const surahs = compareBookmarkAyat(bookmark).map(key => key.split(':')[0]);
    return surahs.length ? [`${surahs[0]}:${surahs[surahs.length - 1]}`] : [];
  }));
}
