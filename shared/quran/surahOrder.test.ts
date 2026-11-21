import { describe, expect, it } from 'vitest';
import corpus from './quranText/corpus';
import surahRows from '../data/quran/surahs.json';
import { num } from './arabicNumber';
import { BOOKS, citeLabel, citeUrl, ORDER_AIMS, ORDER_LINKS, ORDER_JUZ, linkShows, orderInJuz, orderSurahs, toggledJuz } from './surahOrder';

const pageWords = new Map(corpus.ayat.map(ayah => [ayah.key, ayah.words]));
const data = (key: string) => pageWords.get(key);
const surahs = orderSurahs(data, num);

describe('surah order data', () => {
  it('gives every surah from al-Fatiha to al-Nas an aim, and each after al-Fatiha a link', () => {
    expect(Object.keys(ORDER_AIMS).map(Number)).toEqual(Array.from({ length: 114 }, (_, k) => 1 + k));
    expect(Object.keys(ORDER_LINKS).map(Number)).toEqual(Array.from({ length: 113 }, (_, k) => 2 + k));
  });

  it('covers every juz and keeps the Ghafir–Fussilat boundary connected', () => {
    expect(ORDER_JUZ).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
    expect(orderInJuz(surahs, [1]).map(s => s.surah)).toEqual([1, 2]);
    expect(surahs.find(s => s.surah === 41)!.link).toMatchObject({ src: { book: 'tanasuq', page: 130, sh: 131 } });
    expect(surahs[0].link).toBeUndefined();
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
      expect(data(a)).toBeTruthy();
      expect(data(b)).toBeTruthy();
    }
  });
});

describe('orderSurahs', () => {
  it('opens each surah with whole ayat from the first', () => {
    expect(surahs).toHaveLength(114);
    expect(surahs[0]).toMatchObject({ surah: 1, name: 'الفَاتِحَةْ', juz: [1, 1] });
    expect(surahs.at(-1)!.opening.map(a => a.ayah)).toEqual([1, 2, 3, 4]);
    for (const s of surahs) expect(s.opening[0].ayah).toBe(1);
  });

  it('stops the opening at ten words, four ayat or the surah\'s end', () => {
    for (const s of surahs) {
      const counts = s.opening.map(a => a.text.split(' ').length);
      const total = counts.reduce((x, y) => x + y, 0);
      expect(s.opening.length).toBeLessThanOrEqual(4);
      expect(total >= 10 || s.opening.length === 4 || s.opening.length === surahRows.find(row => row.number === s.surah)!.numberOfAyat).toBe(true);
      expect(total - counts.at(-1)!).toBeLessThan(10);
    }
  });

  // Owner 2026-11-21: the books' Quran quotes showed without the mushaf's tashkeel; every quote is set from the page words.
  it('sets every Quran quote in the books from the mushaf page words', () => {
    const runs = surahs.flatMap(s => [...s.aim.runs, ...(s.link?.runs ?? [])]);
    expect(runs.some(run => 'quran' in run)).toBe(true);
    for (const run of runs) if ('quran' in run) for (const { key, words } of run.quran) {
      expect(data(key)!.join(' ')).toContain(words.join(' '));
    }
    const quotes = (surah: number) => surahs.find(s => s.surah === surah)!.link!.runs.flatMap(run => ('quran' in run ? [run.quran.map(a => a.key)] : []));
    // A quote over three ayat at the end of the surah before.
    expect(quotes(15)[0]).toEqual(['14:48', '14:49', '14:50']);
    // «"١"» names the surah's own first ayah, though the same words open 4:19 first (review, 2026-11-21).
    expect(quotes(5)[1]).toEqual(['5:1']);
  });

  it('leaves a quote in the book\'s words when the ayah the book names does not hold it', () => {
    // al-Suyuti cites «"طه: ١٢٩"» for words 20:129 does not have; they are 42:14's, which he did not name.
    const link = surahs.find(s => s.surah === 21)!.link!;
    expect(link.runs.some(run => 'text' in run && run.text.startsWith('﴿وَلَوْلا كَلِمَةٌ'))).toBe(true);
  });

  it('colours the words a pair shares', () => {
    const duha = surahs.find(s => s.surah === 93)!;
    const [layl, duhaAyah] = duha.link!.pairs[0];
    expect(layl.place).toBe('اللَّيْلْ ١٣');
    expect(layl.words.filter(w => w.shared).length).toBeGreaterThan(0);
    expect(duhaAyah.words.filter(w => w.shared).length).toBeGreaterThan(0);
  });

  it('keeps a surah under every juz it runs through', () => {
    expect(orderInJuz(surahs, [30]).map(s => s.surah)).toEqual(Array.from({ length: 37 }, (_, k) => 78 + k));
    expect(orderInJuz(surahs, [25]).map(s => s.surah)).toEqual([41, 42, 43, 44, 45]);
    expect(orderInJuz(surahs, [27]).map(s => s.surah)).toContain(51);
    expect(orderInJuz(surahs, [26]).map(s => s.surah)).toContain(51);
    expect(orderInJuz(surahs, [])).toBe(surahs);
  });

  it('shows several juz together, each surah once, and a link only after the surah before it', () => {
    const shown = orderInJuz(surahs, [1, 30]);
    expect(shown.map(s => s.surah)).toEqual([1, 2, ...Array.from({ length: 37 }, (_, k) => 78 + k)]);
    // al-Naba' follows al-Baqara here, but its link is to al-Mursalat, which is not shown.
    expect(shown.map((_, i) => linkShows(shown, i)).filter(Boolean)).toHaveLength(1 + 36);
    expect(linkShows(shown, 2)).toBe(false);
    // Juz 26 and 27 share al-Dhariyat: it shows once.
    expect(orderInJuz(surahs, [26, 27]).filter(s => s.surah === 51)).toHaveLength(1);
  });

  it('picks a juz chip, puts it back, and keeps the picks in the mushaf order', () => {
    expect(toggledJuz([30], 1)).toEqual([1, 30]);
    expect(toggledJuz([1, 30], 30)).toEqual([1]);
    expect(toggledJuz([1], 1)).toEqual([]);
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
