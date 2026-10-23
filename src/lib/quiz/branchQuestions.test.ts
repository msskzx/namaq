import { describe, expect, it } from 'vitest';
import ayat from '@/app/quran/branches/ayat.json';
import { PIECE_MAX, type BranchAyah } from '@/lib/quran/branches';
import { normalizeWord } from '@/lib/quran/normalize';
import { branchQuestions } from './branchQuestions';
import { branchNodes, matchTreeAnswers, spelled } from './branchAnswers';

const all = ayat as BranchAyah[];
const questions = branchQuestions(all);
const late = branchQuestions(all, { from: 29, to: 30 });
const asked = (list: typeof questions, key: string) => list.find((question) => question.branches.some((branch) => branch.ayat.some((ayah) => ayah.key === key)));
const keysOf = (question: (typeof questions)[number] | undefined) => question?.branches.map((branch) => branch.ayat.map((ayah) => ayah.key));

describe('branchQuestions', () => {
  it('preserves the complete explorer tree, including the second split and terminal leaves', () => {
    const question = asked(questions, '52:24')!;
    const nodes = branchNodes(question.tree);
    expect(nodes.length).toBeGreaterThan(question.branches.length);
    expect(nodes.flatMap(node => node.ayat).sort()).toEqual(['52:24', '56:17', '76:19']);
    const answers = nodes.map(node => node.words.map(spelled).join(' '));
    expect(matchTreeAnswers(question.tree, answers).every(hit => hit?.correct)).toBe(true);
    expect(matchTreeAnswers(question.tree, answers.slice(0, 2)).every(hit => hit?.correct)).toBe(false);
    expect(question.promptArabic).toContain('تكفي كلمتاه الأوليان');
  });

  it('asks يطوف عليهم with both of its spellings in the prompt', () => {
    const question = asked(questions, '52:24');
    expect(question?.promptArabic).toContain('«وَيَطُوفُ عَلَيْهِمْ» أو «يَطُوفُ عَلَيْهِمْ» إلى فرعين');
    expect(question?.branches.map((branch) => branch.words[0])).toEqual(['غِلْمَانٌۭ', 'وِلْدَٰنٌۭ']);
    expect(keysOf(question)).toEqual([['52:24'], ['56:17', '76:19']]);
    expect(question?.branches[0].ayat[0].page).toBe(524);
    expect(question?.branches[0].ayat[0].words.slice(0, 2).map(normalizeWord)).toEqual(['غلمان', 'لهم']);
  });

  it('asks only for the branches inside the chosen juz', () => {
    const question = asked(late, '69:38');
    expect(question?.promptArabic).toContain('إلى أربعة فروع');
    expect(question?.phrase).toBe('فلا اقسم');
    expect(keysOf(question)?.flat()).toEqual(['69:38', '70:40', '81:15', '84:16']);
    expect(keysOf(asked(questions, '69:38'))?.flat()).toContain('56:75');
  });

  it('asks one question per piece of the branches page', () => {
    expect(questions.length).toBeGreaterThan(500);
    expect(new Set(questions.map((question) => question.key)).size).toBe(questions.length);
    for (const question of questions) {
      expect(question.branches.length).toBeGreaterThanOrEqual(2);
      expect(question.branches.flatMap((branch) => branch.ayat).length).toBeLessThanOrEqual(PIECE_MAX);
    }
  });
});

describe('grading the largest questions', () => {
  it('checks a six-branch tree of whole ayat with late typos quickly', () => {
    const question = questions.find((candidate) => candidate.phrase === 'يايها الذين ءامنوا لا تتخذوا')!;
    const typed = branchNodes(question.tree).map((node) => `${node.words.map(spelled).join(' ')}ق`);
    const started = performance.now();
    matchTreeAnswers(question.tree, typed);
    expect(performance.now() - started).toBeLessThan(1000);
  });
});

describe('openings with a hamza below the alif', () => {
  it('keeps أن كان out of the question that asks وإن كان', () => {
    const question = asked(questions, '2:280')!;
    expect(question.variants).toEqual([]);
    expect(keysOf(question)!.flat()).toEqual(['2:280', '6:35', '7:87', '12:27', '15:78']);
    expect(asked(questions, '68:14')).toBeUndefined();
  });
});

describe('words with the same letters, root and lemma', () => {
  it('asks them as one node, as the branches page draws it', () => {
    const question = questions.find((candidate) => candidate.phrase === 'يايها الذين ءامنوا لا تتخذوا')!;
    expect(question.tree.words.map(normalizeWord)).toEqual(['يايها', 'الذين', 'ءامنوا', 'لا', 'تتخذوا']);
    expect(new Set(question.tree.children.map((child) => normalizeWord(child.words[0]))).size).toBe(question.tree.children.length);
    const answers = branchNodes(question.tree).map((node) => node.words.map(spelled).join(' '));
    expect(matchTreeAnswers(question.tree, answers).every((hit) => hit?.correct)).toBe(true);
  });

  it('never asks the same letters twice at a split unless the lemmas differ', () => {
    const repeated = questions.filter((question) => new Set(question.tree.children.map((child) => normalizeWord(child.words[0]))).size < question.tree.children.length);
    expect(repeated.length).toBeLessThan(20);
  });
});
