import type { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { shuffle, type Random } from './random';
import type { QuestionChoice, QuestionFamily, QuizLength, QuizTopic } from './types';

export interface AssembledQuestion {
  key: string;
  family: QuestionFamily;
  promptArabic: string;
  choices: QuestionChoice[];
  correctAnswer: string;
  evidence: { claimKeys: string[] };
}

export interface AssembleQuizParams {
  topic: QuizTopic;
  personSlug?: string;
  length: QuizLength;
  random: Random;
}

function whereFor(topic: QuizTopic, personSlug?: string): Prisma.QuizQuestionWhereInput | null {
  if (topic === 'PERSON_CIRCLE') return personSlug ? { status: 'APPROVED', personSlugs: { has: personSlug } } : null;
  return { status: 'APPROVED', topic };
}

export async function availableQuestionCount(topic: QuizTopic, personSlug?: string) {
  const where = whereFor(topic, personSlug);
  return where ? prisma.quizQuestion.count({ where }) : 0;
}

export async function assembleQuiz({ topic, personSlug, length, random }: AssembleQuizParams): Promise<AssembledQuestion[]> {
  const where = whereFor(topic, personSlug);
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
