import { beforeEach, describe, expect, it, vi } from 'vitest';

const { count, findMany } = vi.hoisted(() => ({ count: vi.fn(), findMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { quizQuestion: { count, findMany } } }));

import { assembleQuiz, availableQuestionCount } from './assemble';

const rows = [{
  key: 'one',
  family: 'KUNYA',
  generatedPromptArabic: 'ما كنيته؟',
  promptArabicOverride: null,
  choices: [
    { value: 'a', labelArabic: 'أ' },
    { value: 'b', labelArabic: 'ب' },
    { value: 'c', labelArabic: 'ج' },
    { value: 'd', labelArabic: 'د' },
  ],
  correctAnswer: 'a',
  evidence: { claimKeys: ['claim'] },
}];

beforeEach(() => {
  vi.clearAllMocks();
  findMany.mockResolvedValue(rows);
  count.mockResolvedValue(1);
});

describe('approved quiz assembly', () => {
  it('reads only approved rows for the selected topic', async () => {
    const questions = await assembleQuiz({ topics: ['PEOPLE', 'AYAT'], length: 5, random: () => 0 });
    expect(questions[0]).toMatchObject({ key: 'one', promptArabic: 'ما كنيته؟', correctAnswer: 'a' });
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { status: 'APPROVED', topic: { in: ['PEOPLE', 'AYAT'] } } }));
  });

  it('finds every approved question materially involving a selected person', async () => {
    await assembleQuiz({ topics: ['PERSON_CIRCLE'], personSlug: 'abu-ubaydah', length: 5, random: () => 0 });
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { status: 'APPROVED', personSlugs: { has: 'abu-ubaydah' } } }));
  });

  it('counts availability with the same scope', async () => {
    expect(await availableQuestionCount(['AYAT'])).toBe(1);
    expect(count).toHaveBeenCalledWith({ where: { status: 'APPROVED', topic: { in: ['AYAT'] } } });
  });

  it('draws shared-opening questions from the Quran text without the bank', async () => {
    const questions = await assembleQuiz({ topics: ['BRANCHES'], length: 5, random: () => 0 });
    expect(findMany).not.toHaveBeenCalled();
    expect(questions).toHaveLength(5);
    for (const question of questions) expect(question).toMatchObject({ family: 'AYAH_BRANCH', choices: [] });
    expect(questions[0].branches?.length).toBeGreaterThanOrEqual(2);
  });

  it('counts shared openings on top of the bank and leaves them out of a person circle', async () => {
    const both = await availableQuestionCount(['AYAT', 'BRANCHES']);
    expect(both).toBeGreaterThan(500);
    expect(count).toHaveBeenCalledWith({ where: { status: 'APPROVED', topic: { in: ['AYAT'] } } });
    expect(await availableQuestionCount(['PERSON_CIRCLE', 'BRANCHES'], 'abu-ubaydah')).toBe(1);
  });

  it('builds shared-opening questions from the chosen juz only', async () => {
    const all = await availableQuestionCount(['BRANCHES']);
    const late = await availableQuestionCount(['BRANCHES'], undefined, { from: 29, to: 30 });
    expect(late).toBeGreaterThan(0);
    expect(late).toBeLessThan(all);
    const questions = await assembleQuiz({ topics: ['BRANCHES'], juz: { from: 30, to: 30 }, length: 5, random: () => 0 });
    for (const question of questions) {
      for (const branch of question.branches ?? []) for (const ayah of branch.ayat) expect(Number(ayah.key.split(':')[0])).toBeGreaterThanOrEqual(78);
    }
  });
});
