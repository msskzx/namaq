import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { MushafPage, ReaderPageData } from '@/lib/quran/readerPage';

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

  it('carries the sajda sign once in each of the 15 places', () => {
    const words = pages.flatMap(data => data.items.flatMap(item => ('line' in item ? item.line : [])));
    expect(words.filter(token => typeof token === 'string' && token.includes('۩'))).toHaveLength(15);
    expect(words.filter(token => token === '۩')).toHaveLength(0);
  });
});

const mushaf = Array.from({ length: 604 }, (_, i): MushafPage => JSON.parse(readFileSync(join(__dirname, 'mushaf', `${i + 1}.json`), 'utf8')));
const lineTokens = (data: MushafPage) => data.items.flatMap(item => ('line' in item ? item.line : []));

describe('mushaf page data', () => {
  it('fills every page after the two opening ones with 15 rows of lines, surah titles and basmalas', () => {
    expect(mushaf.slice(0, 2).map(data => data.items.length)).toEqual([8, 8]);
    for (const data of mushaf.slice(2)) expect(data.items).toHaveLength(15);
  });

  it('numbers the ayat 1, 2, 3 within each surah, 6236 in all, and opens 114 surahs in order', () => {
    const marks = mushaf.flatMap(data => lineTokens(data).filter((token): token is number => typeof token === 'number'));
    expect(marks).toHaveLength(6236);
    marks.forEach((mark, at) => expect(mark === 1 || mark === marks[at - 1] + 1).toBe(true));
    expect(mushaf.flatMap(data => data.items.flatMap(item => ('surah' in item ? [item.surah] : [])))).toEqual(Array.from({ length: 114 }, (_, i) => i + 1));
  });

  it('never starts a line with an ayah number', () => {
    for (const data of mushaf) for (const item of data.items) if ('line' in item) expect(typeof item.line[0]).toBe('string');
  });

  it('ends 43:59 on its own line of page 493, as the printed mushaf does', () => {
    const lines = mushaf[492].items.flatMap(item => ('line' in item ? [item.line] : []));
    expect(lines.at(-2)?.at(-1)).toBe(59);
    expect(lines.at(-2)?.at(-2)).toBe('إِسۡرَٰٓءِيلَ');
  });

  it('gives a basmala to every surah but the first and At-Tawbah', () => {
    const rows = mushaf.flatMap(data => data.items);
    rows.forEach((item, at) => {
      if ('surah' in item) expect('basmala' in rows[at + 1]).toBe(item.surah !== 1 && item.surah !== 9);
    });
  });

  it('opens the 240 hizb quarters in order, heading each page with the juz it ends in', () => {
    const quarters = mushaf.flatMap(data => data.items.flatMap(item => ('quarter' in item && item.quarter ? [item.quarter] : [])));
    expect(quarters).toEqual(Array.from({ length: 240 }, (_, i) => i + 1));
    const juzPages = [1, 22, 42, 62, 82, 102, 121, 142, 162, 182, 201, 222, 242, 262, 282, 302, 322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582];
    expect(juzPages.map(page => mushaf[page - 1].juz)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
    expect(juzPages.slice(1).map(page => mushaf[page - 2].juz)).toEqual(Array.from({ length: 29 }, (_, i) => i + 1));
  });

  it('carries the sajda sign on a word in each of the 15 places', () => {
    expect(mushaf.flatMap(lineTokens).filter(token => typeof token === 'string' && token.includes('۩'))).toHaveLength(15);
  });
});
