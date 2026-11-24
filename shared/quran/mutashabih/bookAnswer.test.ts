import { describe, expect, test } from 'vitest';
import source from './evidence.json';
import answers from '../../data/quran/mutashabihAnswers';
import kirmani from '../../data/quran/mutashabihKirmani';
import iskafi from '../../data/quran/mutashabihIskafi';
import zubayr from '../../data/quran/mutashabihZubayr';
import { answerBookOf, buildAnswers, cardAnswers } from './bookAnswer';
import { unbalancedAt } from '../opening';

const books = { K: kirmani, I: iskafi, G: zubayr };
const shipped = answers;
const flat = (text: string) => text.replace(/\s+/g, ' ').trim();
const cases = new Map(source.cases.map(citation => [citation.id, citation]));

describe('the books\' answers on the mutashabih page', () => {
  test('the app ships what the books give now (npm run quran:mutashabih-answers)', () => {
    expect(shipped).toEqual(buildAnswers(source.cases, books));
  });

  test('every answer is its book\'s own words, as the book or the citation has them', () => {
    const texts = Object.fromEntries(Object.entries(books).map(([id, data]) => [id, flat(data.entries.map(([, text]) => text).join('\n'))]));
    const ids = Object.keys(shipped);
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      const words = flat(shipped[id][0]);
      expect(texts[answerBookOf(id)!].includes(words) || flat(cases.get(id)!.quote).includes(words), id).toBe(true);
    }
  });

  test('no answer leaves a bracket or a quotation open', () => {
    for (const [id, [text]] of Object.entries(shipped)) {
      expect(unbalancedAt(text), id).toBe(-1);
      expect((text.match(/"/g) ?? []).length % 2, id).toBe(0);
    }
  });

  test('al-Kirmani\'s answers start after the ayah his entry opens on, not on «قوله»', () => {
    for (const [id, [text]] of Object.entries(shipped)) if (answerBookOf(id) === 'K') expect(text, id).not.toMatch(/^قَ?وْ?له/);
  });

  test('every answer names a page its book prints, so «اقرأ الباقي» opens it there', () => {
    for (const [id, [, , page]] of Object.entries(shipped)) {
      const book = books[answerBookOf(id)!];
      expect(book.breaks.some(([, , part, printed]) => `${part}:${printed}` === page), id).toBe(true);
    }
  });

  test('al-Iskafi\'s and Ibn al-Zubayr\'s answers never open on the question their citation quotes', () => {
    const letters = (text: string) => text.replace(/[^\u0621-\u064A]/g, '');
    for (const [id, [text]] of Object.entries(shipped)) {
      if (answerBookOf(id) === 'K') continue;
      expect(letters(cases.get(id)!.quote).startsWith(letters(text).slice(0, 20)), id).toBe(false);
    }
  });

  test('al-Baqarah 126 and Ibrahim 35: each book gives its reason, not the question the card already shows', () => {
    const cited = source.cases.filter(citation => citation.places.includes('2:126') && answerBookOf(citation.id));
    expect(cited.map(citation => answerBookOf(citation.id)).sort()).toEqual(['G', 'I', 'K']);
    for (const citation of cited) expect(shipped[citation.id][0], citation.id).toMatch(/^(والجواب|ووجهه|وَفِي إِبْرَاهِيم)/);
  });
});

describe('cardAnswers', () => {
  test('one answer for each book that cites a card, oldest author first, the fullest when a book cites it twice', () => {
    const groups = new Map<string, { id: string }[]>();
    for (const citation of source.cases) for (const place of citation.places) groups.set(place, [...(groups.get(place) ?? []), citation]);
    const order = ['I', 'K', 'G'];
    let twice = 0;
    for (const citations of groups.values()) {
      const shown = cardAnswers(citations, shipped);
      expect(shown.map(answer => order.indexOf(answer.book))).toEqual([...shown.map(answer => order.indexOf(answer.book))].sort());
      expect(new Set(shown.map(answer => answer.book)).size).toBe(shown.length);
      for (const answer of shown) {
        const own = citations.filter(citation => answerBookOf(citation.id) === answer.book && shipped[citation.id]);
        if (own.length > 1) twice++;
        for (const other of own) expect(shipped[other.id][0].length).toBeLessThanOrEqual(answer.text.length);
      }
    }
    expect(twice).toBeGreaterThan(0);
  });
});
