import { describe, expect, it } from 'vitest';
import poem from '@/app/quran/tajwid/tuhfat-al-atfal/poem.json';
import { numberVerses, type Poem } from './poem';

const marks = /[ً-ْ]/;

describe('Tuhfat al-Atfal', () => {
  const chapters = numberVerses(poem as Poem);
  const verses = chapters.flatMap(chapter => chapter.verses);

  it('numbers its 61 verses straight through the chapters', () => {
    expect(verses.map(verse => verse.number)).toEqual(Array.from({ length: 61 }, (_, i) => i + 1));
    expect(chapters.map(chapter => chapter.verses[0].number)).toEqual([1, 6, 17, 18, 24, 30, 35, 42, 48, 58]);
  });

  it('holds each verse as exactly two halves, and lists corrected verses that exist', () => {
    for (const chapter of poem.chapters) for (const verse of chapter.verses) expect(verse).toHaveLength(2);
    expect(poem.corrected).toEqual([...new Set(poem.corrected)].sort((a, b) => a - b));
    expect(Math.min(...poem.corrected)).toBeGreaterThanOrEqual(1);
    expect(Math.max(...poem.corrected)).toBeLessThanOrEqual(verses.length);
  });

  it('keeps both halves of every verse, vowelled', () => {
    for (const { first, second } of verses) {
      expect(first.trim()).toBe(first);
      expect(second.trim()).toBe(second);
      for (const word of `${first} ${second}`.split(' ')) expect(word).toMatch(marks);
    }
  });
});
