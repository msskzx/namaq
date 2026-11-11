import { describe, expect, it } from 'vitest';
import data from '@shared/data/quran/trees.json';
import example from '@shared/data/quiz/example.json';
import { type BranchAyah } from '@shared/quran/branches';
import { type TreeGroup } from '@shared/quran/phraseTrees';
import { branchNodes, matchTreeAnswers, spelled } from './branchAnswers';
import { branchQuestionPool, branchQuestions, branchQuiz } from './branchQuestions';

const all = data.ayat as BranchAyah[];
const trees = data.trees as TreeGroup[];

describe('branchQuestions', () => {
  it('preserves the beginnings before الإنسان ما', () => {
    const question = branchQuestions(all, null, trees.filter(tree => tree.id === 'الانسن ما'))[0];
    expect(question).toBeDefined();
    for (const key of ['79:35', '80:17', '82:6', '96:5', '99:3']) {
      const prefix = question.prefixes.find(prefix => prefix.keys.includes(key))!;
      const ayah = all.find(ayah => ayah.key === key)!;
      expect(prefix.word).toBe(ayah.words.slice(0, ayah.words.findIndex(word => word.includes('إِنسَ'))).join(' '));
    }
  });

  it.each([2, 3, 7, 10, 11])('accepts two to ten branches: %i', count => {
    const endings = ['واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة', 'أحد'];
    const ayat: BranchAyah[] = Array.from({ length: count }, (_, index) => ({ key: `1:${index + 1}`, page: 1, words: ['قال', 'رب', endings[index]] }));
    const questions = branchQuestions(ayat, null, [{ id: 'قال رب', text: 'قال رب', occurrences: ayat.map(ayah => ({ key: ayah.key, start: 0, end: 2 })) }]);
    expect(questions.some(question => question.tree.children.length === count)).toBe(count <= 10);
  });

  it('starts answers after the shared trunk when first-word conjunctions differ', () => {
    const ayat: BranchAyah[] = Array.from({ length: 5 }, (_, index) => ({
      key: `1:${index + 1}`, page: 1,
      words: [index % 2 ? 'وقال' : 'قال', 'رب', index < 2 ? 'اغفر' : 'ارحم', `عبدك${index}`],
      roots: ['qwl', 'rbb', index < 2 ? 'gfr' : 'rHm', 'Ebd'],
      lemmas: ['qAl', 'rbb', index < 2 ? 'gfr' : 'rHm', 'Ebd'],
      conjs: [index % 2 ? 'و' : null, null, null, null],
    }));
    const question = branchQuestions(ayat).find(candidate => candidate.phrase === 'قال رب')!;
    expect(question.tree.words).toEqual(['رب']);
    expect(question.branches.map(branch => branch.ayat.map(ayah => ayah.words[0]))).toEqual([['اغفر', 'اغفر'], ['ارحم', 'ارحم', 'ارحم']]);
  });
  it('draws questions from the unified tree inventory', () => {
    const questions = branchQuestions(all, null, trees);
    expect(questions.length).toBeGreaterThan(0);
    expect(new Set(questions.map(question => question.key)).size).toBe(questions.length);
    expect(questions.every(question => question.phrase && question.tree.children.length >= 2)).toBe(true);
    expect(questions.some(question => question.phrase === 'يقيمون الصلوه')).toBe(true);
  });

  it('restricts questions to the selected juz range', () => {
    const late = branchQuestions(all, { from: 29, to: 30 }, trees);
    expect(late.length).toBeGreaterThan(0);
    expect(late.every(question => branchNodes(question.tree).flatMap(node => node.ayat).every(key => Number(key.split(':')[0]) >= 67))).toBe(true);
  });

  it('keeps answers compatible with the tree grader', () => {
    const question = branchQuestions(all, null, trees.filter(tree => tree.id === 'يقيمون الصلوه'))[0];
    const answers = branchNodes(question.tree).map(node => node.words.map(spelled).join(' '));
    expect(matchTreeAnswers(question.tree, answers).every(answer => answer?.correct)).toBe(true);
  });
});

describe('branchQuiz (the phone app builds its quiz on the device)', () => {
  const seeded = (seed: number) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const late = { from: 29, to: 30 };
  const valid = new Map(branchQuestions(all, late, trees).map(question => [question.key, question]));

  it('asks only trees the website could ask for the same juz, each once, with the chosen number of leaves to type', () => {
    const quiz = branchQuiz(branchQuestionPool(all, late, trees), 10, 3, seeded(7));
    expect(quiz).toHaveLength(10);
    expect(new Set(quiz.map(question => question.key)).size).toBe(10);
    for (const question of quiz) {
      expect(question).toMatchObject({ ...valid.get(question.key), asked: question.asked });
      const leaves = branchNodes(question.tree).filter(node => node.children.length === 0).length;
      expect(question.asked).toHaveLength(Math.min(3, leaves));
      expect(question.asked.every(index => branchNodes(question.tree)[index].children.length === 0)).toBe(true);
    }
  });

  it('stops at the trees there are when the juz range has fewer than asked', () => {
    const tiny: BranchAyah[] = [1, 2, 3].map(n => ({ key: `1:${n}`, page: 1, words: ['قال', 'رب', ['اغفر', 'ارحم', 'اهد'][n - 1]] }));
    expect(branchQuiz(branchQuestionPool(tiny), 5, 3, seeded(1))).toHaveLength(1);
  });

  it('keeps the explainer example tree the same as the إن المتقين question in the pool', () => {
    const question = branchQuestions(all, null, trees.filter(tree => tree.id === 'ان المتقين في'))[0];
    expect(example.key).toBe(question.key);
    expect(example.tree).toEqual(question.tree);
  });
});
