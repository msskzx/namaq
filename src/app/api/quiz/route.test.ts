import { beforeEach, describe, expect, it, vi } from 'vitest';

const { assembleQuiz, availableQuestionCount, historicalClaimFindMany } = vi.hoisted(() => ({
  assembleQuiz: vi.fn(),
  availableQuestionCount: vi.fn(),
  historicalClaimFindMany: vi.fn(),
}));
vi.mock('@/lib/quiz/assemble', () => ({ assembleQuiz, availableQuestionCount }));
vi.mock('@/lib/prisma', () => ({ prisma: { historicalClaim: { findMany: historicalClaimFindMany } } }));

import { GET } from './route';

function request(query: string) {
  return new Request(`http://localhost/api/quiz${query}`);
}

function question(overrides: Record<string, unknown> = {}) {
  return {
    key: 'RELATION:PERSON:zaynab-bint-jahsh:WIFE:prophet-muhammad',
    family: 'RELATION',
    promptArabic: 'من كان زوج زينب بنت جحش؟',
    choices: [
      { value: 'prophet-muhammad', labelArabic: 'محمد ﷺ' },
      { value: 'a', labelArabic: 'الأول' },
      { value: 'b', labelArabic: 'الثاني' },
      { value: 'c', labelArabic: 'الثالث' },
    ],
    correctAnswer: 'prophet-muhammad',
    evidence: { claimKeys: ['zaynab/relation'] },
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  availableQuestionCount.mockResolvedValue(20);
  historicalClaimFindMany.mockResolvedValue([]);
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

  it('reports the exact available count instead of returning a short quiz', async () => {
    availableQuestionCount.mockResolvedValueOnce(3);
    const response = await GET(request('?topic=AYAT&length=5'));
    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({ error: 'Not enough approved questions', available: 3 });
    expect(assembleQuiz).not.toHaveBeenCalled();
  });

  it('returns reviewed Arabic questions with resolved reader links', async () => {
    assembleQuiz.mockResolvedValueOnce([question()]);
    historicalClaimFindMany.mockResolvedValueOnce([
      {
        authoringKey: 'zaynab/relation',
        citations: [{ subjectKind: 'PERSON', subjectSlug: 'zaynab-bint-jahsh', passage: { page: { accountId: 'account-1', sequence: 3 } } }],
      },
    ]);

    const response = await GET(request('?topic=PEOPLE&length=5'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.questions[0]).toMatchObject({
      promptArabic: 'من كان زوج زينب بنت جحش؟',
      choices: expect.arrayContaining([{ value: 'prophet-muhammad', labelArabic: 'محمد ﷺ' }]),
      evidence: { readerUrls: ['/people/zaynab-bint-jahsh?book=account-1&page=3'] },
    });
    expect(assembleQuiz).toHaveBeenCalledWith(expect.objectContaining({ topic: 'PEOPLE', length: 5, personSlug: undefined }));
  });

  it('passes the requested person through for PERSON_CIRCLE', async () => {
    assembleQuiz.mockResolvedValueOnce([]);
    await GET(request('?topic=PERSON_CIRCLE&length=5&person=prophet-muhammad'));
    expect(availableQuestionCount).toHaveBeenCalledWith('PERSON_CIRCLE', 'prophet-muhammad');
    expect(assembleQuiz).toHaveBeenCalledWith(expect.objectContaining({ personSlug: 'prophet-muhammad' }));
  });
});
