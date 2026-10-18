import { describe, expect, it } from 'vitest';
import { matchBranches } from './branchAnswers';

const heavens = [['ٱلسَّمَـٰوَٰتِ', 'وَٱلْأَرْضَ'], ['ٱلْأَرْضِ', 'جَمِيعًۭا']];
const servants = [['غِلْمَانٌۭ', 'لَّهُمْ', 'كَأَنَّهُمْ'], ['وِلْدَٰنٌۭ', 'مُّخَلَّدُونَ']];

describe('matchBranches', () => {
  it('accepts the usual spelling for a word written in the Quran rasm', () => {
    expect(matchBranches(['السماوات', 'الأرض'], heavens)).toEqual([{ branch: 0, words: 1 }, { branch: 1, words: 1 }]);
    expect(matchBranches(['ولدان', 'غلمان'], servants)).toEqual([{ branch: 1, words: 1 }, { branch: 0, words: 1 }]);
  });

  it('accepts more than one word when they follow the branch in order', () => {
    expect(matchBranches(['غلمان لهم', 'ولدان مخلدون'], servants)).toEqual([{ branch: 0, words: 2 }, { branch: 1, words: 2 }]);
    expect(matchBranches(['غلمان مخلدون', 'ولدان'], servants)).toEqual([null, { branch: 1, words: 1 }]);
  });

  it('rejects a part of a word, a wrong word and the same branch twice', () => {
    expect(matchBranches(['غل', 'ولد'], servants)).toEqual([null, null]);
    expect(matchBranches(['أطفال', ''], servants)).toEqual([null, null]);
    expect(matchBranches(['غلمان', 'غلمان'], servants).filter(Boolean)).toHaveLength(1);
  });

  it('reads hamza seats and the waw of salat loosely', () => {
    expect(matchBranches(['آمنوا', 'الصلاة'], [['ءَامَنُوا۟'], ['ٱلصَّلَوٰةَ']])).toEqual([{ branch: 0, words: 1 }, { branch: 1, words: 1 }]);
    expect(matchBranches(['شيئا'], [['شَيْـًۭٔا'], ['أَحَدًا']])).toEqual([{ branch: 0, words: 1 }]);
  });

  it('gives a typed word to the branch it spells exactly before one it only resembles', () => {
    expect(matchBranches(['قيل', 'قال'], [['قَالَ'], ['قِيلَ']])).toEqual([{ branch: 1, words: 1 }, { branch: 0, words: 1 }]);
  });
});
