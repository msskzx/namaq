import type { Bookmark } from './bookmarks';
import { isCompareBookmark } from './compareBookmarks';

export type BookmarkKind = 'tree' | 'compare' | 'ayah' | 'card';

const CARD = 'card:';
export const isCardBookmark = (id: string) => id.startsWith(CARD);
export const cardBookmarkId = (kind: string, item: string) => `${CARD}${kind}:${item}`;
export const SAVES_ITSELF: readonly string[] = ['pair', 'tree'];
export const cardMenuSaveId = (kind: string, item: string | undefined) => (item !== undefined && !SAVES_ITSELF.includes(kind) ? cardBookmarkId(kind, item) : null);
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

export const BOOKMARK_KIND_LABEL: Record<BookmarkKind, { ar: string; en: string }> = {
  tree: { ar: 'شجرة', en: 'Tree' },
  compare: { ar: 'مقارنة', en: 'Compare' },
  ayah: { ar: 'آية', en: 'Ayah' },
  card: { ar: 'بطاقة', en: 'Card' },
};
