import { beforeEach, describe, expect, it, vi } from 'vitest';

const { assembleQuiz, availableQuestionCount, historicalClaimFindMany, ayahFindMany } = vi.hoisted(() => ({
  assembleQuiz: vi.fn(),
  availableQuestionCount: vi.fn(),
  historicalClaimFindMany: vi.fn(),
  ayahFindMany: vi.fn(),
}));
vi.mock('@/lib/quiz/assemble', () => ({ assembleQuiz, availableQuestionCount }));
vi.mock('@/lib/prisma', () => ({ prisma: { historicalClaim: { findMany: historicalClaimFindMany }, ayah: { findMany: ayahFindMany } } }));

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
  ayahFindMany.mockResolvedValue([]);
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

  it('returns reviewed Arabic questions with one structured quiz reference', async () => {
    assembleQuiz.mockResolvedValueOnce([question()]);
    historicalClaimFindMany.mockResolvedValueOnce([
      {
        authoringKey: 'zaynab/relation',
        citations: [{
          subjectKind: 'PERSON',
          subjectSlug: 'zaynab-bint-jahsh',
          excerptArabic: 'نص الشاهد',
          pageReference: '5',
          source: { title: 'سير أعلام النبلاء' },
          passage: { anchor: '4/5-p3', page: { printedPage: 3, volume: { number: 4 } } },
        }],
      },
    ]);

    const response = await GET(request('?topic=PEOPLE&length=5'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.questions[0]).toMatchObject({
      promptArabic: 'من كان زوج زينب بنت جحش؟',
      choices: expect.arrayContaining([{ value: 'prophet-muhammad', labelArabic: 'محمد ﷺ' }]),
      evidence: {
        reference: {
          excerptArabic: 'نص الشاهد',
          sourceTitle: 'سير أعلام النبلاء',
          pageReference: '5',
          readerUrl: '/people/zaynab-bint-jahsh?volume=4&page=3&passage=4%2F5-p3',
        },
      },
    });
    expect(assembleQuiz).toHaveBeenCalledWith(expect.objectContaining({ topics: ['PEOPLE'], length: 5, personSlug: undefined }));
  });

  it('omits the reference when no citation resolves to a reader passage', async () => {
    assembleQuiz.mockResolvedValueOnce([question()]);
    historicalClaimFindMany.mockResolvedValueOnce([
      { authoringKey: 'zaynab/relation', citations: [{ subjectKind: 'EVENT', subjectSlug: 'badr' }] },
    ]);

    const response = await GET(request('?topic=PEOPLE&length=5'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.questions[0].evidence).toEqual({ reference: null });
  });

  it('passes the requested person through for PERSON_CIRCLE', async () => {
    assembleQuiz.mockResolvedValueOnce([]);
    await GET(request('?topic=PERSON_CIRCLE&length=5&person=prophet-muhammad'));
    expect(availableQuestionCount).toHaveBeenCalledWith(['PERSON_CIRCLE'], 'prophet-muhammad');
    expect(assembleQuiz).toHaveBeenCalledWith(expect.objectContaining({ personSlug: 'prophet-muhammad' }));
  });

  it('combines repeated and comma-separated topics without duplicates', async () => {
    assembleQuiz.mockResolvedValueOnce([]);
    await GET(request('?topic=PEOPLE,BATTLES&topic=AYAT&topic=PEOPLE&length=5'));
    expect(availableQuestionCount).toHaveBeenCalledWith(['PEOPLE', 'BATTLES', 'AYAT'], undefined);
    expect(assembleQuiz).toHaveBeenCalledWith(expect.objectContaining({ topics: ['PEOPLE', 'BATTLES', 'AYAT'] }));
  });

  it('resolves Quran text for ayah choices', async () => {
    assembleQuiz.mockResolvedValueOnce([question({
      family: 'AYAH_LINK',
      choices: [
        { value: '2:255', labelArabic: '2:255' },
        { value: '2:256', labelArabic: '2:256' },
        { value: '2:257', labelArabic: '2:257' },
        { value: '2:258', labelArabic: '2:258' },
      ],
      correctAnswer: '2:255',
    })]);
    ayahFindMany.mockResolvedValueOnce([
      { number: 255, text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ', surah: { number: 2, name: 'البقرة' } },
    ]);
    const response = await GET(request('?topic=AYAT&length=5'));
    const body = await response.json();
    expect(body.questions[0].choiceDetails['2:255']).toEqual({
      text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ',
      reference: 'البقرة 2:255',
    });
  });
});
