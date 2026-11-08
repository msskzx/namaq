import { describe, expect, it } from 'vitest';
import { bookmarkReferences } from './bookmarkReferences';
import { compareBookmarkAyat, compareBookmarkId, isCompareBookmark, savedAs, savedSurahPairs } from './compareBookmarks';

describe('compare bookmarks', () => {
  it('keys a card by its ayah pair and reads the pair back', () => {
    const bookmark = { id: compareBookmarkId('2:154|16:21') };
    expect(isCompareBookmark(bookmark)).toBe(true);
    expect(compareBookmarkAyat(bookmark)).toEqual(['2:154', '16:21']);
    expect(isCompareBookmark({ id: 'tree-1' })).toBe(false);
    expect(compareBookmarkAyat({ id: 'tree-1' })).toEqual([]);
    expect(compareBookmarkAyat({ id: 'compare:junk' })).toEqual([]);
  });

  it('reads a range card as the first and last ayah of each side', () => {
    expect(compareBookmarkAyat({ id: compareBookmarkId('7:106-125|26:31-50') })).toEqual(['7:106', '7:125', '26:31', '26:50']);
    expect([...savedSurahPairs([{ id: 'compare:7:106-125|26:31-50' }])]).toEqual(['7:26']);
    expect(bookmarkReferences({ id: 'compare:7:106-125|26:31-50', href: '/quran/compare?a=7&b=26#c' }, {})).toEqual([{ surah: 7, ayat: [106, 125], range: true }, { surah: 26, ayat: [31, 50], range: true }]);
  });

  it('recognises a saved card after verdicts or merging change its range', () => {
    const saved = (...ids: string[]) => ids.map(id => ({ id: compareBookmarkId(id) }));
    expect(savedAs('7:106-125|26:31-50', saved('7:106|26:31'))).toEqual(['compare:7:106|26:31']);
    expect(savedAs('7:106-124|26:31-49', saved('7:106-125|26:31-50'))).toEqual(['compare:7:106-125|26:31-50']);
    expect(savedAs('7:106|26:154', saved('7:106-125|26:31-50'))).toEqual([]);
    expect(savedAs('7:106|26:31', [{ id: 'tree-1' }])).toEqual([]);
    expect(savedAs('x', saved('x'))).toEqual(['compare:x']);
  });

  it('lists the surah pairs that hold a saved card', () => {
    expect([...savedSurahPairs([{ id: 'compare:2:154|16:21' }, { id: 'compare:2:1|16:3' }, { id: 'compare:52:25|68:30' }, { id: 'tree-1' }])]).toEqual(['2:16', '52:68']);
  });

  it('gives a saved card its two ayat as homepage references', () => {
    const bookmark = { id: 'compare:2:154|16:21', href: '/quran/compare?a=2&b=16#c-2-154-16-21' };
    expect(bookmarkReferences(bookmark, {})).toEqual([{ surah: 2, ayat: [154] }, { surah: 16, ayat: [21] }]);
  });
});
