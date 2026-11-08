import type { Bookmark } from './bookmarks';

const PREFIX = 'compare:';

/** A saved compare card, keyed by its ayah pair ("2:154|16:21"), its two ranges ("7:106-125|26:31-50") or an ayah and its partners ("10:72|26:109,127"). */
export const compareBookmarkId = (pair: string) => `${PREFIX}${pair}`;

export const isCompareBookmark = (bookmark: Pick<Bookmark, 'id'>) => bookmark.id.startsWith(PREFIX);

const parseSides = (pair: string) => {
  const sides = pair.split('|').map(side => side.match(/^(\d+):(\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*)$/));
  if (sides.length !== 2 || sides.some(side => !side)) return null;
  return sides.map(side => ({ surah: side![1], parts: side![2].split(',').map(part => part.split('-').map(Number)) }));
};

/** The ayah keys that name a saved compare card: each ayah, or the first and last of a range. */
export function compareBookmarkAyat(bookmark: Pick<Bookmark, 'id'>): string[] {
  if (!isCompareBookmark(bookmark)) return [];
  return (parseSides(bookmark.id.slice(PREFIX.length)) ?? []).flatMap(side => side.parts.flat().map(ayah => `${side.surah}:${ayah}`));
}

const overlaps = (x: number[][], y: number[][]) => x.some(a => y.some(b => a[0] <= b[b.length - 1] && b[0] <= a[a.length - 1]));

/** The saved bookmarks that are this card: the same ayat on both sides, even if verdicts have since grown, trimmed or split its range. */
export function savedAs(card: string, bookmarks: readonly Pick<Bookmark, 'id'>[]): string[] {
  const own = parseSides(card);
  return bookmarks.filter(bookmark => {
    if (bookmark.id === compareBookmarkId(card)) return true;
    const saved = isCompareBookmark(bookmark) ? parseSides(bookmark.id.slice(PREFIX.length)) : null;
    return !!own && !!saved && own.every((side, i) => side.surah === saved[i].surah && overlaps(side.parts, saved[i].parts));
  }).map(bookmark => bookmark.id);
}

/** The surah pairs ("2:16") that hold at least one saved card. */
export function savedSurahPairs(bookmarks: readonly Pick<Bookmark, 'id'>[]): Set<string> {
  return new Set(bookmarks.flatMap(bookmark => {
    const surahs = compareBookmarkAyat(bookmark).map(key => key.split(':')[0]);
    return surahs.length ? [`${surahs[0]}:${surahs[surahs.length - 1]}`] : [];
  }));
}
