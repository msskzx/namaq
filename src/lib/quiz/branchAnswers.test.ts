import { describe, expect, it } from 'vitest';
import { matchBranches, matchedWords } from './branchAnswers';

const one = (...branches: string[][]) => branches.map((words) => [words]);
const heavens = one(['ٱلسَّمَـٰوَٰتِ', 'وَٱلْأَرْضَ'], ['ٱلْأَرْضِ', 'جَمِيعًۭا']);
const servants = one(['غِلْمَانٌۭ', 'لَّهُمْ', 'كَأَنَّهُمْ'], ['وِلْدَٰنٌۭ', 'مُّخَلَّدُونَ']);

describe('matchedWords', () => {
  it('accepts the usual spelling of a word written in the Quran rasm', () => {
    const pairs: [string, string][] = [
      ['السماوات', 'ٱلسَّمَـٰوَٰتِ'],
      ['الكتاب', 'ٱلْكِتَـٰبَ'],
      ['هذا', 'هَـٰذَا'],
      ['ذلك', 'ذَٰلِكَ'],
      ['إله', 'إِلَـٰهَ'],
      ['الصلاة', 'ٱلصَّلَوٰةَ'],
      ['الحياة', 'ٱلْحَيَوٰةِ'],
      ['الربا', 'ٱلرِّبَوٰا۟'],
      ['موسى', 'مُوسَىٰ'],
      ['التوراة', 'ٱلتَّوْرَىٰةَ'],
      ['شيئا', 'شَيْـًۭٔا'],
      ['آمنوا', 'ءَامَنُوا۟'],
      ['امنوا', 'ءَامَنُوا۟'],
      ['الملائكة', 'ٱلْمَلَـٰٓئِكَةِ'],
      ['له', 'لَهُۥ'],
    ];
    for (const [typed, rasm] of pairs) expect(matchedWords(typed, [rasm]), typed).toBe(1);
  });

  it('rejects a different word with the same consonants', () => {
    const pairs: [string, string][] = [
      ['قال', 'قُلْ'],
      ['قل', 'قَالَ'],
      ['لا', 'إِلَىٰ'],
      ['ما', 'يَوْمَ'],
      ['و', 'أَوْ'],
      ['ل', 'لَا'],
    ];
    for (const [typed, rasm] of pairs) expect(matchedWords(typed, [rasm]), typed).toBe(0);
  });

  it('counts the words typed and ignores spaces inside an answer', () => {
    expect(matchedWords('برب المشارق والمغارب', ['بِرَبِّ', 'ٱلْمَشَـٰرِقِ', 'وَٱلْمَغَـٰرِبِ', 'إِنَّا'])).toBe(3);
    expect(matchedWords('يا أيها', ['يَـٰٓأَيُّهَا', 'ٱلَّذِينَ'])).toBe(1);
    expect(matchedWords('غل', ['غِلْمَانٌۭ'])).toBe(0);
  });
});

describe('matchBranches', () => {
  it('pairs answers with branches in any order', () => {
    expect(matchBranches(['السماوات', 'الأرض'], heavens)).toEqual([{ branch: 0, words: 1 }, { branch: 1, words: 1 }]);
    expect(matchBranches(['ولدان مخلدون', 'غلمان'], servants)).toEqual([{ branch: 1, words: 2 }, { branch: 0, words: 1 }]);
    expect(matchBranches(['غلمان مخلدون', 'ولدان'], servants)).toEqual([null, { branch: 1, words: 1 }]);
  });

  it('gives one branch to one answer only', () => {
    expect(matchBranches(['غلمان', 'غلمان'], servants).filter(Boolean)).toHaveLength(1);
  });

  it('follows an answer past the next fork into any ayah of the branch', () => {
    expect(matchBranches(['لا تقاتلون', 'ألا'], [[['لَا', 'تُقَـٰتِلُونَ'], ['لَا', 'تُؤْمِنُونَ']], [['أَلَّا', 'تَأْكُلُوا۟']]])).toEqual([{ branch: 0, words: 2 }, { branch: 1, words: 1 }]);
  });
});
