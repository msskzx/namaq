import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readerAyat } from './branches';
import { normalizeWord } from './normalize';
import { mushafPages, type MushafPage, type ReaderPageData } from './readerPage';
import { indexAyat, searchAyat, searchable } from './ayahSearch';

const pages: ReaderPageData[] = Array.from({ length: 604 }, (_, i) =>
  JSON.parse(readFileSync(join(__dirname, '../../app/quran/read/data', `${i + 1}.json`), 'utf8')),
);
const mushaf: MushafPage[] = Array.from({ length: 604 }, (_, i) =>
  JSON.parse(readFileSync(join(__dirname, '../../app/quran/read/mushaf', `${i + 1}.json`), 'utf8')),
);
const ayat = indexAyat(readerAyat(pages, mushafPages(mushaf)));
const covered = (query: string, key: string) => {
  const hit = searchAyat(ayat, query, 10000).hits.find(found => found.key === key);
  return hit && hit.words.slice(hit.from, hit.to + 1).map(normalizeWord);
};

describe('searchAyat', () => {
  it('finds a phrase typed without tashkeel, with the words it covers', () => {
    const result = searchAyat(ayat, 'الحي القيوم');
    expect(result.hits.map(hit => hit.key)).toEqual(['2:255', '3:2']);
    const kursi = result.hits[0];
    expect(kursi.words.slice(kursi.from, kursi.to + 1).map(normalizeWord)).toEqual(['الحي', 'القيوم']);
  });

  it('matches part of a word at either end of the phrase', () => {
    const [hit] = searchAyat(ayat, 'لا تأخذه سنة').hits;
    expect(hit.key).toBe('2:255');
    expect(searchAyat(ayat, 'حمد لله رب').hits.map(hit => hit.key)).toContain('1:2');
  });

  it('falls back to spelling without alif or hamza, so السماوات finds ٱلسَّمَـٰوَٰتِ', () => {
    expect(searchAyat(ayat, 'خلق السماوات').total).toBeGreaterThan(20);
    expect(searchAyat(ayat, 'قال').hits.every(hit => hit.words.map(normalizeWord).join(' ').includes('قال'))).toBe(true);
  });

  it('keeps the word range right after a word the text splits with a space', () => {
    expect(covered('اثمه علي', '2:181')).toEqual(['اثمه', 'علي']);
    expect(covered('بعد ما سمعه', '2:181')).toEqual(['بعد ما', 'سمعه']);
  });

  it('ignores punctuation in the query and marks in the text', () => {
    expect(searchAyat(ayat, 'الحي، القيوم؟').total).toBe(2);
    const sajda = searchAyat(ayat, 'رب العرش العظيم').hits.find(hit => hit.key === '27:26');
    expect(sajda && [sajda.to - sajda.from, sajda.to]).toEqual([2, sajda!.words.length - 1]);
  });

  it('gives the word range of a match found without alif', () => {
    expect(covered('خلق السماوات', '2:164')).toEqual(['خلق', 'السموت']);
  });

  it('counts every match and returns the first ones in mushaf order', () => {
    const result = searchAyat(ayat, 'فبأي آلاء ربكما تكذبان', 10);
    expect(result.total).toBe(31);
    expect(result.hits).toHaveLength(10);
    expect(result.hits[0].key).toBe('55:13');
  });

  it('searches nothing shorter than two Arabic letters', () => {
    expect(searchable('ق')).toBe(false);
    expect(searchable('baqara')).toBe(false);
    expect(searchAyat(ayat, 'ق').total).toBe(0);
    expect(searchAyat(ayat, 'ءء').total).toBe(0);
    expect(searchAyat(ayat, 'ا ا ا').total).toBe(0);
  });
});
