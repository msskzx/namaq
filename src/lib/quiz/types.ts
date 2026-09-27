import type { SubjectKind } from '@/generated/prisma';

export const QUESTION_FAMILIES = [
  'KUNYA',
  'PERSON_TITLE',
  'TITLE_HOLDER',
  'VIRTUE_HOLDER',
  'RELATION',
  'AYAH_LINK',
  'BATTLE_HIJRI_YEAR',
  'EXCUSED_ABSENCE_REASON',
  'EVENT_HIJRI_YEAR',
] as const;

export type QuestionFamily = (typeof QUESTION_FAMILIES)[number];

export const QUIZ_TOPICS = ['PEOPLE', 'BATTLES', 'RELATIONSHIPS', 'AYAT', 'EVENTS', 'PERSON_CIRCLE'] as const;
export type QuizTopic = (typeof QUIZ_TOPICS)[number];
export type QuestionTopic = Exclude<QuizTopic, 'PERSON_CIRCLE'>;

export const QUIZ_LENGTHS = [5, 10, 15] as const;
export type QuizLength = (typeof QUIZ_LENGTHS)[number];

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
