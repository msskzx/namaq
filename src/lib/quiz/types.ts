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

export interface QuizQuestion {
  claimId: string;
  family: QuestionFamily;
  attribute: string;
  subject: { kind: SubjectKind; slug: string };
  choices: readonly string[];
  correctIndex: number;
  evidence: { citationIds: readonly string[] };
}
