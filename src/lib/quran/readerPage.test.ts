import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { mushafPages, pageGroups, pageOfAyah, spreadOf, turn, type MushafPage, type ReaderPageData } from './readerPage';

const load = async (page: number): Promise<ReaderPageData> =>
  JSON.parse(readFileSync(join(__dirname, '../../app/quran/read/data', `${page}.json`), 'utf8'));

describe('pageOfAyah', () => {
  it('finds the page an ayah starts on, scanning from the surah page', async () => {
    await expect(pageOfAyah(1, 1, 1, load)).resolves.toBe(1);
    await expect(pageOfAyah(2, 1, 2, load)).resolves.toBe(2);
    await expect(pageOfAyah(2, 142, 2, load)).resolves.toBe(22);
    await expect(pageOfAyah(2, 255, 2, load)).resolves.toBe(42);
    await expect(pageOfAyah(18, 1, 293, load)).resolves.toBe(293);
    await expect(pageOfAyah(114, 6, 604, load)).resolves.toBe(604);
  });

  it('finds pages in the mushaf layout, stepping over basmala rows', async () => {
    const mushaf = async (page: number): Promise<MushafPage> => JSON.parse(readFileSync(join(__dirname, '../../app/quran/read/mushaf', `${page}.json`), 'utf8'));
    await expect(pageOfAyah(23, 1, 342, mushaf)).resolves.toBe(342);
    await expect(pageOfAyah(43, 59, 489, mushaf)).resolves.toBe(493);
    await expect(pageOfAyah(5, 78, 106, mushaf)).resolves.toBe(121);
  });

  it('gives no page for an ayah past the end of its surah', async () => {
    await expect(pageOfAyah(1, 8, 1, load)).resolves.toBeNull();
    await expect(pageOfAyah(113, 6, 604, load)).resolves.toBeNull();
  });
});

describe('pageGroups', () => {
  const keys = (lines: ReturnType<typeof pageGroups>) => lines.map(line => line?.map(group => `${group.surah}:${group.ayah}`) ?? null);

  it('gives each word the ayah whose end mark follows it, across lines and surahs', () => {
    const lines = pageGroups(
      [{ line: ['a', 'b', 6, 'c'] }, { line: ['d', 7] }, { surah: 3 }, { line: ['e', 1, 'f'] }],
      2,
    );
    expect(keys(lines)).toEqual([['2:6', '2:6', '2:7'], ['2:7'], null, ['3:1', '3:2']]);
  });

  it('keeps a line that opens with an end mark on the ayah it closes', () => {
    expect(keys(pageGroups([{ line: [30, 'x', 31] }], 2))).toEqual([['2:30', '2:31']]);
  });

  it('marks the real page: Ayat al-Kursi starts and ends on page 42', async () => {
    const lines = pageGroups((await load(42)).items, 2);
    const words = lines.flatMap(line => line ?? []).filter(group => group.ayah === 255);
    expect(words.length).toBeGreaterThan(40);
    expect(words.at(-1)?.marks).toEqual([255]);
  });
});

describe('spreadOf and turn', () => {
  it('pairs each page with its facing page, the odd one first', () => {
    expect(spreadOf(1)).toEqual([1, 2]);
    expect(spreadOf(342)).toEqual([341, 342]);
    expect(spreadOf(603)).toEqual([603, 604]);
  });

  it('turns one page or one spread, staying within the mushaf', () => {
    expect(turn(341, false, 1)).toBe(342);
    expect(turn(342, true, 1)).toBe(343);
    expect(turn(342, true, -1)).toBe(339);
    expect(turn(1, true, -1)).toBe(1);
    expect(turn(604, false, 1)).toBe(604);
  });
});

describe('mushafPages', () => {
  const pages: MushafPage[] = Array.from({ length: 604 }, (_, i) => JSON.parse(readFileSync(join(__dirname, '../../app/quran/read/mushaf', `${i + 1}.json`), 'utf8')));
  const starts = mushafPages(pages);

  it('gives every ayah the 1441 page its first word is on', () => {
    expect(starts.size).toBe(6236);
    expect(starts.get('1:1')).toBe(1);
    expect(starts.get('2:1')).toBe(2);
    expect(starts.get('43:59')).toBe(493);
    expect(starts.get('94:5')).toBe(597);
    expect(starts.get('114:1')).toBe(604);
  });

  it('moves the ayat the 1441 edition placed on another page', () => {
    expect(starts.get('5:77')).toBe(120);
    expect(starts.get('98:6')).toBe(599);
  });
});
