import { describe, expect, it } from 'vitest';
import { bookPagesOf, type BookEntry } from '@shared/bookReader';
import { pageAt } from '@/app/quran/books/OpenLastBookPage';
import { contentsOf, pageView } from './bookView';

const entries: BookEntry[] = [
  { surah: 1, from: 1, to: 7, text: 'أول الفاتحة\nثاني ﴿الحمد لله﴾ فقرة' },
  { surah: 2, from: 1, to: 5, text: 'أول البقرة\nثانيها' },
  { surah: 2, from: 6, to: 6, text: 'كلمة' },
  { surah: 2, from: 6, to: 6, text: 'كلمة أخرى' },
];

describe('the website book page', () => {
  const pages = bookPagesOf(entries, [[0, 0, 1, 1], [1, 11, 1, 2]]);

  it('gives each passage starting on the page its pill to the mushaf, and splits its paragraphs', () => {
    const [first] = pageView('sadi', entries, pages[0]).slice(0, 2);
    expect(first.head).toEqual({ label: 'الفاتحة ١–٧', href: '/quran/read/ayah/1/1' });
    expect(first.paragraphs.map(p => p.at)).toEqual([0, 12]);
    expect(first.paragraphs[1].runs).toEqual([{ text: 'ثاني ', quran: false }, { text: '﴿الحمد لله﴾', quran: true }, { text: ' فقرة', quran: false }]);
    const cut = pageView('sadi', entries, pages[1])[0];
    expect(cut.head).toBeUndefined();
  });

  it('shows al-‘Ukbari’s pill once over words of one ayah in a row', () => {
    const heads = pageView('ukbari', entries, pages[1]).map(slice => !!slice.head);
    expect(heads).toEqual([false, true, false]);
  });

  it('lists each surah at the page of its first passage', () => {
    expect(contentsOf(entries, entry => (entry < 1 ? 0 : 1))).toEqual([{ surah: 1, name: 'الفاتحة', page: 1 }, { surah: 2, name: 'البقرة', page: 2 }]);
  });

  it('opens the page whose first paragraph is at or before the last place', () => {
    const starts: [number, number][] = [[0, 0], [1, 11], [3, 0]];
    expect(pageAt(starts, 0, 5)).toBe(1);
    expect(pageAt(starts, 1, 11)).toBe(2);
    expect(pageAt(starts, 2, 0)).toBe(2);
    expect(pageAt(starts, 3, 4)).toBe(3);
  });
});
