import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { fromBuckwalter } from '../../../src/lib/quran/lemmas';
import surahs from '../../data/quran/surahs.json';
import kashshaf from '../../data/quran/kashshaf';
import { ayahWords, mushafPages, type MushafPage } from '../readerPage';
import { ayahWordsOf, corpusWordsAt, wordsOnly } from './ayahWords';

// Owner 2026-11-24: no display drops or adds a word of a source text. Every ayah is checked here, all 6,236 of them:
// once against a second copy made apart from the Madina pages, then through each way the app and the website read
// an ayah off the pages.

const ROOT = join(__dirname, '../../..');
const pages: MushafPage[] = Array.from({ length: 604 }, (_, at) => JSON.parse(readFileSync(join(ROOT, `shared/data/quran/mushaf/${at + 1}.json`), 'utf8')));
const tokens = ayahWordsOf(pages);
const keys = Object.keys(tokens);
const startPage = mushafPages(pages);
const surahBefore = (page: number) => surahs.findLast(row => row.page != null && row.page < page)?.number;

/** The Quranic Arabic Corpus (Tanzil's Uthmani text): each ayah's words, each word's segments joined. */
const corpus = new Map<string, string[]>();
for (const line of readFileSync(join(ROOT, 'data/quran/quranic-corpus-morphology-0.4.txt'), 'utf8').split('\n')) {
  const match = line.match(/^\((\d+):(\d+):(\d+):\d+\)\t([^\t]+)/);
  if (!match) continue;
  const words = corpus.get(`${match[1]}:${match[2]}`) ?? [];
  words[Number(match[3]) - 1] = (words[Number(match[3]) - 1] ?? '') + fromBuckwalter(match[4].replace(/ /g, ''));
  corpus.set(`${match[1]}:${match[2]}`, words);
}

/**
 * The letters alone. The two copies spell a hamza, a long alif and a tatweel their own ways («ٱلۡأٓخِرَةِ», «ٱلۡءَاخِرَةِ»),
 * so those are folded; any other letter that differs, and any word dropped or added, still shows.
 */
const letters = (text: string) => text.normalize('NFC').replace(/[^ء-يٱ]/g, '').replace(/[ءـ]/g, '')
  .replace(/[ٱأإآ]/g, 'ا').replace(/ؤ/g, 'و').replace(/[ئى]/g, 'ي').replace(/ة/g, 'ت');

/**
 * Where the corpus spells a word with letters the page does not print. Reported to the owner 2026-11-28; it stays here
 * until a named source (the printed Madina page) says which copy is right, and leaves when that is settled.
 */
const LETTERS_DIFFER: Record<string, string> = {
  '12:39': 'the page «يَٰصَٰحِبَيِ», the corpus «يَٰصَىٰحِبَىِ»',
  '12:41': 'the page «يَٰصَٰحِبَيِ», the corpus «يَٰصَىٰحِبَىِ»',
};

describe('every ayah against the Quranic Arabic Corpus', () => {
  it('has the corpus\'s ayat, surah by surah', () => {
    expect(keys.length).toBeGreaterThan(0);
    expect(keys).toEqual([...corpus.keys()]);
    expect(surahs.map(row => [row.number, keys.filter(key => key.startsWith(`${row.number}:`)).length])).toEqual(surahs.map(row => [row.number, row.numberOfAyat]));
  });

  it('gives every corpus word to the page: none dropped, none added', () => {
    const differ = keys.filter(key => {
      const given = wordsOnly(tokens[key]).flatMap((_, at) => corpusWordsAt(key, at));
      return JSON.stringify(given) !== JSON.stringify(corpus.get(key)!.map((_, at) => at));
    });
    expect(differ).toEqual([]);
  });

  it('spells every ayah with the corpus\'s letters, except where the two copies are known to differ', () => {
    const differ = keys.filter(key => letters(wordsOnly(tokens[key]).join('')) !== letters(corpus.get(key)!.join('')));
    expect(differ).toEqual(Object.keys(LETTERS_DIFFER));
  });
});

describe('every ayah as the app and the website read it off the pages', () => {
  // The reader, the phone's ayah views (mobile/src/lib/mushaf.ts ayahMushafWords) and the website (pageAyat) read the
  // same pages two ways: page by page through the reader's lines, and in one run over all the pages.
  it('reads the same words, signs and hizb marks page by page as in one run', () => {
    const differ = keys.filter(key => {
      const read: string[] = [];
      for (let page = startPage.get(key)!; page <= pages.length; page++) {
        const words = ayahWords(key, pages[page - 1], surahBefore(page));
        if (!words.length) break;
        read.push(...words);
      }
      return JSON.stringify(read) !== JSON.stringify(tokens[key]);
    });
    expect(differ).toEqual([]);
  });

  // Copying an ayah (mobile/src/lib/mushaf.ts ayahText) reads only the page it starts on.
  it('holds each ayah whole on the page it starts on, so a copied ayah has all its words', () => {
    const cut = keys.filter(key => JSON.stringify(ayahWords(key, pages[startPage.get(key)! - 1], surahBefore(startPage.get(key)!))) !== JSON.stringify(tokens[key]));
    expect(cut).toEqual([]);
  });

  it('lights only words the ayah has when al-Kashshaf quotes it', () => {
    const lit = kashshaf.entries.flatMap(([surah, , , , , , , spans]) => spans.filter(([, , , ayah, from]) => ayah && from >= 0).map(([, , , ayah, from, to]) => ({ key: `${surah}:${ayah}`, from, to })));
    expect(lit.length).toBeGreaterThan(0);
    expect(lit.filter(({ key, from, to }) => !tokens[key] || from > to || to >= wordsOnly(tokens[key]).length)).toEqual([]);
  });
});
