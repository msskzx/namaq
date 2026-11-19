import { describe, expect, it } from 'vitest';
import { bookPagesOf, pageOfPrinted } from '../../bookReader';
import { citationInBook, mutashabihEntries, type MutashabihBookData } from '../../readerBooks';
import evidence from '../../quran/mutashabih/evidence.json';
import kirmani from './mutashabihKirmani';
import iskafi from './mutashabihIskafi';
import zubayr from './mutashabihZubayr';

const BOOKS: Record<string, MutashabihBookData> = { kirmani, iskafi, zubayr };
const built = Object.fromEntries(Object.entries(BOOKS).map(([id, data]) => {
  const entries = mutashabihEntries(data);
  return [id, { entries, pages: bookPagesOf(entries, data.breaks) }];
}));
const words = (text: string) => (text.replace(/[ً-ْٰـ]/g, '').replace(/[أإآ]/g, 'ا').match(/[ء-ي]+/g) ?? []).join(' ');

describe.each(Object.keys(BOOKS))('the book of mutashabih %s', id => {
  const { entries, pages } = built[id];

  // AGENTS.md: an old author's book ships with his words only. Each wrote his numbers in words, so a digit or a square bracket is the editor's.
  it("holds no number or square bracket of the editor's", () => {
    for (const entry of entries) expect(entry.text).not.toMatch(/[٠-٩0-9[\]]/);
  });

  it('runs through the surahs in the mushaf order, after the preface', () => {
    const surahs = entries.map(entry => entry.surah);
    expect(surahs.length).toBeGreaterThan(1);
    surahs.slice(1).forEach((surah, i) => expect(surah).toBeGreaterThan(surahs[i]));
    expect(Math.max(...surahs)).toBe(114);
  });

  it('turns its printed pages in order', () => {
    pages.slice(1).forEach((page, i) => expect(page.part > pages[i].part || (page.part === pages[i].part && page.page > pages[i].page)).toBe(true));
  });
});

// «اقرأ في الكتاب» on a branch card opens the book at the citation's page: the words it quotes are on it or on a page beside it
// (a quote can start on the page before, or be a later question of the section that starts there).
describe("a branch card's citation of these books", () => {
  const cited = evidence.cases.filter(row => citationInBook(row));

  it('opens on a page the book holds, where its quote is', () => {
    expect(cited.length).toBeGreaterThan(0);
    for (const row of cited) {
      const { book, printed } = citationInBook(row)!;
      const { entries, pages } = built[book];
      const [part, page] = printed.split(':').map(Number);
      const at = pageOfPrinted(pages, part, page);
      expect(pages[at], row.id).toMatchObject({ part, page });
      const text = [at - 1, at, at + 1].filter(i => pages[i]).map(i => pages[i].slices.map(slice => entries[slice.entry].text.slice(slice.from, slice.to)).join(' ')).join(' ');
      expect(words(text), row.id).toContain(words(row.quote).split(' ').slice(0, 3).join(' '));
    }
  });
});
