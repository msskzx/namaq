import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { ReaderPageData } from '@/lib/quran/readerPage';

const load = (page: number): ReaderPageData => JSON.parse(readFileSync(join(__dirname, 'data', `${page}.json`), 'utf8'));
const pages = Array.from({ length: 604 }, (_, i) => load(i + 1));

describe('reader page data', () => {
  it('holds 604 pages of at most 15 lines', () => {
    for (const data of pages) expect(data.items.filter(item => 'line' in item).length).toBeLessThanOrEqual(15);
  });

  it('numbers the ayat 1, 2, 3 within each surah, 6236 in all', () => {
    const marks = pages.flatMap(data => data.items.flatMap(item => ('line' in item ? item.line.filter((token): token is number => typeof token === 'number') : [])));
    expect(marks).toHaveLength(6236);
    marks.forEach((mark, at) => expect(mark === 1 || mark === marks[at - 1] + 1).toBe(true));
    expect(marks.filter(mark => mark === 1)).toHaveLength(114);
  });

  it('opens 114 surahs, in order', () => {
    const opened = pages.flatMap(data => data.items.flatMap(item => ('surah' in item ? [item.surah] : [])));
    expect(opened).toEqual(Array.from({ length: 114 }, (_, i) => i + 1));
  });
});
