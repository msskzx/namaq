import { describe, expect, it } from 'vitest';
import ayat from '@/app/quran/branches/ayat.json';
import type { BranchAyah } from '@/lib/quran/branches';
import { MAX_BRANCHES, branchQuestions } from './branchQuestions';

const all = ayat as BranchAyah[];
const questions = branchQuestions(all);
const firstWords = (phrase: string, range = branchQuestions(all, { from: 29, to: 30 })) =>
  range.find((item) => item.phrase === phrase)?.branches.map((branch) => [branch.words[0], branch.ayat.map((ayah) => ayah.key)]);

describe('branchQuestions', () => {
  it('asks for the two ways the ayat opening with ويطوف عليهم go on', () => {
    const question = questions.find((item) => item.phrase === 'ويطوف عليهم');
    expect(question?.promptArabic).toContain('«وَيَطُوفُ عَلَيْهِمْ» إلى فرعين');
    expect(firstWords('ويطوف عليهم', questions)).toEqual([['غِلْمَانٌۭ', ['52:24']], ['وِلْدَٰنٌۭ', ['76:19']]]);
    expect(question?.branches[0].ayat[0].page).toBe(524);
  });

  it('asks only for the branches inside the chosen juz', () => {
    const question = branchQuestions(all, { from: 29, to: 30 }).find((item) => item.phrase === 'فلا اقسم');
    expect(question?.promptArabic).toContain('إلى أربعة فروع');
    expect(question?.branches.flatMap((branch) => branch.ayat.map((ayah) => ayah.key))).toEqual(['69:38', '70:40', '81:15', '84:16']);
    expect(questions.find((item) => item.phrase === 'فلا اقسم')?.branches.flatMap((branch) => branch.ayat.map((ayah) => ayah.key))).toContain('56:75');
  });

  it('keeps splits of two to five branches where no ayah ends', () => {
    expect(questions.length).toBeGreaterThan(500);
    expect(new Set(questions.map((question) => question.key)).size).toBe(questions.length);
    for (const question of questions) {
      expect(question.branches.length).toBeGreaterThanOrEqual(2);
      expect(question.branches.length).toBeLessThanOrEqual(MAX_BRANCHES);
    }
  });
});
