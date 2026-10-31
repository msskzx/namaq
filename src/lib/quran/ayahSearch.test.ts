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
    expect(result.hits.map(hit => hit.key)).toEqual(['2:255', '3:2', '20:111']);
    const kursi = result.hits[0];
    expect(kursi.words.slice(kursi.from, kursi.to + 1).map(normalizeWord)).toEqual(['الحي', 'القيوم']);
  });

  it('matches part of a word at either end of the phrase', () => {
    const [hit] = searchAyat(ayat, 'لا تأخذه سنة').hits;
    expect(hit.key).toBe('2:255');
    expect(searchAyat(ayat, 'حمد لله رب').hits.map(hit => hit.key)).toContain('1:2');
  });

  it('matches the normal spelling, so السماوات finds ٱلسَّمَـٰوَٰتِ', () => {
    expect(searchAyat(ayat, 'خلق السماوات').total).toBeGreaterThan(20);
    expect(searchAyat(ayat, 'قال').hits.every(hit => hit.words.map(normalizeWord).join(' ').includes('قال'))).toBe(true);
  });

  it('keeps the word range right after a word the text splits with a space', () => {
    expect(covered('اثمه علي', '2:181')).toEqual(['اثمه', 'علي']);
    expect(covered('بعد ما سمعه', '2:181')).toEqual(['بعد ما', 'سمعه']);
  });

  it('ignores punctuation in the query and marks in the text', () => {
    expect(searchAyat(ayat, 'الحي، القيوم؟').total).toBe(3);
    const sajda = searchAyat(ayat, 'رب العرش العظيم').hits.find(hit => hit.key === '27:26');
    expect(sajda && [sajda.to - sajda.from, sajda.to]).toEqual([2, sajda!.words.length - 1]);
  });

  it('gives the word range of a match found by its normal spelling', () => {
    expect(covered('خلق السماوات', '2:164')).toEqual(['خلق', 'السموت']);
  });

  it('counts every match and returns the first ones in mushaf order', () => {
    const result = searchAyat(ayat, 'فبأي آلاء ربكما تكذبان', 10);
    expect(result.total).toBe(31);
    expect(result.hits).toHaveLength(10);
    expect(result.hits[0].key).toBe('55:13');
  });

  it('finds dagger-alif and waw-for-alif words by their normal spelling', () => {
    expect(covered('صراط', '1:7')).toEqual(['صرط']);
    expect(covered('الصراط المستقيم', '1:6')).toEqual(['الصرط', 'المستقيم']);
    expect(covered('الصلاة', '2:3')).toEqual(['الصلوه']);
    expect(covered('الزكاة', '2:43')).toEqual(['الزكوه']);
    expect(covered('غلام', '3:40')).toEqual(['غلم']);
    expect(covered('إبراهيم', '2:124')).toEqual(['ابرهم']);
    expect(covered('إبراهيم', '3:33')).toEqual(['ابرهيم']);
    expect(covered('التوراة', '3:3')).toEqual(['التوريه']);
  });

  it('still finds the rasm spelling, and mixes both in one phrase', () => {
    expect(searchAyat(ayat, 'صرط').total).toBe(searchAyat(ayat, 'صراط').total);
    expect(covered('ذلك الكتاب', '2:2')).toEqual(['ذلك', 'الكتب']);
  });

  it('does not let a few full-alif spellings hide the rest', () => {
    expect(searchAyat(ayat, 'كتاب').total).toBeGreaterThan(200);
    expect(searchAyat(ayat, 'مالك', 10000).hits.map(hit => hit.key)).not.toContain('2:102');
  });

  it('tolerates hamza typed differently or left out, after exact matches', () => {
    expect(covered('القرآن', '2:185')).toEqual(['القرءان']);
    expect(covered('الذين امنوا', '2:62')).toEqual(['الذين', 'ءامنوا']);
    expect(covered('يا أيها الذين', '2:104')).toEqual(['يايها', 'الذين']);
    expect(covered('هؤلاء', '2:31')).toEqual(['هؤلاء']);
  });

  it('finds madda words typed plainly without flooding (review: ماء, جاء, السماء)', () => {
    for (const [query, most] of [['ماء', 200], ['جاء', 260], ['السماء', 130], ['سواء', 40]] as const) {
      const result = searchAyat(ayat, query, 10000);
      expect(result.total).toBeGreaterThan(0);
      expect(result.total).toBeLessThan(most);
    }
    expect(searchAyat(ayat, 'السموات').total).toBeGreaterThan(150);
  });

  it('finds hamza seated differently next to the same spelling (review: سأل, الملائكة)', () => {
    const asked = searchAyat(ayat, 'سأل', 10000).hits.map(hit => hit.key);
    expect(asked).toEqual(expect.arrayContaining(['70:1', '2:189', '2:215', '2:134']));
    expect(searchAyat(ayat, 'الملائكة', 10000).hits.map(hit => hit.key)).toEqual(expect.arrayContaining(['2:30', '2:34', '2:31']));
  });

  it('searches nothing shorter than two Arabic letters (ءء is a real pair: ءَأَنذَرْتَهُمْ)', () => {
    expect(searchable('ق')).toBe(false);
    expect(searchable('baqara')).toBe(false);
    expect(searchAyat(ayat, 'ق').total).toBe(0);
    expect(searchAyat(ayat, 'ء').total).toBe(0);
    expect(searchAyat(ayat, 'ا ا ا').total).toBe(0);
  });
});
