import { describe, expect, it } from 'vitest';
import { bookmarkKind, cardBookmarkId, cardOfBookmark, isCardBookmark } from './bookmarkKind';

describe('bookmarkKind', () => {
  it('tells trees, compare cards and mushaf ayat apart by their id', () => {
    expect(bookmarkKind({ id: 'ayah:2:255' })).toBe('ayah');
    expect(bookmarkKind({ id: 'compare:2:154|16:21' })).toBe('compare');
    expect(bookmarkKind({ id: 'family' })).toBe('tree');
    expect(bookmarkKind({ id: 'old-tree' })).toBe('tree');
  });

  it('keeps a feed card by its kind and item, even when the item holds a pipe', () => {
    const id = cardBookmarkId('tie', 'abu-bakr,aisha');
    expect(bookmarkKind({ id })).toBe('card');
    expect(isCardBookmark(id)).toBe(true);
    expect(cardOfBookmark(id)).toEqual({ kind: 'tie', item: 'abu-bakr,aisha' });
    expect(bookmarkKind({ id: cardBookmarkId('pair', '2:154|16:21') })).toBe('card');
    expect(isCardBookmark('compare:2:154|16:21')).toBe(false);
  });
});
