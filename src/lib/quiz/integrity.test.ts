import { describe, expect, it } from 'vitest';
import data from '@shared/data/quran/trees.json';
import { type BranchAyah } from '@shared/quran/branches';
import { type TreeGroup } from '@shared/quran/phraseTrees';
import { branchQuestions } from './branchQuestions';
import { checkRebuilt, rebuildTreeAnswers, rebuildTreeAyat } from './integrity';

const all = data.ayat as BranchAyah[];
const questions = branchQuestions(all, null, data.trees as TreeGroup[]);

describe('quiz text integrity: question + answer = the Quran text', () => {
  it('rebuilds every ayah of every tree question exactly, through the ayat a branch runs into', () => {
    expect(questions.length).toBeGreaterThan(1000);
    expect(questions.flatMap(question => checkRebuilt(question.key, rebuildTreeAyat(question), all))).toEqual([]);
  });

  it('grades against answers that complete their ayah exactly', () => {
    expect(questions.flatMap(question => checkRebuilt(question.key, rebuildTreeAnswers(question), all))).toEqual([]);
  });

  it('places every ayah a question names in its tree', () => {
    const missing = questions.flatMap(question => {
      const rebuilt = new Set(rebuildTreeAyat(question).map(entry => entry.key));
      return question.branches.flatMap(branch => branch.ayat.map(ayah => ayah.key)).filter(key => !rebuilt.has(key)).map(key => `${question.key} ${key}`);
    });
    expect(missing).toEqual([]);
  });

  it('catches dropped words, changed marks, cut-short text and misplaced ayah marks', () => {
    const ayat: BranchAyah[] = [{ key: '112:1', page: 1, words: ['قُلْ', 'هُوَ', 'ٱللَّهُ', 'أَحَدٌ'] }, { key: '112:2', page: 1, words: ['ٱللَّهُ', 'ٱلصَّمَدُ'] }];
    const check = (text: string) => checkRebuilt('test', [{ key: '112:1', words: text.split(' ') }], ayat).map(error => error.problem);
    expect(check('قُلْ هُوَ ٱللَّهُ أَحَدٌ')).toEqual([]);
    expect(check('قُلْ هُوَ ٱللَّهُ أَحَدٌ ﴿١﴾ ٱللَّهُ ٱلصَّمَدُ')).toEqual([]);
    expect(check('قُلْ ٱللَّهُ أَحَدٌ')).toEqual(['text differs']);
    expect(check('قُلْ هُوَ ٱللَّهَ أَحَدٌ')).toEqual(['text differs']);
    expect(check('قُلْ هُوَ ٱللَّهُ')).toEqual(['text differs']);
    expect(check('قُلْ هُوَ ٱللَّهُ أَحَدٌ ٱللَّهُ')).toEqual(['text differs']);
    expect(check('قُلْ هُوَ ٱللَّهُ أَحَدٌ ﴿١﴾ ٱللَّهُ')).toEqual(['text differs']);
    expect(check('قُلْ هُوَ ٱللَّهُ أَحَدٌ ﴿٢﴾ ٱللَّهُ ٱلصَّمَدُ')).toEqual(['wrong ayah number']);
    expect(check('قُلْ هُوَ ﴿١﴾ ٱللَّهُ أَحَدٌ')).toEqual(['text differs']);
    expect(check('قُلْ  هُوَ ٱللَّهُ أَحَدٌ')).toEqual(['empty word']);
  });
});
