import { describe, expect, it } from 'vitest';
import data from '@/app/quran/branches/trees.json';
import { type BranchAyah } from '@/lib/quran/branches';
import { type TreeGroup } from '@/lib/quran/phraseTrees';
import { branchNodes, matchTreeAnswers, spelled } from './branchAnswers';
import { branchQuestions } from './branchQuestions';

const all = data.ayat as BranchAyah[];
const trees = data.trees as TreeGroup[];

describe('branchQuestions', () => {
  it('draws questions from the unified tree inventory', () => {
    const questions = branchQuestions(all, null, trees);
    expect(questions.length).toBeGreaterThan(500);
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
    const question = branchQuestions(all, null, trees).find(candidate => candidate.phrase === 'يقيمون الصلوه')!;
    const answers = branchNodes(question.tree).map(node => node.words.map(spelled).join(' '));
    expect(matchTreeAnswers(question.tree, answers).every(answer => answer?.correct)).toBe(true);
  });
});
