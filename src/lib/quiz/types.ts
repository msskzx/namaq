import type { ClaimReviewStatus, SubjectKind } from '@/generated/prisma';

export type QuestionFamily =
  | 'RELATION'
  | 'PARTICIPATION'
  | 'TITLE'
  | 'TITLE_HOLDER'
  | 'NAME'
  | 'EVENT'
  | 'QURAN_LINK';

export interface QuizEligibility {
  reviewStatuses: ClaimReviewStatus[];
}

/** Reviewed-only in production; every status during this development phase. */
export const PRODUCTION_ELIGIBILITY: QuizEligibility = { reviewStatuses: ['REVIEWED'] };
export const DEVELOPMENT_ELIGIBILITY: QuizEligibility = {
  reviewStatuses: ['NOT_REVIEWED', 'IN_REVIEW', 'REVIEWED'],
};

export const QUIZ_TOPICS = ['PEOPLE', 'BATTLES', 'TITLES', 'EVENTS', 'PERSON_CIRCLE'] as const;
export type QuizTopic = (typeof QUIZ_TOPICS)[number];

export const QUIZ_LENGTHS = [5, 10, 15] as const;
export type QuizLength = (typeof QUIZ_LENGTHS)[number];

export interface QuizQuestion {
  claimId: string;
  family: QuestionFamily;
  attribute: string;
  subject: { kind: SubjectKind; slug: string };
  choices: readonly string[];
  correctAnswer: string;
  evidence: { citationIds: readonly string[] };
}
