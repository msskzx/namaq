import { beforeEach, describe, expect, it, vi } from 'vitest';

const { assembleQuiz, citationFindMany } = vi.hoisted(() => ({
  assembleQuiz: vi.fn(),
  citationFindMany: vi.fn(),
}));
vi.mock('@/lib/quiz/assemble', () => ({ assembleQuiz }));
vi.mock('@/lib/prisma', () => ({ prisma: { citation: { findMany: citationFindMany } } }));

import { GET } from './route';

function request(query: string) {
  return new Request(`http://localhost/api/quiz${query}`);
}

function question(overrides: Record<string, unknown> = {}) {
  return {
    claimId: 'claim-1',
    family: 'RELATION',
    attribute: 'WIFE',
    subject: { kind: 'PERSON', slug: 'zaynab-bint-jahsh' },
    choices: ['a', 'b', 'c', 'd'],
    correctAnswer: 'a',
    evidence: { citationIds: ['citation-1'] },
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  citationFindMany.mockResolvedValue([]);
});

describe('GET /api/quiz', () => {
  it('rejects an unknown topic', async () => {
    const response = await GET(request('?topic=NOT_A_TOPIC&length=5'));
    expect(response.status).toBe(400);
  });

  it('rejects an unknown length', async () => {
    const response = await GET(request('?topic=PEOPLE&length=7'));
    expect(response.status).toBe(400);
  });

  it('rejects PERSON_CIRCLE with no person', async () => {
    const response = await GET(request('?topic=PERSON_CIRCLE&length=5'));
    expect(response.status).toBe(400);
  });

  it('returns the assembled questions with resolved reader links', async () => {
    assembleQuiz.mockResolvedValueOnce([question()]);
    citationFindMany.mockResolvedValueOnce([
      {
        id: 'citation-1',
        subjectKind: 'PERSON',
        subjectSlug: 'zaynab-bint-jahsh',
        passage: { page: { accountId: 'account-1', sequence: 3 } },
      },
    ]);

    const response = await GET(request('?topic=PEOPLE&length=5'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.questions[0].evidence.readerUrls).toEqual([
      '/people/zaynab-bint-jahsh?book=account-1&page=3',
    ]);
    expect(assembleQuiz).toHaveBeenCalledWith(
      expect.objectContaining({ topic: 'PEOPLE', length: 5, personSlug: undefined }),
    );
  });

  it('passes the requested person through for PERSON_CIRCLE', async () => {
    assembleQuiz.mockResolvedValueOnce([]);
    await GET(request('?topic=PERSON_CIRCLE&length=5&person=prophet-muhammad'));
    expect(assembleQuiz).toHaveBeenCalledWith(expect.objectContaining({ personSlug: 'prophet-muhammad' }));
  });
});
