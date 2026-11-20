import { describe, expect, it } from 'vitest';
import { termChapters, termOf, termView } from './balaghaTerms';

describe('balagha terms on the website', () => {
  it('lists every term under its chapter with its first line and its examples counted', () => {
    const chapters = termChapters();
    expect(chapters.length).toBeGreaterThan(3);
    expect(chapters.flatMap(chapter => chapter.items).every(item => item.plain && item.line && item.count >= 0)).toBe(true);
  });

  it('gives each example its ayat as mushaf words with the quoted words lit inside them', async () => {
    const term = termOf(termChapters().flatMap(chapter => chapter.items).find(item => item.count > 0)!.name)!;
    const { examples } = await termView(term);
    for (const line of examples[0].lines) {
      expect(line.words.length).toBeGreaterThan(0);
      for (const [from, to] of line.lit) expect(to < line.words.length && from <= to).toBe(true);
    }
  });

});
