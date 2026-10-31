import { describe, expect, it } from 'vitest';
import { findText, levels, plainSpelling, searchQuery, spellings, textKeys, wordKeys } from './searchText';

const bare = (word: string) => word.replace(/[ً-ٟ]/g, '');

describe('spellings', () => {
  it('writes the marks as letters people type', () => {
    expect(bare(plainSpelling('صِرَٰطَ'))).toBe('صراط');
    expect(bare(plainSpelling('ٱلصَّلَوٰةَ'))).toBe('ٱلصلاة');
    expect(bare(plainSpelling('ٱلتَّوْرَىٰةَ'))).toBe('ٱلتوراة');
    expect(bare(plainSpelling('مُوسَىٰ'))).toBe('موسى');
    expect(bare(plainSpelling('بِهِۦ'))).toBe('به');
    expect(bare(plainSpelling('دَاوُۥدَ'))).toBe('داوود');
    expect(bare(plainSpelling('ٱلَّيْلِ'))).toBe('ٱلليل');
  });

  it('gives every mix of written and left-out dagger alifs', () => {
    expect(spellings('ٱلسَّمَـٰوَٰتِ').map(bare)).toEqual(['ٱلسموت', 'ٱلسماوت', 'ٱلسموات', 'ٱلسماوات']);
  });
});

describe('findText', () => {
  const words = textKeys('ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ');
  it('matches rasm and normal spellings, mixed in one query', () => {
    expect(findText(words, searchQuery('ذلك الكتاب'))).toEqual({ from: 0, to: 1 });
    expect(findText(words, searchQuery('الكتب لا'))).toEqual({ from: 1, to: 2 });
    expect(findText(textKeys('ٱلسَّمَـٰوَٰتِ'), searchQuery('السموات'))).not.toBeNull();
  });

  it('lets the first query word end a word and the last begin one', () => {
    expect(findText(words, searchQuery('كتاب لا ري'))).toEqual({ from: 1, to: 3 });
    expect(findText(words, searchQuery('كتاب ري'))).toBeNull();
  });

  it('reads the mushaf madda as a long alif, a typed one as hamza and alif', () => {
    expect(findText(textKeys('جَآءَ'), searchQuery('جاء'))).not.toBeNull();
    expect(findText(textKeys('ٱلسَّمَآءِ'), searchQuery('السماء'))).not.toBeNull();
    expect(findText(textKeys('ٱلْقُرْءَانُ'), searchQuery('القرآن'))).not.toBeNull();
  });

  it('matches a hamza written another way only at the loose level', () => {
    const asked = searchQuery('هءلاء');
    expect(findText(textKeys('هَـٰٓؤُلَآءِ'), asked)).toBeNull();
    expect(findText(textKeys('هَـٰٓؤُلَآءِ'), asked, 'loose')).not.toBeNull();
    expect(findText(textKeys('يَسْـَٔلُونَكَ'), searchQuery('يسءلونك'))).not.toBeNull();
    expect(findText(textKeys('جَآءُو'), searchQuery('جاءوا'), 'loose')).not.toBeNull();
  });

  it('tries the loose level only when the folded query keeps two letters', () => {
    expect(levels(searchQuery('ءء'))).toEqual(['strict']);
    expect(levels(searchQuery('هؤلاء'))).toEqual(['strict', 'loose']);
  });

  it('anchors at the start when asked', () => {
    expect(findText(words, searchQuery('الكتاب'), 'strict', true)).toBeNull();
    expect(findText(words, searchQuery('ذال'), 'strict', true)?.from).toBe(0);
  });

  it('joins vocative يا to the next word as the mushaf does', () => {
    expect(findText(textKeys('يَـٰقَوْمِ ٱعْبُدُوا۟'), searchQuery('يا قوم اعبدوا'))).not.toBeNull();
    expect(findText(textKeys('يَـٰٓأَيُّهَا ٱلنَّاسُ'), searchQuery('يا أيها الناس'))).not.toBeNull();
    expect(findText(textKeys('يَـٰهَـٰرُونُ'), searchQuery('يا هارون'))).not.toBeNull();
  });

  it('drops punctuation words from text', () => {
    expect(wordKeys('·').strict).toEqual([]);
    expect(textKeys('الم · المص')).toHaveLength(2);
  });
});
