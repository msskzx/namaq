import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { ReaderPageData } from './readerPage';
import { JUZ_INDEX, juzGroups, matchesSurah, type IndexSurah } from './juzIndex';

const pages: ReaderPageData[] = Array.from({ length: 604 }, (_, i) =>
  JSON.parse(readFileSync(join(__dirname, '../../app/quran/read/data', `${i + 1}.json`), 'utf8')),
);

const startPage = new Map<string, number>();
const juzLabel = new Map<string, number>();
let surah = 0;
let ayah = 1;
let open = true;
pages.forEach((data, at) => {
  for (const item of data.items) {
    if ('surah' in item) {
      surah = item.surah;
      ayah = 1;
      open = true;
      continue;
    }
    for (const token of item.line) {
      if (typeof token === 'number') {
        ayah = token + 1;
        open = true;
      } else if (open) {
        startPage.set(`${surah}:${ayah}`, at + 1);
        juzLabel.set(`${surah}:${ayah}`, data.juz);
        open = false;
      }
    }
  }
});

const AYAT = [7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6];
const surahs: IndexSurah[] = AYAT.map((numberOfAyat, at) => ({
  number: at + 1,
  name: `سورة ${at + 1}`,
  numberOfAyat,
  page: startPage.get(`${at + 1}:1`) ?? null,
}));

describe('JUZ_INDEX', () => {
  it('names the page each juz begins on in the reader data', () => {
    for (const start of JUZ_INDEX) expect(startPage.get(`${start.surah}:${start.ayah}`), `juz ${start.juz}`).toBe(start.page);
  });

  it('matches the page labels: each start opens the first page labelled with its juz, or sits on the last page of the one before', () => {
    for (const start of JUZ_INDEX.slice(1)) {
      const first = pages.findIndex(data => data.juz === start.juz) + 1;
      expect([first, first - 1], `juz ${start.juz}`).toContain(start.page);
    }
  });
});

describe('juzGroups', () => {
  const groups = juzGroups(surahs);

  it('lists every surah under each juz it has ayat in, covering all 6236 ayat once', () => {
    let covered = 0;
    groups.forEach((group, at) => {
      const next = JUZ_INDEX[at + 1];
      group.entries.forEach(({ surah, from }) => {
        const to = next && next.surah === surah.number ? next.ayah - 1 : surah.numberOfAyat;
        covered += to - from + 1;
      });
    });
    expect(covered).toBe(6236);
    expect(new Set(groups.flatMap(group => group.entries.map(entry => entry.surah.number))).size).toBe(114);
  });

  it('opens a continued surah at the juz page and a new one at its own page', () => {
    expect(groups[1].entries.map(entry => [entry.surah.number, entry.from, entry.page])).toEqual([[2, 142, 22]]);
    expect(groups[2].entries.map(entry => [entry.surah.number, entry.from, entry.page])).toEqual([[2, 253, 42], [3, 1, 50]]);
    expect(groups[29].entries).toHaveLength(37);
    expect(groups[25].entries[0]).toMatchObject({ from: 1, page: 502 });
  });
});

describe('matchesSurah', () => {
  const baqarah: IndexSurah = { number: 2, name: 'سُورَةُ ٱلْبَقَرَةِ', nameTransliterated: 'Al-Baqara', numberOfAyat: 286, page: 2 };

  it('finds a surah by its name without tashkeel, the word سورة or the article', () => {
    for (const query of ['البقرة', 'بقره', 'سورة البقرة', 'ٱلْبَقَرَة']) expect(matchesSurah(baqarah, query), query).toBe(true);
    expect(matchesSurah(baqarah, 'عمران')).toBe(false);
  });

  it('finds a surah by its number in either numeral set, and by transliteration', () => {
    expect(matchesSurah(baqarah, '2')).toBe(true);
    expect(matchesSurah(baqarah, '٢')).toBe(true);
    expect(matchesSurah(baqarah, '20')).toBe(false);
    expect(matchesSurah(baqarah, 'baqara')).toBe(true);
    expect(matchesSurah(baqarah, 'al baq')).toBe(true);
    expect(matchesSurah(baqarah, 'Al-Baqarah')).toBe(true);
    expect(matchesSurah({ ...baqarah, nameTransliterated: 'Aal-i-Imraan' }, 'imran')).toBe(true);
    expect(matchesSurah({ ...baqarah, nameTransliterated: 'Aal-i-Imraan' }, 'Ali Imran')).toBe(true);
    expect(matchesSurah(baqarah, 'imran')).toBe(false);
    const spelled = (nameTransliterated: string, query: string) => matchesSurah({ ...baqarah, nameTransliterated }, query);
    for (const [name, query] of [['An-Naas', 'annas'], ['Yaseen', 'yasin'], ['Nooh', 'nuh'], ['Ad-Dhuhaa', 'duha'], ['Al-Kawthar', 'kauthar'], ['Al-Muddaththir', 'muddathir'], ['Al-Lail', 'layl'], ['Al-Hijr', 'hijr'], ['Al-Haaqqa', 'haqqah']])
      expect(spelled(name, query), `${query} → ${name}`).toBe(true);
    expect(spelled('An-Naas', 'nisa')).toBe(false);
  });

  it('keeps every surah when the query is empty', () => {
    expect(matchesSurah(baqarah, '  ')).toBe(true);
  });
});
