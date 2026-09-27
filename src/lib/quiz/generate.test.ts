import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findFirst, findMany, person, battle, title, event, ayah } = vi.hoisted(() => ({
  findFirst: vi.fn(),
  findMany: vi.fn(),
  person: { findUnique: vi.fn(), findMany: vi.fn() },
  battle: { findMany: vi.fn() },
  title: { findUnique: vi.fn(), findMany: vi.fn() },
  event: { findUnique: vi.fn(), findMany: vi.fn() },
  ayah: { findMany: vi.fn() },
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    historicalClaim: { findFirst, findMany },
    person,
    battle,
    title,
    event,
    ayah,
  },
}));

import {
  generateEventQuestion,
  generateNameQuestion,
  generateParticipationQuestion,
  generateQuranLinkQuestion,
  generateRelationQuestion,
  generateTitleHolderQuestion,
  generateTitleQuestion,
} from './generate';
import type { QuizEligibility } from './types';

const eligibility: QuizEligibility = { reviewStatuses: ['REVIEWED'] };
const zero = () => 0;

function claim(overrides: Record<string, unknown>) {
  return { id: 'claim-1', citations: [{ id: 'citation-1' }], ...overrides };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('generateRelationQuestion', () => {
  it('builds a question from the subject\'s eligible relation claim and other subjects\' distractors', async () => {
    findFirst.mockResolvedValueOnce(
      claim({ relationshipType: 'WIFE', relatedSubjectSlug: 'prophet-muhammad' }),
    );
    findMany
      .mockResolvedValueOnce([{ relatedSubjectSlug: 'prophet-muhammad' }])
      .mockResolvedValueOnce([{ relatedSubjectSlug: 'a' }, { relatedSubjectSlug: 'b' }, { relatedSubjectSlug: 'c' }]);

    const question = await generateRelationQuestion('zaynab-bint-jahsh', eligibility, zero);

    expect(question).toEqual({
      claimId: 'claim-1',
      family: 'RELATION',
      attribute: 'WIFE',
      subject: { kind: 'PERSON', slug: 'zaynab-bint-jahsh' },
      choices: ['prophet-muhammad', 'a', 'b', 'c'],
      correctIndex: 0,
      evidence: { citationIds: ['citation-1'] },
    });
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ disputed: false, reviewStatus: { in: ['REVIEWED'] } }) }),
    );
  });

  it('returns null when there are fewer than three eligible distractors', async () => {
    findFirst.mockResolvedValueOnce(claim({ relationshipType: 'WIFE', relatedSubjectSlug: 'prophet-muhammad' }));
    findMany.mockResolvedValueOnce([{ relatedSubjectSlug: 'prophet-muhammad' }]).mockResolvedValueOnce([]);

    expect(await generateRelationQuestion('zaynab-bint-jahsh', eligibility, zero)).toBeNull();
  });

  it('returns null when the subject has no eligible relation claim', async () => {
    findFirst.mockResolvedValueOnce(null);
    expect(await generateRelationQuestion('zaynab-bint-jahsh', eligibility, zero)).toBeNull();
  });
});

describe('generateParticipationQuestion', () => {
  it('builds a question from an eligible battle-participation claim', async () => {
    findFirst.mockResolvedValueOnce(claim({ relationshipType: 'PARTICIPATED_IN', relatedSubjectSlug: 'badr' }));
    findMany.mockResolvedValueOnce([{ relatedSubjectSlug: 'badr' }]);
    battle.findMany.mockResolvedValueOnce([{ slug: 'uhud' }, { slug: 'khandaq' }, { slug: 'hunayn' }]);

    const question = await generateParticipationQuestion('abdullah-ibn-mazun-al-jumahi', eligibility, zero);

    expect(question?.choices).toContain('badr');
    expect(question?.correctIndex).toBe(0);
    expect(question?.family).toBe('PARTICIPATION');
  });

  it('returns null when fewer than three battles remain as distractors', async () => {
    findFirst.mockResolvedValueOnce(claim({ relationshipType: 'PARTICIPATED_IN', relatedSubjectSlug: 'badr' }));
    findMany.mockResolvedValueOnce([{ relatedSubjectSlug: 'badr' }]);
    battle.findMany.mockResolvedValueOnce([{ slug: 'uhud' }]);

    expect(await generateParticipationQuestion('abdullah-ibn-mazun-al-jumahi', eligibility, zero)).toBeNull();
  });
});

describe('generateTitleQuestion', () => {
  it('builds a question when the person holds exactly one title backed by one claim', async () => {
    findMany.mockResolvedValueOnce([claim({ field: 'titles' })]);
    person.findUnique.mockResolvedValueOnce({ titles: [{ slug: 'al-amin' }] });
    title.findMany.mockResolvedValueOnce([{ slug: 'sahabi' }, { slug: 'siddiq' }, { slug: 'faruq' }]);

    const question = await generateTitleQuestion('prophet-muhammad', eligibility, zero);

    expect(question?.choices[0]).toBe('al-amin');
    expect(question?.family).toBe('TITLE');
  });

  it('returns null when the person holds more than one title', async () => {
    findMany.mockResolvedValueOnce([claim({ field: 'titles' })]);
    person.findUnique.mockResolvedValueOnce({ titles: [{ slug: 'al-amin' }, { slug: 'sahabi' }] });

    expect(await generateTitleQuestion('prophet-muhammad', eligibility, zero)).toBeNull();
  });

  it('returns null when more than one eligible claim names a title', async () => {
    findMany.mockResolvedValueOnce([claim({ field: 'titles' }), claim({ id: 'claim-2', field: 'titles' })]);
    person.findUnique.mockResolvedValueOnce({ titles: [{ slug: 'al-amin' }] });

    expect(await generateTitleQuestion('prophet-muhammad', eligibility, zero)).toBeNull();
  });
});

describe('generateTitleHolderQuestion', () => {
  it('builds a question naming an unambiguous holder', async () => {
    title.findUnique.mockResolvedValueOnce({ people: [{ slug: 'prophet-muhammad' }] });
    findMany.mockResolvedValueOnce([claim({ subjectSlug: 'prophet-muhammad', field: 'titles' })]);
    person.findMany.mockResolvedValueOnce([{ slug: 'prophet-muhammad', titles: [{ slug: 'al-amin' }] }]);
    person.findMany.mockResolvedValueOnce([{ slug: 'a' }, { slug: 'b' }, { slug: 'c' }]);

    const question = await generateTitleHolderQuestion('al-amin', eligibility, zero);

    expect(question?.subject).toEqual({ kind: 'TITLE', slug: 'al-amin' });
    expect(question?.choices[0]).toBe('prophet-muhammad');
  });

  it('returns null when no candidate holder is unambiguous', async () => {
    title.findUnique.mockResolvedValueOnce({ people: [{ slug: 'prophet-muhammad' }] });
    findMany.mockResolvedValueOnce([
      claim({ subjectSlug: 'prophet-muhammad', field: 'titles' }),
      claim({ id: 'claim-2', subjectSlug: 'prophet-muhammad', field: 'titles' }),
    ]);
    person.findMany.mockResolvedValueOnce([{ slug: 'prophet-muhammad', titles: [{ slug: 'al-amin' }] }]);

    expect(await generateTitleHolderQuestion('al-amin', eligibility, zero)).toBeNull();
  });
});

describe('generateNameQuestion', () => {
  it('builds a kunya question from the person\'s eligible claim', async () => {
    findFirst.mockResolvedValueOnce(claim({ field: 'kunya' }));
    person.findUnique.mockResolvedValueOnce({ kunya: 'أبو محمد' });
    person.findMany.mockResolvedValueOnce([{ kunya: 'أبو بكر' }, { kunya: 'أبو هريرة' }, { kunya: 'أبو الدرداء' }]);

    const question = await generateNameQuestion('abdullah-ibn-mazun-al-jumahi', eligibility, zero);

    expect(question?.choices[0]).toBe('أبو محمد');
    expect(question?.family).toBe('NAME');
  });
});

describe('generateEventQuestion', () => {
  it('builds a year question from the event\'s eligible claim', async () => {
    findFirst.mockResolvedValueOnce(claim({ field: 'hijriYear' }));
    event.findUnique.mockResolvedValueOnce({ hijriYear: 1 });
    event.findMany.mockResolvedValueOnce([{ hijriYear: 2 }, { hijriYear: 3 }, { hijriYear: 5 }]);

    const question = await generateEventQuestion('isra-and-miraj', eligibility, zero);

    expect(question?.choices[0]).toBe('1');
    expect(question?.family).toBe('EVENT');
  });
});

describe('generateQuranLinkQuestion', () => {
  it('builds a question from one of the person\'s linked ayat', async () => {
    findFirst.mockResolvedValueOnce(claim({ field: 'ayat' }));
    person.findUnique.mockResolvedValueOnce({ ayat: [{ number: 172, surah: { number: 3 } }] });
    ayah.findMany.mockResolvedValueOnce([
      { number: 37, surah: { number: 33 } },
      { number: 52, surah: { number: 6 } },
      { number: 2, surah: { number: 30 } },
    ]);

    const question = await generateQuranLinkQuestion('az-zubayr-ibn-al-awwam', eligibility, zero);

    expect(question?.choices[0]).toBe('3:172');
    expect(question?.family).toBe('QURAN_LINK');
  });

  it('returns null for a person with no linked ayat', async () => {
    findFirst.mockResolvedValueOnce(claim({ field: 'ayat' }));
    person.findUnique.mockResolvedValueOnce({ ayat: [] });

    expect(await generateQuranLinkQuestion('someone', eligibility, zero)).toBeNull();
  });
});
