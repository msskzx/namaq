import { describe, expect, it } from 'vitest';
import { ayahSlice, pageTop, pageEnd } from './ayahSlice';
import { pageGroups, type MushafPage } from './readerPage';
import page293 from '../data/quran/mushaf/293.json';
import page294 from '../data/quran/mushaf/294.json';

const slice = (data: MushafPage, key: string, top?: number) => ayahSlice(pageGroups(data.items, top), data.items, key);

describe('the rows that show an ayah with what comes before it', () => {
  it('shows two lines of the ayah before, then every line of the ayah', () => {
    // al-Kahf 10 runs over lines 6 and 7 of page 294; al-Kahf 9 starts at the end of line 4.
    expect(slice(page294 as MushafPage, '18:10', 18)).toEqual({ from: 4, to: 7, before: false });
  });

  it('starts where the ayah before starts when that is nearer', () => {
    // al-Kahf 8 is all on line 4, where al-Kahf 9 starts.
    expect(slice(page294 as MushafPage, '18:9', 18)).toEqual({ from: 4, to: 5, before: false });
  });

  it('shows a surah title and basmala above its first ayah', () => {
    expect(slice(page293 as MushafPage, '18:1', 17)).toEqual({ from: 9, to: 11, before: false });
  });

  it('says when the ayah before is on the previous page, whose last lines go above', () => {
    expect(slice(page294 as MushafPage, '18:5', 18)).toEqual({ from: 0, to: 1, before: true });
    expect(pageEnd((page293 as MushafPage).items)).toEqual({ from: 13, to: 14 });
  });

  it('finds no rows for an ayah not on the page', () => {
    expect(slice(page294 as MushafPage, '2:255', 18)).toBeNull();
  });
});

describe('a page\'s first rows', () => {
  it('are three ayah lines, with the titles among them', () => {
    const items = [{ title: 1 }, { line: 1 }, { line: 2 }, { line: 3 }, { line: 4 }] as never[];
    expect(pageTop(items)).toEqual({ from: 0, to: 3 });
    expect(pageTop([{ line: 1 }, { line: 2 }, { line: 3 }, { line: 4 }] as never[])).toEqual({ from: 0, to: 2 });
    expect(pageTop([{ title: 1 }, { line: 1 }] as never[])).toEqual({ from: 0, to: 1 });
  });
});
