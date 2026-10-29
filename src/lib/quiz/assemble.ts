import type { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import treeData from '@/app/quran/branches/trees.json';
import type { Branch, BranchAyah, Variant } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';
import { askedNodes } from './branchAnswers';
import { branchQuestions, type BranchAnswer, type BranchQuestion } from './branchQuestions';
import type { TreeGroup } from '@/lib/quran/phraseTrees';
import { shuffle, type Random } from './random';
import { DEFAULT_LEAVES } from './types';
import type { QuestionChoice, QuestionFamily, QuizLength, QuizTopics } from './types';

export interface AssembledQuestion {
  key: string;
  family: QuestionFamily | BranchQuestion['family'];
  attribute?: string | null;
  promptArabic: string;
  choices: QuestionChoice[];
  correctAnswer: string;
  phrase?: string;
  branches?: BranchAnswer[];
  tree?: Branch;
  variants?: Variant[];
  asked?: number[];
  evidence: { claimKeys: string[] };
}

export interface AssembleQuizParams {
  topics: QuizTopics;
  personSlug?: string;
  juz?: JuzRange | null;
  leaves?: number;
  length: QuizLength;
  random: Random;
}

const branchPools = new Map<string, BranchQuestion[]>();
function branchesFor(topics: QuizTopics, juz: JuzRange | null = null) {
  if (!topics.includes('BRANCHES')) return [];
  const id = juz ? `${juz.from}-${juz.to}` : 'all';
  if (!branchPools.has(id)) branchPools.set(id, branchQuestions(treeData.ayat as BranchAyah[], juz, treeData.trees as TreeGroup[]));
  return branchPools.get(id) as BranchQuestion[];
}

// docs/quiz-ayah-branches.md
function whereFor(topics: QuizTopics, personSlug?: string): Prisma.QuizQuestionWhereInput | null {
  const bank = topics.filter((topic) => topic !== 'BRANCHES' && topic !== 'PERSON_CIRCLE');
  const scopes: Prisma.QuizQuestionWhereInput[] = [
    ...(bank.length > 0 ? [{ topic: { in: bank } }] : []),
    ...(topics.includes('PERSON_CIRCLE') && personSlug ? [{ personSlugs: { has: personSlug } }] : []),
  ];
  if (scopes.length === 0) return null;
  return scopes.length === 1 ? { status: 'APPROVED', ...scopes[0] } : { status: 'APPROVED', OR: scopes };
}

export async function availableQuestionCount(topics: QuizTopics, personSlug?: string, juz: JuzRange | null = null) {
  const where = whereFor(topics, personSlug);
  return (where ? await prisma.quizQuestion.count({ where }) : 0) + branchesFor(topics, juz).length;
}

export async function assembleQuiz({ topics, personSlug, juz = null, leaves = DEFAULT_LEAVES, length, random }: AssembleQuizParams): Promise<AssembledQuestion[]> {
  const where = whereFor(topics, personSlug);
  const rows = where ? await prisma.quizQuestion.findMany({
    where,
    select: {
      key: true,
      family: true,
      attribute: true,
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
    attribute: row.attribute,
    promptArabic: row.promptArabicOverride ?? row.generatedPromptArabic,
    choices: row.choices as unknown as QuestionChoice[],
    correctAnswer: row.correctAnswer,
    evidence: row.evidence as unknown as { claimKeys: string[] },
  }));
  return shuffle([...bank, ...branchesFor(topics, juz)], random).slice(0, length).map((question) => ({
    ...question,
    choices: shuffle(question.choices, random),
    ...(question.tree && { asked: askedNodes(question.tree, leaves, random) }),
  }));
}
