import { beforeEach, describe, expect, it, vi } from 'vitest';

const { count, findMany, historicalClaimFindMany } = vi.hoisted(() => ({ count: vi.fn(), findMany: vi.fn(), historicalClaimFindMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { quizQuestion: { count, findMany }, historicalClaim: { findMany: historicalClaimFindMany } } }));

import { GET } from './route';

beforeEach(() => {
  vi.clearAllMocks();
  count.mockResolvedValue(51);
  findMany.mockResolvedValue([{ key: 'question-one', status: 'REJECTED', correctAnswer: 'answer', evidence: { claimKeys: ['person/claim'] } }]);
  historicalClaimFindMany.mockResolvedValue([]);
});

describe('GET /api/quiz/questions', () => {
  it('paginates the complete bank in fixed pages of fifty', async () => {
    const response = await GET(new Request('http://localhost/api/quiz/questions?page=2'));
    const body = await response.json();
    expect(body).toEqual({
      questions: [{ key: 'question-one', status: 'REJECTED', correctAnswer: 'answer', evidence: { claimKeys: ['person/claim'], readerUrls: [] } }],
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
});
