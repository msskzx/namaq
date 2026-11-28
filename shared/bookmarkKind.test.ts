import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { bookmarkKind, cardBookmarkId, cardMenuSaveId, cardOfBookmark, isCardBookmark, SAVES_ITSELF } from './bookmarkKind';
import { FEED_CARD_KINDS } from './interests';

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

  // see docs/plans/guard-proposals.md
  it('every feed card kind can be saved: from its «…» menu, or on its own card for the tree and the compare card', () => {
    for (const kind of FEED_CARD_KINDS) {
      const id = cardMenuSaveId(kind, 'item:with:colons');
      if (SAVES_ITSELF.includes(kind)) expect(id, kind).toBeNull();
      else expect(id && cardOfBookmark(id), kind).toEqual({ kind, item: 'item:with:colons' });
    }
    expect([...SAVES_ITSELF].sort()).toEqual(['pair', 'tree']);
    expect(readFileSync(join(__dirname, '../mobile/src/components/HomeFeed.tsx'), 'utf8')).toMatch(/cardMenuSaveId\(menu\.kind, menu\.item\)/);
    expect(cardMenuSaveId('hadith', undefined)).toBeNull();
  });
});
