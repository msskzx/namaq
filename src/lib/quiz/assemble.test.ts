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
});
