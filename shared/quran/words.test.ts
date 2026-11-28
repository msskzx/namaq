import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import data from '../data/quran/words.json';
import trees from './quranText/corpus';
import { pageGroups, type MushafPage } from './readerPage';
import { corpusWords, countsBySurah, lemmasAtMushafWord, lemmasOfWord, mushafWords, placesOf, searchWords, type WordsData } from './words';
import { corpusWordsAt } from './quranText/ayahWords';
import { normalizeWord } from './normalize';

const words = data as unknown as WordsData;
const idOf = (name: string) => words.lemmas.findIndex(([lemma]) => lemma === name);
const wordCount = (id: number) => placesOf(words, id).reduce((sum, place) => sum + place.words.length, 0);

describe('word counts', () => {
  it('keeps the corpus figures as corpus.quran.com gives them', () => {
    expect(words.lemmas[idOf('ٱللَّه')][1]).toBe(2699);
    expect(placesOf(words, idOf('ٱللَّه'))).toHaveLength(1821);
    expect(words.lemmas[idOf('جَنَّة')][1]).toBe(147);
    expect(words.lemmas[idOf('يَوۡم')][1]).toBe(405);
    expect(words.lemmas[idOf('حَيَوٰة')][1]).toBe(76);
    expect(data.notice).toMatch(/Quranic Arabic Corpus \(morphology, version 0\.4\)/);
  });

  it('marks as many words as each lemma counts', () => {
    words.lemmas.forEach(([name, count], id) => expect([name, wordCount(id)]).toEqual([name, count]));
  });

  it('names every lemma once, words sharing a spelling by what they are rather than a number', () => {
    const names = words.lemmas.map(([name]) => name);
    expect(new Set(names).size).toBe(names.length);
    expect(names.filter(name => /[٠-٩]$/.test(name))).toEqual([]);
    expect(names).toContain('عَصَا (العصا)');
    expect(names).toContain('عَصَىٰ (فعل)');
  });

  it('finds a word without its vowel marks, most frequent first', () => {
    expect(words.lemmas[searchWords(words, 'الله', 5)[0]][0]).toBe('ٱللَّه');
    expect(searchWords(words, '  ', 5)).toEqual([]);
    expect(words.lemmas[searchWords(words, 'عصا', 5)[0]][0]).toBe('عَصَا (العصا)');
  });

  it('finds a word typed with «ال» as it finds it without (owner, 2026-11-28: «الرحمن» found nothing)', () => {
    for (const [withArticle, bare] of [['الرحمن', 'رحمن'], ['الأرض', 'أرض'], ['السماء', 'سماء'], ['الكتاب', 'كتاب']]) {
      expect(searchWords(words, bare, 5).length).toBeGreaterThan(0);
      expect(searchWords(words, withArticle, 5)).toEqual(searchWords(words, bare, 5));
    }
    expect(searchWords(words, 'الكتاب', 5).map(id => words.lemmas[id][0])).toContain('كِتَٰب');
    expect(searchWords(words, 'اَلرحمن', 5)).toEqual(searchWords(words, 'رحمن', 5));
  });

  it('cuts no «ال» off a word whose «أل» is its own letters', () => {
    for (const typed of ['ألسنة', 'ألباب', 'ألوان', 'ألواح']) {
      const needle = normalizeWord(typed);
      for (const id of searchWords(words, typed, 5)) {
        const lemma = words.lemmas[id][0];
        expect(`${normalizeWord(lemma)} ${normalizeWord(lemma.replace(/\u0670/g, 'ا'))}`).toContain(needle);
      }
    }
  });

  it('gives a word with two lemmas both, and a pronoun none', () => {
    expect(lemmasOfWord(words, '2:3', 5).map(id => words.lemmas[id][0])).toEqual(['مِن', 'مَا']);
    expect(lemmasOfWord(words, '2:29', 0)).toEqual([]);
  });
});

describe('reader words', () => {
  const ayat: Record<string, string[]> = {};
  let top: number | undefined;
  for (let page = 1; page <= 604; page++) {
    const data = JSON.parse(readFileSync(join(__dirname, `../data/quran/mushaf/${page}.json`), 'utf8')) as MushafPage;
    pageGroups(data.items, top).forEach(line => line?.forEach(group => {
      top = group.surah;
      if (group.word && group.word !== '۞') (ayat[`${group.surah}:${group.ayah}`] ??= []).push(group.word);
    }));
  }

  it('maps every mushaf word onto the corpus words, all of them, in order', () => {
    const keys = trees.ayat.map(ayah => ayah.key);
    expect(Object.keys(ayat).sort()).toEqual([...keys].sort());
    for (const key of keys) {
      const [surah, number] = key.split(':').map(Number);
      const corpus = words.ayat[surah - 1][number - 1].split(' ').length;
      const mapped = ayat[key].flatMap((_, i) => corpusWords(key, i));
      expect([key, [...new Set(mapped)]]).toEqual([key, Array.from({ length: corpus }, (_, i) => i)]);
    }
  });

  it('finds the mushaf words of every corpus word, the way back of corpusWords', () => {
    for (const key of Object.keys(ayat)) {
      const [surah, number] = key.split(':').map(Number);
      const corpus = words.ayat[surah - 1][number - 1].split(' ').length;
      for (let word = 0; word < corpus; word++) {
        const back = ayat[key].map((_, i) => i).filter(i => corpusWords(key, i).includes(word));
        expect([key, word, mushafWords(key, word)]).toEqual([key, word, back]);
      }
    }
  });

  it('matches the corpus words the app shows ayah cards with', () => {
    for (const ayah of trees.ayat) {
      const [surah, number] = ayah.key.split(':').map(Number);
      const shown = ayah.words.filter(word => !word.startsWith('﴿') && word !== '۞').flatMap((_, at) => corpusWordsAt(ayah.key, at)).length;
      expect([ayah.key, shown]).toEqual([ayah.key, words.ayat[surah - 1][number - 1].split(' ').length]);
    }
  });

  it('reads «بعد ما» as one word and «مالي» as two', () => {
    expect(corpusWords('2:181', 2)).toEqual([2]);
    expect(corpusWords('2:181', 3)).toEqual([2]);
    expect(corpusWords('2:181', 4)).toEqual([3]);
    expect(corpusWords('27:20', 3)).toEqual([3, 4]);
    expect(corpusWords('27:20', 4)).toEqual([5]);
    expect(lemmasAtMushafWord(words, '36:22', 0).map(id => words.lemmas[id][0])).toEqual(['مَا']);
  });
});

describe('counts by surah', () => {
  const words = data as unknown as WordsData;
  const musa = words.lemmas.findIndex(([name]) => name === 'مُوسَىٰ');

  it('adds up to the word\'s count, with al-A\'raf the most for Musa', () => {
    const counts = countsBySurah(placesOf(words, musa));
    expect(counts).toHaveLength(114);
    expect(counts.reduce((a, b) => a + b, 0)).toBe(words.lemmas[musa][1]);
    expect(counts[6]).toBe(Math.max(...counts));
    expect(counts[0]).toBe(0);
  });

  it('counts an ayah that holds the word twice twice', () => {
    expect(countsBySurah([{ key: '2:51', words: [1] }, { key: '2:60', words: [2, 9] }])[1]).toBe(3);
  });

});
