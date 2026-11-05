import { describe, expect, it } from 'vitest';
import { bookmarkReferences } from './bookmarkReferences';

const ayat = { example: ['3:164', '2:151', '2:129', '2:129'] };

describe('bookmark references', () => {
  it('groups unique ayat under their surah in Quran order', () => {
    expect(bookmarkReferences({ id: 'example', href: '/quran/branches' }, ayat)).toEqual([
      { surah: 2, ayat: [129, 151] },
      { surah: 3, ayat: [164] },
    ]);
  });

  it('preserves an occurrence selection saved in an older bookmark', () => {
    expect(bookmarkReferences({ id: 'example', href: '/quran/branches?at=2:151:4,3:164:8' }, ayat)).toEqual([
      { surah: 2, ayat: [151] },
      { surah: 3, ayat: [164] },
    ]);
  });

  it('only lists ayat in the bookmarked juz range', () => {
    expect(bookmarkReferences({ id: 'example', href: '/quran/branches?juzFrom=2&juzTo=2' }, {
      example: ['2:1', '2:142', '2:253'],
    })).toEqual([{ surah: 2, ayat: [142] }]);
  });

  it('leaves references empty when the saved item is no longer in the inventory', () => {
    expect(bookmarkReferences({ id: 'missing', href: '/quran/branches' }, ayat)).toEqual([]);
  });

  it('does not break the homepage when a stored address is malformed', () => {
    expect(bookmarkReferences({ id: 'example', href: 'http://[' }, ayat)).toEqual([]);
  });
});
