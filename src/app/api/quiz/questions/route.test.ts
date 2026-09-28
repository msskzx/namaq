import { beforeEach, describe, expect, it, vi } from 'vitest';

const { count, findMany, historicalClaimFindMany, ayahFindMany } = vi.hoisted(() => ({ count: vi.fn(), findMany: vi.fn(), historicalClaimFindMany: vi.fn(), ayahFindMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { quizQuestion: { count, findMany }, historicalClaim: { findMany: historicalClaimFindMany }, ayah: { findMany: ayahFindMany } } }));

import { GET } from './route';

beforeEach(() => {
  vi.clearAllMocks();
  count.mockResolvedValue(51);
  findMany.mockResolvedValue([{
    key: 'question-one',
    family: 'RELATION',
    status: 'REJECTED',
    correctAnswer: 'answer',
    choices: [{ value: 'answer', labelArabic: 'الإجابة' }],
    evidence: { claimKeys: ['person/claim'] },
  }]);
  historicalClaimFindMany.mockResolvedValue([]);
  ayahFindMany.mockResolvedValue([]);
});

describe('GET /api/quiz/questions', () => {
  it('paginates the complete bank in fixed pages of fifty', async () => {
    const response = await GET(new Request('http://localhost/api/quiz/questions?page=2'));
    const body = await response.json();
    expect(body).toEqual({
      questions: [{
        key: 'question-one',
        family: 'RELATION',
        status: 'REJECTED',
        correctAnswer: 'answer',
        choices: [{ value: 'answer', labelArabic: 'الإجابة' }],
        choiceDetails: {},
        evidence: { claimKeys: ['person/claim'], reference: null },
      }],
      pagination: { page: 2, limit: 50, total: 51, totalPages: 2, hasNextPage: false, hasPreviousPage: true },
    });
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 50, take: 50 }));
  });

  it('passes lifecycle, family, topic, completeness and search filters to PostgreSQL', async () => {
    await GET(new Request('http://localhost/api/quiz/questions?status=REJECTED&family=KUNYA&topic=PEOPLE&incomplete=1&search=عبيدة'));
    expect(count).toHaveBeenCalledWith({
      where: expect.objectContaining({
        status: 'REJECTED',
        family: 'KUNYA',
        topic: 'PEOPLE',
        generatedPromptArabic: '',
        AND: expect.any(Array),
      }),
    });
  });

  it('rejects invalid page and filter values', async () => {
    expect((await GET(new Request('http://localhost/api/quiz/questions?page=0'))).status).toBe(400);
    expect((await GET(new Request('http://localhost/api/quiz/questions?status=UNKNOWN'))).status).toBe(400);
    expect((await GET(new Request('http://localhost/api/quiz/questions?family=UNKNOWN'))).status).toBe(400);
  });

  it('resolves Arabic ayah text for every choice of an ayah question', async () => {
    findMany.mockResolvedValueOnce([{
      key: 'ayah-one',
      family: 'AYAH_LINK',
      status: 'APPROVED',
      correctAnswer: '2:255',
      choices: [
        { value: '2:255', labelArabic: '2:255' },
        { value: '2:256', labelArabic: '2:256' },
        { value: 'bad-value', labelArabic: 'bad-value' },
        { value: '2:257', labelArabic: '2:257' },
      ],
      evidence: { claimKeys: [] },
    }]);
    ayahFindMany.mockResolvedValueOnce([
      { number: 255, text: 'آية الكرسي', surah: { number: 2, name: 'البقرة' } },
      { number: 256, text: 'لا إكراه في الدين', surah: { number: 2, name: 'البقرة' } },
    ]);
    const response = await GET(new Request('http://localhost/api/quiz/questions'));
    const body = await response.json();
    expect(body.questions[0].choiceDetails).toEqual({
      '2:255': { text: 'آية الكرسي', reference: 'البقرة 2:255' },
      '2:256': { text: 'لا إكراه في الدين', reference: 'البقرة 2:256' },
    });
  });
});
