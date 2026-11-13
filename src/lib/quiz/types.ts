import type { SubjectKind } from '@/generated/prisma';

export const QUESTION_FAMILIES = [
  'KUNYA',
  'PERSON_TITLE',
  'TITLE_HOLDER',
  'VIRTUE_HOLDER',
  'RELATION',
  'AYAH_LINK',
  'AYAH_REVEALED_ABOUT',
  'BATTLE_HIJRI_YEAR',
  'EXCUSED_ABSENCE_REASON',
  'EVENT_HIJRI_YEAR',
] as const;

export type QuestionFamily = (typeof QUESTION_FAMILIES)[number];

export { QUIZ_TOPICS, CHOICE_TOPICS, QUIZ_LENGTHS, QUIZ_LEAVES, DEFAULT_LEAVES, parseLeaves } from '@shared/quiz/settings';
export type { QuizTopic, QuizTopics, QuizLength } from '@shared/quiz/settings';
import type { QuizTopic } from '@shared/quiz/settings';
export type QuestionTopic = Exclude<QuizTopic, 'PERSON_CIRCLE' | 'BRANCHES' | 'SURAH' | 'RECITE' | 'TUHFA_COMPLETE' | 'TUHFA_NEXT' | 'TUHFA_RULE'>;

export const QUESTION_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'RETIRED'] as const;
export type QuestionStatus = (typeof QUESTION_STATUSES)[number];

export interface QuestionChoice {
  value: string;
  labelArabic: string;
}

export interface GeneratedQuestion {
  key: string;
  family: QuestionFamily;
  topic: QuestionTopic;
  subject: { kind: SubjectKind; slug: string } | null;
  attribute: string | null;
  personSlugs: string[];
  promptArabic: string;
  choices: QuestionChoice[];
  correctAnswer: string;
  evidence: { claimKeys: string[] };
}

export interface QuestionBankEntry extends GeneratedQuestion {
  fingerprint: string;
  promptArabicOverride: string | null;
  status: QuestionStatus;
  rejectionReason: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

export interface QuestionBank {
  version: 1;
  generatedAt: string;
  questions: QuestionBankEntry[];
}

export interface QuizQuestion {
  key: string;
  family: QuestionFamily;
  promptArabic: string;
  choices: QuestionChoice[];
  correctAnswer: string;
  evidence: { readerUrls: string[] };
}
