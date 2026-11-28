import { describe, expect, it } from 'vitest';
import { bookPagesOf, entryOfAyah, pageOfSpot, paragraphsOf, runsIn, searchBook, type BookEntry, type PageBreak } from './bookReader';
import { sadiEntries } from './readerBooks';
import sadi from './data/quran/tafsirSadi.json';
import breaks from './data/quran/bookPages.json';

const entries: BookEntry[] = [
  { surah: 1, from: 1, to: 7, text: 'أول الكلام.\nثاني ﴿الْحَمْدُ لِلَّهِ رَبِّ﴾ ثم' },
  { surah: 2, from: 1, to: 5, text: 'تقدم الكلام.\nوقوله ﴿ذَلِكَ الْكِتَابُ﴾ أي هذا الكتاب' },
];
const quote = entries[0].text.indexOf('رَبِّ');
const marks: PageBreak[] = [[0, 0, 1, 1], [0, quote, 1, 2], [1, 0, 1, 3]];

describe('book pages', () => {
  const pages = bookPagesOf(entries, marks);
  it('runs each page from its start to the next page', () => {
    expect(pages.map(p => p.page)).toEqual([1, 2, 3]);
    expect(pages[0].slices).toEqual([{ entry: 0, from: 0, to: quote }]);
    expect(pages[1].slices).toEqual([{ entry: 0, from: quote, to: entries[0].text.length }]);
    expect(pages[2].slices).toEqual([{ entry: 1, from: 0, to: entries[1].text.length }]);
  });

  it('finds the page that holds a place', () => {
    expect(pageOfSpot(pages, { entry: 0, at: 0 })).toBe(0);
    expect(pageOfSpot(pages, { entry: 0, at: quote + 2 })).toBe(1);
    expect(pageOfSpot(pages, { entry: 1, at: 5 })).toBe(2);
  });

  it('keeps a quote cut by a page break a quote on the next page', () => {
    expect(runsIn(entries[0].text, quote, entries[0].text.length)).toEqual([{ text: 'رَبِّ﴾', quran: true }, { text: ' ثم', quran: false }]);
  });

  it('splits a slice into paragraphs with their starts', () => {
    const text = entries[1].text;
    expect(paragraphsOf(text, { entry: 1, from: 0, to: text.length }).map(p => text.slice(p.at, p.end))).toEqual(['تقدم الكلام.', 'وقوله ﴿ذَلِكَ الْكِتَابُ﴾ أي هذا الكتاب']);
  });

  it('finds the passage on an ayah', () => {
    expect(entryOfAyah(entries, 2, 3)).toBe(1);
    expect(entryOfAyah(entries, 1, 7)).toBe(0);
  });

  it('finds the passage on an ayah where the book goes back in ayah order', () => {
    const backwards: BookEntry[] = [{ surah: 3, from: 39, to: 39, text: 'a' }, { surah: 3, from: 49, to: 49, text: 'b' }, { surah: 3, from: 41, to: 41, text: 'c' }];
    expect(entryOfAyah(backwards, 3, 41)).toBe(2);
    expect(entryOfAyah(backwards, 3, 45)).toBe(2);
  });

  it('searches past vowel marks and alif and ta marbuta forms, in page order', () => {
    const { hits } = searchBook(entries, pages, 'الكتاب');
    expect(hits.map(hit => [hit.page, hit.entry])).toEqual([[2, 1], [2, 1]]);
    expect(searchBook(entries, pages, 'الحمد لله').hits[0].match).toBe('الْحَمْدُ لِلَّهِ');
    expect(searchBook(entries, pages, 'ا').hits).toEqual([]);
  });
});

describe("al-Sa'di's printed pages", () => {
  const book = sadiEntries(sadi.passages);
  const pages = bookPagesOf(book, breaks.sadi as PageBreak[]);
  it('runs its printed pages in order, each starting at a word', () => {
    expect(pages.length).toBeGreaterThan(0);
    for (let i = 1; i < pages.length; i++) expect(pages[i].page).toBeGreaterThan(pages[i - 1].page);
    for (const [entry, at] of breaks.sadi) expect(at === 0 || /\s/.test(book[entry].text[at - 1])).toBe(true);
  });
  it('opens al-Baqara on page 40, as printed', () => {
    expect(pages[pageOfSpot(pages, { entry: entryOfAyah(book, 2, 1), at: 0 })].page).toBe(40);
  });
});
