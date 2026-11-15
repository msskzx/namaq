import { describe, expect, it } from 'vitest';
import surahs from '../data/quran/surahs.json';
import ukbari from '../data/quran/irabUkbari';
import { ukbariCredit, ukbariOf, ukbariPage, type UkbariData } from './irab';
import { irabWordsAt } from './irabData';

describe('the short i\'rab line', () => {
  it('gives each word its role and morphology, and the word the role points at', () => {
    const words = irabWordsAt('112:4');
    expect(words).toHaveLength(5);
    expect(words[3]).toMatchObject({ role: 'خبر يكن', head: 1 });
    expect(words[3].morph).toContain('الجذر (كفأ)');
    expect(words[4].role).toBe('اسم يكن');
  });

  it('finds the first and last ayat and no ayah past a surah', () => {
    expect(irabWordsAt('1:1')).toHaveLength(4);
    expect(irabWordsAt('114:6').length).toBeGreaterThan(0);
    expect(irabWordsAt('1:8')).toEqual([]);
    expect(irabWordsAt('115:1')).toEqual([]);
    expect(irabWordsAt('x')).toEqual([]);
  });

  it('covers every ayah', () => {
    for (const surah of surahs) for (let ayah = 1; ayah <= surah.numberOfAyat; ayah++) expect(irabWordsAt(`${surah.number}:${ayah}`).length).toBeGreaterThan(0);
  });
});

describe("al-'Ukbari's passages", () => {
  const book: UkbariData = ukbari;

  it('puts a passage on the words its heading names', () => {
    const [passage] = ukbariOf(book, '112:4', [3]);
    expect(passage).toMatchObject({ from: 3, to: 4, page: 1309 });
    expect(passage.text.startsWith('قَوْلُهُ تَعَالَى: ﴿كُفُوًا أَحَدٌ﴾')).toBe(true);
    expect(ukbariCredit(passage)).toBe('التبيان في إعراب القرآن للعكبري، ص ١٣٠٩');
    expect(ukbariPage(passage)).toBe('https://quranpedia.net/book/309/1/1309');
  });

  it('shows nothing for a word he skips in an ayah he discusses only by word', () => {
    expect(ukbariOf(book, '112:4', [1])).toEqual([]);
  });

  it('falls back to a passage on the whole ayah', () => {
    const fixture: UkbariData = { source: { version: '', book: 309 }, entries: [[1, 2, -1, -1, 4, 'على الآية'], [1, 2, 0, 0, 4, 'على الحمد']] };
    expect(ukbariOf(fixture, '1:2', [0]).map(p => p.text)).toEqual(['على الحمد']);
    expect(ukbariOf(fixture, '1:2', [2]).map(p => p.text)).toEqual(['على الآية']);
  });

  it('keeps every passage inside its ayah', () => {
    for (const [surah, ayah, from, to, page, text] of book.entries) {
      const words = irabWordsAt(`${surah}:${ayah}`).length;
      expect(words, `${surah}:${ayah}`).toBeGreaterThan(0);
      expect(from === -1 ? to === -1 : from >= 0 && from <= to && to < words, `${surah}:${ayah} ${from}-${to}`).toBe(true);
      expect(page).toBeGreaterThan(0);
      expect(/[ء-ي]/.test(text.replace(/\([٠-٩]+\)/g, '')), `${surah}:${ayah} «${text}»`).toBe(true);
    }
  });
});
