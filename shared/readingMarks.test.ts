import { beforeEach, describe, expect, it } from 'vitest';
import { setKeyStorage } from './storage';
import { isParagraphSaved, lastBookSpot, readFasilas, setBookFasila, setLastBookSpot, setQuranFasila, toggleSavedParagraph } from './readingMarks';

describe('reading marks', () => {
  beforeEach(() => {
    const data = new Map<string, string>();
    setKeyStorage({ getItem: key => data.get(key) ?? null, setItem: (key, value) => void data.set(key, value) });
  });

  it('keeps the فاصلة apart from the page last open', () => {
    setBookFasila('sadi', { entry: 3, at: 0, part: 1, page: 41 });
    setLastBookSpot('sadi', { entry: 90, at: 120 });
    expect(readFasilas().sadi).toEqual({ entry: 3, at: 0, part: 1, page: 41 });
    expect(lastBookSpot('sadi')).toEqual({ entry: 90, at: 120 });
  });

  it('keeps one فاصلة for the mushaf and one for each book', () => {
    setQuranFasila({ key: '2:5', page: 2 });
    setBookFasila('kashshaf', { entry: 1, at: 0, part: 1, page: 9 });
    setQuranFasila({ key: '3:1', page: 50 });
    expect(readFasilas()).toEqual({ quran: { key: '3:1', page: 50 }, kashshaf: { entry: 1, at: 0, part: 1, page: 9 } });
    setQuranFasila(null);
    setBookFasila('kashshaf', null);
    expect(readFasilas()).toEqual({});
  });

  it('saves a paragraph and lets it go', () => {
    const item = { book: 'sadi' as const, entry: 2, at: 14, part: 1, page: 41, text: 'يخبر تعالى' };
    expect(toggleSavedParagraph(item)).toBe(true);
    expect(isParagraphSaved('sadi', { entry: 2, at: 14 })).toBe(true);
    expect(isParagraphSaved('kashshaf', { entry: 2, at: 14 })).toBe(false);
    expect(toggleSavedParagraph(item)).toBe(false);
    expect(isParagraphSaved('sadi', { entry: 2, at: 14 })).toBe(false);
  });
});
