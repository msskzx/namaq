import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { pageGroups, pageOfAyah, type ReaderPageData } from './readerPage';

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
