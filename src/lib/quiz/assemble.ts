import type { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import treeData from '@shared/data/quran/trees.json';
import type { Branch, BranchAyah, Variant } from '@shared/quran/branches';
import type { JuzRange } from '@shared/quran/juz';
import { askedNodes, branchNodes } from '@shared/quiz/branchAnswers';
import { biggerFirst, branchQuestions, type BranchAnswer, type BranchQuestion } from '@shared/quiz/branchQuestions';
import { shuffle, type Random } from '@shared/quiz/random';
import { byDifficulty, DEFAULT_DIFFICULTY, type Difficulty } from '@shared/quiz/difficulty';
import { quizTrees, type TreeScope } from '@shared/quiz/treeScope';
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
  prefixes?: Variant[];
  asked?: number[];
  evidence: { claimKeys: string[] };
}

export interface AssembleQuizParams {
  topics: QuizTopics;
  personSlug?: string;
  juz?: JuzRange | null;
  /** The branches page's filters and saved trees, for tree questions. */
  scope?: TreeScope;
  /** Easy, medium or hard trees first (shared/quiz/difficulty.ts). */
  difficulty?: Difficulty;
  leaves?: number;
  length: QuizLength;
  random: Random;
}

const branchPools = new Map<string, BranchQuestion[]>();
function branchesFor(topics: QuizTopics, juz: JuzRange | null = null, scope: TreeScope = {}) {
  if (!topics.includes('BRANCHES')) return [];
  const id = JSON.stringify([juz, scope]);
  if (!branchPools.has(id)) {
    // Filters vary a lot, so only the last few pools are kept.
    if (branchPools.size >= 32) branchPools.delete(branchPools.keys().next().value!);
    branchPools.set(id, branchQuestions(treeData.ayat as BranchAyah[], juz, quizTrees(juz, scope)));
  }
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

export async function availableQuestionCount(topics: QuizTopics, personSlug?: string, juz: JuzRange | null = null, scope: TreeScope = {}) {
  const where = whereFor(topics, personSlug);
  return (where ? await prisma.quizQuestion.count({ where }) : 0) + branchesFor(topics, juz, scope).length;
}

export async function assembleQuiz({ topics, personSlug, juz = null, scope = {}, difficulty = DEFAULT_DIFFICULTY, leaves = DEFAULT_LEAVES, length, random }: AssembleQuizParams): Promise<AssembledQuestion[]> {
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
  // Trees of the chosen difficulty first; within each, trees big enough for the leaves asked first (see biggerFirst).
  const bigger = biggerFirst(shuffle(branchesFor(topics, juz, scope), random), leaves, question => branchNodes(question.tree).filter(node => node.children.length === 0).length);
  const trees = byDifficulty(bigger, difficulty, question => question.level).slice(0, length);
  return shuffle([...bank, ...trees], random).slice(0, length).map((question) => ({
    ...question,
    choices: shuffle(question.choices, random),
    ...(question.tree && { asked: askedNodes(question.tree, leaves, random) }),
  }));
}
