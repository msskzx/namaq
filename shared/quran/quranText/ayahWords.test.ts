import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import trees from '../../data/quran/trees.json';
import type { MushafPage } from '../readerPage';
import { ayahWordsOf, HIZB, pageWordsAt, SPLITS, wordsOnly } from './ayahWords';

const pages: MushafPage[] = Array.from({ length: 604 }, (_, at) => JSON.parse(readFileSync(join(__dirname, `../../data/quran/mushaf/${at + 1}.json`), 'utf8')));
const words = ayahWordsOf(pages);
const LETTER = /[ء-يٱ]/;
/** Letters only, so the older text's spelling meets the page's (ى/ي, hamza seats and marks aside). */
const skeleton = (word: string) => word.normalize('NFD').replace(/[^\u0621-\u063A\u0641-\u064A\u0671]/g, '').replace(/[\u0671\u0623\u0625\u0622]/g, '\u0627').replace(/\u0649/g, '\u064A').replace(/[\u0624\u0626]/g, '\u0621');

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

  it('lines up with the older text word by word, the seven split words aside', () => {
    const ayat = (trees as { ayat: { key: string; words: string[] }[] }).ayat;
    const off = ayat.filter(ayah => {
      const page = wordsOnly(words[ayah.key]);
      const covered = ayah.words.map((_, at) => pageWordsAt(ayah.key, at));
      const joined = covered.map(at => skeleton(at.map(index => page[index]).join('')));
      const old = ayah.words.map(word => skeleton(word));
      // A page word that two old words share (لوما = لو + ما) holds both.
      const same = joined.every((page, at) => page === old[at] || (ayah.key in SPLITS && page.includes(old[at])));
      return !same || new Set(covered.flat()).size !== page.length;
    });
    // The older text spells two words otherwise (2:72 «فادارءتم», 11:13 «افتراه»): same word, other rasm.
    expect(off.map(ayah => ayah.key)).toEqual(['2:72', '11:13']);
    expect(Object.keys(SPLITS).every(key => ayat.find(ayah => ayah.key === key)!.words.length === SPLITS[key].length)).toBe(true);
  });
});
