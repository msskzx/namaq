import { describe, expect, it } from 'vitest';
import ayat from '@/app/quran/branches/ayat.json';
import { PIECE_MAX, type BranchAyah } from '@/lib/quran/branches';
import { normalizeWord } from '@/lib/quran/normalize';
import { branchQuestions } from './branchQuestions';

const all = ayat as BranchAyah[];
const questions = branchQuestions(all);
const late = branchQuestions(all, { from: 29, to: 30 });
const asked = (list: typeof questions, key: string) => list.find((question) => question.branches.some((branch) => branch.ayat.some((ayah) => ayah.key === key)));
const keysOf = (question: (typeof questions)[number] | undefined) => question?.branches.map((branch) => branch.ayat.map((ayah) => ayah.key));

describe('branchQuestions', () => {
  it('asks يطوف عليهم with both of its spellings in the prompt', () => {
    const question = asked(questions, '52:24');
    expect(question?.promptArabic).toContain('«يَطُوفُ عَلَيْهِمْ» أو «وَيَطُوفُ عَلَيْهِمْ» إلى فرعين');
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
