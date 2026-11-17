import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import trees from '../../data/quran/trees.json';
import type { MushafPage } from '../readerPage';
import { ayahWordsOf, corpusWordsAt, HIZB, pageWordsAt, SPLITS, wordsOnly } from './ayahWords';

const pages: MushafPage[] = Array.from({ length: 604 }, (_, at) => JSON.parse(readFileSync(join(__dirname, `../../data/quran/mushaf/${at + 1}.json`), 'utf8')));
const words = ayahWordsOf(pages);
const LETTER = /[ء-يٱ]/;

describe('ayah words from the Madina pages', () => {
  it('holds every ayah of the Quran', () => {
    expect(Object.keys(words)).toHaveLength(6236);
  });

  it('keeps every sign the page prints: 15 sajdas on their words, waqf signs on theirs, hizb marks as their own tokens', () => {
    const all = Object.values(words).flat();
    expect(all.filter(token => token.includes('۩'))).toHaveLength(15);
    expect(words['27:26'].at(-1)).toBe('ٱلۡعَظِيمِ۩');
    expect(words['2:181'][9].endsWith('\u06DA')).toBe(true);
    expect(all.filter(token => token === HIZB).length).toBe(pages.flatMap(page => page.items).flatMap(item => ('line' in item ? item.line : [])).filter(token => token === HIZB).length);
    expect(all.filter(token => token !== HIZB && !LETTER.test(token))).toEqual([]);
  });

  it('is where the trees take their words: every ayah of trees.json holds the page\'s words, signs and all', () => {
    const ayat = (trees as { ayat: { key: string; words: string[] }[] }).ayat;
    expect(ayat.filter(ayah => JSON.stringify(ayah.words) !== JSON.stringify(wordsOnly(words[ayah.key]))).map(ayah => ayah.key)).toEqual([]);
  });

  it('gives each corpus word to exactly one page word where the two split an ayah differently', () => {
    for (const [key, rows] of Object.entries(SPLITS)) {
      const pageCount = wordsOnly(words[key]).length;
      const given = Array.from({ length: pageCount }, (_, at) => corpusWordsAt(key, at)).flat();
      expect(given, key).toEqual(rows.map((_, old) => old));
      expect(new Set(rows.flatMap((_, old) => pageWordsAt(key, old))).size, key).toBe(pageCount);
    }
  });
});
