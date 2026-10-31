import { describe, expect, it } from 'vitest';
import { findText, plainSpelling, searchQuery, textKeys, wordKeys } from './searchText';

describe('plainSpelling', () => {
  it('writes the marks as letters people type', () => {
    expect(plainSpelling('صِرَٰطَ').replace(/[ً-ٟ]/g, '')).toBe('صراط');
    expect(plainSpelling('ٱلصَّلَوٰةَ').replace(/[ً-ٟ]/g, '')).toBe('ٱلصلاة');
    expect(plainSpelling('ٱلتَّوْرَىٰةَ').replace(/[ً-ٟ]/g, '')).toBe('ٱلتوراة');
    expect(plainSpelling('مُوسَىٰ').replace(/[ً-ٟ]/g, '')).toBe('موسى');
    expect(plainSpelling('بِهِۦ').replace(/[ً-ٟ]/g, '')).toBe('به');
    expect(plainSpelling('دَاوُۥدَ').replace(/[ً-ٟ]/g, '')).toBe('داوود');
    expect(plainSpelling('ٱلَّيْلِ').replace(/[ً-ٟ]/g, '')).toBe('ٱلليل');
  });
});

describe('findText', () => {
  const words = textKeys('ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ');
  it('matches rasm and normal spellings, mixed in one query', () => {
    expect(findText(words, searchQuery('ذلك الكتاب'))).toEqual({ from: 0, to: 1, strict: true });
    expect(findText(words, searchQuery('الكتب لا'))).toEqual({ from: 1, to: 2, strict: true });
  });
  it('lets the first query word end a word and the last begin one', () => {
    expect(findText(words, searchQuery('كتاب لا ري'))).toEqual({ from: 1, to: 3, strict: true });
    expect(findText(words, searchQuery('كتاب ري'))).toBeNull();
  });
  it('falls back to any hamza, flagged loose', () => {
    expect(findText(textKeys('يَسْـَٔلُونَكَ'), searchQuery('يسألونك'))?.strict).toBe(false);
    expect(findText(textKeys('يَسْـَٔلُونَكَ'), searchQuery('يسءلونك'))?.strict).toBe(true);
    expect(findText(textKeys('هَـٰٓؤُلَآءِ'), searchQuery('هءلاء'))?.strict).toBe(false);
    expect(findText(textKeys('جَآءُو'), searchQuery('جاءوا'))?.strict).toBe(false);
  });
  it('anchors at the start when asked', () => {
    expect(findText(words, searchQuery('الكتاب'), true)).toBeNull();
    expect(findText(words, searchQuery('ذال'), true)?.from).toBe(0);
  });
  it('joins vocative يا to the next word as the mushaf does', () => {
    expect(findText(textKeys('يَـٰقَوْمِ ٱعْبُدُوا۟'), searchQuery('يا قوم اعبدوا'))?.strict).toBe(true);
    expect(findText(textKeys('يَـٰٓأَيُّهَا ٱلنَّاسُ'), searchQuery('يا أيها الناس'))?.strict).toBe(true);
  });
  it('drops punctuation words from text', () => {
    expect(wordKeys('·').strict).toEqual([]);
    expect(textKeys('الم · المص')).toHaveLength(2);
  });
});
