import { expect, it, vi } from 'vitest';
import { getHomepageData } from './homepageData';
import { bookmarkReferences } from './bookmarkReferences';

vi.mock('./quran/surahList', () => ({ surahList: async () => [] }));

it('includes surah references for a saved phrase opened within a juz range', async () => {
  const id = 'اقبل بعضهم علي بعض';
  const data = await getHomepageData();
  expect(bookmarkReferences({ id, href: `/quran/branches?${new URLSearchParams({ o: id, juzFrom: '25', juzTo: '30', m: 'tree' })}` }, data.bookmarkAyat)).toEqual([
    { surah: 52, ayat: [25] },
    { surah: 68, ayat: [30] },
  ]);
});

it('keeps the full references and saved occurrence selection for an absorbed phrase', async () => {
  const id = 'اقبل بعضهم علي بعض';
  const data = await getHomepageData();
  expect(bookmarkReferences({ id, href: '/quran/branches' }, data.bookmarkAyat)).toEqual([
    { surah: 37, ayat: [27, 50] },
    { surah: 52, ayat: [25] },
    { surah: 68, ayat: [30] },
  ]);
  expect(bookmarkReferences({ id, href: '/quran/branches?at=68:30:0' }, data.bookmarkAyat)).toEqual([
    { surah: 68, ayat: [30] },
  ]);
});
