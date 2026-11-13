import { describe, expect, it } from 'vitest';
import data from '../data/quran/surahOrder.json';
import { num } from './arabicNumber';
import { BOOKS, citeLabel, citeUrl, ORDER_AIMS, ORDER_LINKS, orderInJuz, orderSurahs } from './surahOrder';

const surahs = orderSurahs(data, num);

describe('surah order data', () => {
  it('gives every surah from Fussilat to al-Nas an aim, and each after Fussilat a link', () => {
    expect(Object.keys(ORDER_AIMS).map(Number)).toEqual(Array.from({ length: 74 }, (_, k) => 41 + k));
    expect(Object.keys(ORDER_LINKS).map(Number)).toEqual(Array.from({ length: 73 }, (_, k) => 42 + k));
  });

  it('cites a page of a known book for every quote, with a volume only for the books in volumes', () => {
    for (const { text, src } of [...Object.values(ORDER_AIMS), ...Object.values(ORDER_LINKS)]) {
      expect(text.trim()).not.toBe('');
      expect(text).not.toMatch(/[A-Za-z]/);
      expect(BOOKS[src.book]).toBeDefined();
      expect(src.page).toBeGreaterThan(0);
      expect(src.sh).toBeGreaterThan(0);
      expect(src.vol !== undefined).toBe(src.book === 'nazm' || src.book === 'masaid');
    }
  });

  it('pairs an ayah before the linked surah with one of it, and the data holds both', () => {
    for (const [to, link] of Object.entries(ORDER_LINKS)) for (const [a, b] of link.pairs) {
      expect(Number(a.split(':')[0])).toBeLessThan(Number(to));
      expect(Number(b.split(':')[0])).toBe(Number(to));
      expect(data.ayat[a as keyof typeof data.ayat]).toBeTruthy();
      expect(data.ayat[b as keyof typeof data.ayat]).toBeTruthy();
    }
  });
});

describe('orderSurahs', () => {
  it('opens each surah with whole ayat from the first', () => {
    expect(surahs).toHaveLength(74);
    expect(surahs[0]).toMatchObject({ surah: 41, name: 'فصلت', juz: [24, 25] });
    expect(surahs.at(-1)!.opening.map(a => a.ayah)).toEqual([1, 2, 3, 4]);
    for (const s of surahs) expect(s.opening[0].ayah).toBe(1);
  });

  it('stops the opening at ten words, four ayat or the surah\'s end', () => {
    for (const s of surahs) {
      const counts = s.opening.map(a => a.text.split(' ').length);
      const total = counts.reduce((x, y) => x + y, 0);
      expect(s.opening.length).toBeLessThanOrEqual(4);
      expect(total >= 10 || s.opening.length === 4 || s.opening.length === data.counts[String(s.surah) as keyof typeof data.counts]).toBe(true);
      expect(total - counts.at(-1)!).toBeLessThan(10);
    }
  });

  it('colours the words a pair shares', () => {
    const duha = surahs.find(s => s.surah === 93)!;
    const [layl, duhaAyah] = duha.link!.pairs[0];
    expect(layl.place).toBe('الليل ١٣');
    expect(layl.words.filter(w => w.shared).length).toBeGreaterThan(0);
    expect(duhaAyah.words.filter(w => w.shared).length).toBeGreaterThan(0);
  });

  it('keeps a surah under every juz it runs through', () => {
    expect(orderInJuz(surahs, 30).map(s => s.surah)).toEqual(Array.from({ length: 37 }, (_, k) => 78 + k));
    expect(orderInJuz(surahs, 25).map(s => s.surah)).toEqual([41, 42, 43, 44, 45]);
    expect(orderInJuz(surahs, 27).map(s => s.surah)).toContain(51);
    expect(orderInJuz(surahs, 26).map(s => s.surah)).toContain(51);
    expect(orderInJuz(surahs, null)).toBe(surahs);
  });
});

describe('cites', () => {
  it('names the page and links it on Shamela', () => {
    expect(citeLabel(ORDER_AIMS[91].src, num)).toBe('البقاعي، نظم الدرر ٢٢/٦٩');
    expect(citeLabel(ORDER_LINKS[93].src, num)).toBe('السيوطي، تناسق الدرر ص١٦٠');
    expect(citeUrl(ORDER_LINKS[93].src)).toBe('https://shamela.ws/book/9992/166');
    expect(citeLabel(ORDER_LINKS[45].src, num)).toBe('ابن الزبير، البرهان ص٣٠٣–٣٠٤');
  });
});
