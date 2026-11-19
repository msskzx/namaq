import type { Bookmark } from './bookmarks';
import { isCompareBookmark } from './compareBookmarks';

/**
 * Which feature a saved item came from: a phrase tree or family, a compare card, an ayah saved in the mushaf, or another home
 * feed card (owner, 2026-11-19: every feed card can be saved), saved as `card:<kind>:<item>`.
 */
export type BookmarkKind = 'tree' | 'compare' | 'ayah' | 'card';

const CARD = 'card:';
export const isCardBookmark = (id: string) => id.startsWith(CARD);
export const cardBookmarkId = (kind: string, item: string) => `${CARD}${kind}:${item}`;
/** The feed cards that save themselves on their own card (the tree's double tap, the compare card's button), so their «…» menu does not. */
export const SAVES_ITSELF: readonly string[] = ['pair', 'tree'];
/** The id a feed card's «…» menu saves it under, or null when the card saves itself or has no item. */
export const cardMenuSaveId = (kind: string, item: string | undefined) => (item !== undefined && !SAVES_ITSELF.includes(kind) ? cardBookmarkId(kind, item) : null);
/** A saved feed card's kind and item, or null for any other saved thing. */
export function cardOfBookmark(id: string): { kind: string; item: string } | null {
  if (!isCardBookmark(id)) return null;
  const rest = id.slice(CARD.length);
  const at = rest.indexOf(':');
  return at > 0 ? { kind: rest.slice(0, at), item: rest.slice(at + 1) } : null;
}

export function bookmarkKind(bookmark: Pick<Bookmark, 'id'>): BookmarkKind {
  if (bookmark.id.startsWith('ayah:')) return 'ayah';
  if (isCardBookmark(bookmark.id)) return 'card';
  if (isCompareBookmark(bookmark)) return 'compare';
  return 'tree';
}

/** The short name shown on a saved card, beside the feature's own icon. */
export const BOOKMARK_KIND_LABEL: Record<BookmarkKind, { ar: string; en: string }> = {
  tree: { ar: 'شجرة', en: 'Tree' },
  compare: { ar: 'مقارنة', en: 'Compare' },
  ayah: { ar: 'آية', en: 'Ayah' },
  card: { ar: 'بطاقة', en: 'Card' },
};
