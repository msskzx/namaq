import { describe, expect, it } from 'vitest';
import { leadingWords, matchBranches, matchedWords, matchTreeAnswers, rightWords } from './branchAnswers';

const one = (...branches: string[][]) => branches.map((words) => [words]);
const heavens = one(['ٱلسَّمَـٰوَٰتِ', 'وَٱلْأَرْضَ'], ['ٱلْأَرْضِ', 'جَمِيعًۭا']);
const servants = one(['غِلْمَانٌۭ', 'لَّهُمْ', 'كَأَنَّهُمْ'], ['وِلْدَٰنٌۭ', 'مُّخَلَّدُونَ']);

it('grades ten reordered leaves and keeps given leaves fixed', () => {
  const words = ['واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'];
  const tree = { words: ['قال'], ayat: [], children: words.map((word, index) => ({ words: [word], ayat: [`1:${index + 1}`], children: [] })) };
  expect(matchTreeAnswers(tree, [...words].reverse()).every(match => match?.correct)).toBe(true);
  expect(matchTreeAnswers(tree, [words[0], ...words.slice(1).reverse()], new Set([0])).every(match => match?.correct)).toBe(true);
  expect(matchTreeAnswers(tree, [...words].reverse(), new Set([0]))[0]?.correct).toBe(false);
});

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
      ['أرأيتم', 'أَرَءَيْتُمْ'],
      ['أأسجد', 'ءَأَسْجُدُ'],
      ['يسألونك', 'يَسْـَٔلُونَكَ'],
      ['النبيين', 'ٱلنَّبِيِّـۧنَ'],
      ['إبراهيم', 'إِبْرَٰهِـۧمَ'],
      ['يستوون', 'يَسْتَوُۥنَ'],
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

describe('keyboard spelling variants', () => {
  it('accepts common hamza seat keyboard substitutions without changing other consonants', () => {
    expect(matchedWords('علي كل شي شهيد', ['عَلَىٰ', 'كُلِّ', 'شَىْءٍ', 'شَهِيدٌ'])).toBe(4);
    expect(matchedWords('يوم يذ', ['يَوْمَئِذٍ'])).toBe(1);
    expect(matchedWords('يومنون', ['يُؤْمِنُونَ'])).toBe(1);
    expect(matchedWords('علي كل حي شهيد', ['عَلَىٰ', 'كُلِّ', 'شَىْءٍ', 'شَهِيدٌ'])).toBe(0);
    expect(matchedWords('شهيد', ['شَىْءٍ'])).toBe(0);
  });
});

describe('matchTreeAnswers', () => {
  const prophet = {
    words: ['يَـٰٓأَيُّهَا', 'ٱلنَّبِىُّ'], ayat: [], children: [
      { words: 'لِمَ تُحَرِّمُ مَآ أَحَلَّ ٱللَّهُ لَكَ تَبْتَغِى مَرْضَاتَ أَزْوَٰجِكَ وَٱللَّهُ غَفُورٌۭ رَّحِيمٌۭ'.split(' '), ayat: ['66:1'], children: [] },
      { words: 'جَـٰهِدِ ٱلْكُفَّارَ وَٱلْمُنَـٰفِقِينَ وَٱغْلُظْ عَلَيْهِمْ وَمَأْوَىٰهُمْ جَهَنَّمُ وَبِئْسَ ٱلْمَصِيرُ'.split(' '), ayat: ['66:9'], children: [] },
      { words: ['قُل'], ayat: ['33:28'], children: [] },
    ],
  };
  const results = (typed: string[]) => matchTreeAnswers(prophet, typed).map((hit) => [hit?.node.ayat[0], hit?.correct]);

  it('accepts a leaf from its first two words when every word typed is right', () => {
    expect(results(['لم تحرم', 'جاهد الكفار', 'قل'])).toEqual([['66:1', true], ['66:9', true], ['33:28', true]]);
    expect(results(['لم تحرم ما أحل الله لك تبتغي مرضات ازواجك', 'جاهد الكفار و المنافقين و اغلظ', 'قل'])).toEqual([['66:1', true], ['66:9', true], ['33:28', true]]);
  });

  it('rejects a leaf with a wrong or missing word after the first two', () => {
    expect(results(['لم تحرم ما أحل الله لك تبتغي ممرضات', 'جاهد الكفار و اغلظ', 'قل لهم'])).toEqual([['66:1', false], ['66:9', false], ['33:28', false]]);
  });

  it('rejects a leaf with fewer than two correct opening words', () => {
    expect(results(['لم', 'جاهد الكافرين', 'قال'])).toEqual([['66:1', false], ['66:9', false], ['33:28', false]]);
  });

  it('shows each answer beside the leaf it starts like, even when it is wrong', () => {
    expect(results(['جاهد', 'لم', ''])).toEqual([['66:9', false], ['66:1', false], ['33:28', false]]);
  });

  it('still requires every word at a node that splits again', () => {
    const tree = { words: ['يَطُوفُ', 'عَلَيْهِمْ'], ayat: [], children: [
      { words: ['غِلْمَانٌ', 'لَهُمْ'], ayat: ['52:24'], children: [] },
      { words: ['وِلْدَانٌ', 'مُخَلَّدُونَ'], ayat: [], children: [
        { words: ['بِأَكْوَابٍ'], ayat: ['56:17'], children: [] },
        { words: ['إِذَا', 'رَأَيْتَهُمْ'], ayat: ['76:19'], children: [] },
      ] },
    ] };
    expect(matchTreeAnswers(tree, ['غلمان لهم', 'ولدان', 'بأكواب', 'إذا رأيتهم']).map((hit) => hit?.correct)).toEqual([true, false, true, true]);
    expect(matchTreeAnswers(tree, ['غلمان لهم', 'ولدان مخلدون', 'بأكواب', 'إذا رأيتهم']).every((hit) => hit?.correct)).toBe(true);
  });
});

describe('leadingWords', () => {
  it('counts the words an answer gets right from the start, up to its first mistake', () => {
    const words = 'لِمَ تُحَرِّمُ مَآ أَحَلَّ ٱللَّهُ'.split(' ');
    expect(leadingWords('لم تحرم ما احل الله', words)).toBe(5);
    expect(leadingWords('لم تحرم ما احل الرب', words)).toBe(4);
    expect(leadingWords('لن تحرم', words)).toBe(0);
    expect(leadingWords('', words)).toBe(0);
  });
});

describe('rightWords', () => {
  const words = ['مِّنَ', 'ٱلْأَنۢبَآءِ', 'مَا', 'فِيهِ'];
  it('counts the typed words that are right from the start', () => {
    expect(rightWords('من الانباء ما', words)).toBe(3);
    expect(rightWords('من الاخبار', words)).toBe(1);
    expect(rightWords('الاخبار من', words)).toBe(0);
    expect(rightWords('', words)).toBe(0);
  });
});
