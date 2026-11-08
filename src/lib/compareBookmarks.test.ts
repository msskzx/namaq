import { describe, expect, it } from 'vitest';
import { bookmarkReferences } from './bookmarkReferences';
import { compareBookmarkAyat, compareBookmarkId, isCompareBookmark, savedSurahPairs } from './compareBookmarks';

describe('compare bookmarks', () => {
  it('keys a card by its ayah pair and reads the pair back', () => {
    const bookmark = { id: compareBookmarkId('2:154|16:21') };
    expect(isCompareBookmark(bookmark)).toBe(true);
    expect(compareBookmarkAyat(bookmark)).toEqual(['2:154', '16:21']);
    expect(isCompareBookmark({ id: 'tree-1' })).toBe(false);
    expect(compareBookmarkAyat({ id: 'tree-1' })).toEqual([]);
    expect(compareBookmarkAyat({ id: 'compare:junk' })).toEqual([]);
  });

  it('lists the surah pairs that hold a saved card', () => {
    expect([...savedSurahPairs([{ id: 'compare:2:154|16:21' }, { id: 'compare:2:1|16:3' }, { id: 'compare:52:25|68:30' }, { id: 'tree-1' }])]).toEqual(['2:16', '52:68']);
  });

  it('gives a saved card its two ayat as homepage references', () => {
    const bookmark = { id: 'compare:2:154|16:21', href: '/quran/compare?a=2&b=16#c-2-154-16-21' };
    expect(bookmarkReferences(bookmark, {})).toEqual([{ surah: 2, ayat: [154] }, { surah: 16, ayat: [21] }]);
  });
});
