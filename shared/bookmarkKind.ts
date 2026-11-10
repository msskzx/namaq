import type { Bookmark } from './bookmarks';
import { isCompareBookmark } from './compareBookmarks';

/** Which feature a saved item came from: a phrase tree or family, a compare card, or an ayah saved in the mushaf. */
export type BookmarkKind = 'tree' | 'compare' | 'ayah';

export function bookmarkKind(bookmark: Pick<Bookmark, 'id'>): BookmarkKind {
  if (bookmark.id.startsWith('ayah:')) return 'ayah';
  if (isCompareBookmark(bookmark)) return 'compare';
  return 'tree';
}

/** The short name shown on a saved card, beside the feature's own icon. */
export const BOOKMARK_KIND_LABEL: Record<BookmarkKind, { ar: string; en: string }> = {
  tree: { ar: 'شجرة', en: 'Tree' },
  compare: { ar: 'مقارنة', en: 'Compare' },
  ayah: { ar: 'آية', en: 'Ayah' },
};
