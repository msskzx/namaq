import { describe, expect, it } from 'vitest';
import data from '@shared/data/quran/trees.json';
import example from '@shared/data/quiz/example.json';
import { type BranchAyah } from '@shared/quran/branches';
import { type TreeGroup } from '@shared/quran/phraseTrees';
import { branchNodes, matchTreeAnswers, spelled } from './branchAnswers';
import { gradedTree } from './feedback';
import { biggerFirst, branchQuestionPool, branchQuestions, branchQuiz } from './branchQuestions';
import { quizTrees } from './treeScope';

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

  it('keeps the explainer example tree the same as the إن المتقين tree built from the data', () => {
    const question = branchQuestions(all, null, trees.filter(tree => tree.id === 'ان المتقين في'))[0];
    expect(example.key).toBe(question.key);
    expect(example.tree).toEqual(question.tree);
  });

  it('forgives typing لما again before قالوا under ثم يعودون لما', () => {
    const question = branchQuestions(all, null, trees.filter(tree => tree.id === 'ثم يعودون لما'))[0];
    const nodes = branchNodes(question.tree);
    const typed = nodes.map(node => node.ayat.includes('58:3') ? 'لما قالوا فتحرير رقبه' : node.words.join(' '));
    expect(question.tree.words.at(-1)).toBe('لِمَا');
    expect(matchTreeAnswers(question.tree, typed).every(hit => hit?.correct)).toBe(true);
    expect(gradedTree({ ...question, asked: nodes.map((_, index) => index) }, typed).rows.every(row => row.correct)).toBe(true);
  });

  it('asks the متشابهات of the branches page, not its word trees', () => {
    const asked = new Set(branchQuestions(all, null, quizTrees()).map(question => question.phrase));
    expect(asked.size).toBeGreaterThan(100);
  });

  it('puts trees with at least as many leaves as asked first, then the biggest of the rest', () => {
    expect(biggerFirst([2, 5, 1, 4, 3], 4, size => size)).toEqual([5, 4, 3, 2, 1]);
    expect(biggerFirst([2, 5, 1, 4, 3], 1, size => size)).toEqual([2, 5, 1, 4, 3]);
  });

  it('narrows the trees with the branches filters and saved trees', () => {
    const yasin = quizTrees(null, { filters: { surahs: '36' } });
    expect(yasin.length).toBeGreaterThan(0);
    expect(yasin.every(tree => tree.occurrences.some(occurrence => occurrence.key.startsWith('36:')))).toBe(true);
    expect(quizTrees(null, { saved: [] })).toEqual([]);
    expect(quizTrees(null, { saved: [yasin[0].id] }).map(tree => tree.id)).toEqual([yasin[0].id]);
  });

  it('asks the one tree the branches page shows where it holds smaller trees', () => {
    const places = (tree: TreeGroup) => [...new Set(tree.occurrences.map(occurrence => occurrence.key))].sort().join(',');
    const holding = quizTrees().filter(tree => tree.occurrences.some(occurrence => occurrence.key === '18:37') && tree.occurrences.some(occurrence => occurrence.key === '40:67'));
    expect(holding.map(places)).toEqual(['18:37,22:5,35:11,40:67']);
    expect(quizTrees().filter(tree => places(tree) === '22:5,40:67' && tree.text.startsWith('طِفْلًۭا'))).toEqual([]);
    // A tree saved under its smaller tree's id is still asked, as the bigger tree.
    expect(quizTrees(null, { saved: ['cmp:1s03nru1ozf8pk'] }).map(places)).toEqual(['18:37,22:5,35:11,40:67']);
  });
});
