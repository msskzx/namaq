import type { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { shuffle, type Random } from './random';
import type { QuestionChoice, QuestionFamily, QuizLength, QuizTopics } from './types';

export interface AssembledQuestion {
  key: string;
  family: QuestionFamily;
  promptArabic: string;
  choices: QuestionChoice[];
  correctAnswer: string;
  evidence: { claimKeys: string[] };
}

export interface AssembleQuizParams {
  topics: QuizTopics;
  personSlug?: string;
  length: QuizLength;
  random: Random;
}

function whereFor(topics: QuizTopics, personSlug?: string): Prisma.QuizQuestionWhereInput | null {
  if (topics.includes('PERSON_CIRCLE')) return personSlug ? { status: 'APPROVED', personSlugs: { has: personSlug } } : null;
  return topics.length > 0 ? { status: 'APPROVED', topic: { in: [...topics] } } : null;
}

export async function availableQuestionCount(topics: QuizTopics, personSlug?: string) {
  const where = whereFor(topics, personSlug);
  return where ? prisma.quizQuestion.count({ where }) : 0;
}

export async function assembleQuiz({ topics, personSlug, length, random }: AssembleQuizParams): Promise<AssembledQuestion[]> {
  const where = whereFor(topics, personSlug);
  if (!where) return [];
  const rows = await prisma.quizQuestion.findMany({
    where,
    select: {
      key: true,
      family: true,
      generatedPromptArabic: true,
      promptArabicOverride: true,
      choices: true,
      correctAnswer: true,
      evidence: true,
    },
  });
  return shuffle(rows, random).slice(0, length).map((row) => ({
    key: row.key,
    family: row.family as QuestionFamily,
    promptArabic: row.promptArabicOverride ?? row.generatedPromptArabic,
    choices: shuffle(row.choices as unknown as QuestionChoice[], random),
    correctAnswer: row.correctAnswer,
    evidence: row.evidence as unknown as { claimKeys: string[] },
  }));
}
