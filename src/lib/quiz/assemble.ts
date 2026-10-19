import type { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import ayat from '@/app/quran/branches/ayat.json';
import type { Branch, BranchAyah, Variant } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';
import { branchQuestions, type BranchAnswer, type BranchQuestion } from './branchQuestions';
import { shuffle, type Random } from './random';
import type { QuestionChoice, QuestionFamily, QuizLength, QuizTopics } from './types';

export interface AssembledQuestion {
  key: string;
  family: QuestionFamily | BranchQuestion['family'];
  promptArabic: string;
  choices: QuestionChoice[];
  correctAnswer: string;
  phrase?: string;
  branches?: BranchAnswer[];
  tree?: Branch;
  variants?: Variant[];
  evidence: { claimKeys: string[] };
}

export interface AssembleQuizParams {
  topics: QuizTopics;
  personSlug?: string;
  juz?: JuzRange | null;
  length: QuizLength;
  random: Random;
}

const branchPools = new Map<string, BranchQuestion[]>();
function branchesFor(topics: QuizTopics, juz: JuzRange | null = null) {
  if (!topics.includes('BRANCHES') || topics.includes('PERSON_CIRCLE')) return [];
  const id = juz ? `${juz.from}-${juz.to}` : 'all';
  if (!branchPools.has(id)) branchPools.set(id, branchQuestions(ayat as BranchAyah[], juz));
  return branchPools.get(id) as BranchQuestion[];
}

function whereFor(topics: QuizTopics, personSlug?: string): Prisma.QuizQuestionWhereInput | null {
  if (topics.includes('PERSON_CIRCLE')) return personSlug ? { status: 'APPROVED', personSlugs: { has: personSlug } } : null;
  const bank = topics.filter((topic) => topic !== 'BRANCHES');
  return bank.length > 0 ? { status: 'APPROVED', topic: { in: bank } } : null;
}

export async function availableQuestionCount(topics: QuizTopics, personSlug?: string, juz: JuzRange | null = null) {
  const where = whereFor(topics, personSlug);
  return (where ? await prisma.quizQuestion.count({ where }) : 0) + branchesFor(topics, juz).length;
}

export async function assembleQuiz({ topics, personSlug, juz = null, length, random }: AssembleQuizParams): Promise<AssembledQuestion[]> {
  const where = whereFor(topics, personSlug);
  const rows = where ? await prisma.quizQuestion.findMany({
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
  }) : [];
  const bank: AssembledQuestion[] = rows.map((row) => ({
    key: row.key,
    family: row.family as QuestionFamily,
    promptArabic: row.promptArabicOverride ?? row.generatedPromptArabic,
    choices: row.choices as unknown as QuestionChoice[],
    correctAnswer: row.correctAnswer,
    evidence: row.evidence as unknown as { claimKeys: string[] },
  }));
  return shuffle([...bank, ...branchesFor(topics, juz)], random).slice(0, length).map((question) => ({
    ...question,
    choices: shuffle(question.choices, random),
  }));
}
