import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany, titleFindMany } = vi.hoisted(() => ({ findMany: vi.fn(), titleFindMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({
  prisma: { historicalClaim: { findMany }, title: { findMany: titleFindMany } },
}));

const generators = vi.hoisted(() => ({
  generateRelationQuestion: vi.fn(),
  generateParticipationQuestion: vi.fn(),
  generateTitleQuestion: vi.fn(),
  generateTitleHolderQuestion: vi.fn(),
  generateNameQuestion: vi.fn(),
  generateEventQuestion: vi.fn(),
  generateQuranLinkQuestion: vi.fn(),
}));
vi.mock('./generate', () => generators);

import { assembleQuiz } from './assemble';
import type { QuizEligibility, QuizQuestion } from './types';

const eligibility: QuizEligibility = { reviewStatuses: ['REVIEWED'] };
const zero = () => 0;

function question(overrides: Partial<QuizQuestion>): QuizQuestion {
  return {
    claimId: 'claim-1',
    family: 'RELATION',
    attribute: 'WIFE',
    subject: { kind: 'PERSON', slug: 'x' },
    choices: ['a', 'b', 'c', 'd'],
    correctAnswer: 'a',
    evidence: { citationIds: [] },
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('assembleQuiz', () => {
  it('builds questions across every family a topic maps to, up to the requested length', async () => {
    findMany.mockResolvedValue([{ subjectSlug: 'p1' }]);
    generators.generateRelationQuestion.mockResolvedValue(question({ claimId: 'c1', family: 'RELATION' }));
    generators.generateTitleQuestion.mockResolvedValue(question({ claimId: 'c2', family: 'TITLE' }));
    generators.generateNameQuestion.mockResolvedValue(question({ claimId: 'c3', family: 'NAME' }));
    generators.generateQuranLinkQuestion.mockResolvedValue(question({ claimId: 'c4', family: 'QURAN_LINK' }));
    generators.generateParticipationQuestion.mockResolvedValue(question({ claimId: 'c5', family: 'PARTICIPATION' }));

    const questions = await assembleQuiz({ topics: ['PEOPLE'], length: 5, eligibility, random: zero });

    expect(questions).toHaveLength(5);
    expect(new Set(questions.map((q) => q.family))).toEqual(
      new Set(['RELATION', 'TITLE', 'NAME', 'QURAN_LINK', 'PARTICIPATION']),
    );
  });

  it('never includes two questions backed by the same claim', async () => {
    findMany.mockResolvedValue([{ subjectSlug: 'p1' }, { subjectSlug: 'p2' }]);
    generators.generateParticipationQuestion.mockResolvedValue(
      question({ claimId: 'shared-claim', family: 'PARTICIPATION' }),
    );

    const questions = await assembleQuiz({ topics: ['BATTLES'], length: 5, eligibility, random: zero });

    expect(questions).toHaveLength(1);
  });

  it('combines families from multiple topics', async () => {
    findMany.mockResolvedValue([{ subjectSlug: 'p1' }]);
    generators.generateParticipationQuestion.mockResolvedValue(question({ claimId: 'battle', family: 'PARTICIPATION' }));
    titleFindMany.mockResolvedValue([{ slug: 'title-1' }]);
    generators.generateTitleHolderQuestion.mockResolvedValue(question({ claimId: 'title', family: 'TITLE_HOLDER' }));

    const questions = await assembleQuiz({ topics: ['BATTLES', 'TITLES'], length: 5, eligibility, random: zero });

    expect(new Set(questions.map((item) => item.family))).toEqual(new Set(['PARTICIPATION', 'TITLE_HOLDER']));
  });

  it('skips a candidate the generator declines', async () => {
    findMany.mockResolvedValue([{ subjectSlug: 'p1' }, { subjectSlug: 'p2' }]);
    generators.generateEventQuestion.mockResolvedValueOnce(null).mockResolvedValueOnce(question({ family: 'EVENT' }));

    const questions = await assembleQuiz({ topics: ['EVENTS'], length: 5, eligibility, random: zero });

    expect(questions).toHaveLength(1);
  });

  it('fixes the subject to personSlug for a person-circle topic, ignoring candidate lookup', async () => {
    generators.generateRelationQuestion.mockResolvedValue(question({ claimId: 'c1', family: 'RELATION' }));
    generators.generateTitleQuestion.mockResolvedValue(question({ claimId: 'c2', family: 'TITLE' }));
    generators.generateNameQuestion.mockResolvedValue(null);
    generators.generateQuranLinkQuestion.mockResolvedValue(null);
    generators.generateParticipationQuestion.mockResolvedValue(null);

    const questions = await assembleQuiz({
      topics: ['PERSON_CIRCLE'],
      personSlug: 'prophet-muhammad',
      length: 5,
      eligibility,
      random: zero,
    });

    expect(findMany).not.toHaveBeenCalled();
    expect(questions).toHaveLength(2);
    expect(generators.generateRelationQuestion).toHaveBeenCalledWith('prophet-muhammad', eligibility, zero);
  });

  it('returns an empty list for person-circle with no person given', async () => {
    const questions = await assembleQuiz({ topics: ['PERSON_CIRCLE'], length: 5, eligibility, random: zero });
    expect(questions).toEqual([]);
  });
});
