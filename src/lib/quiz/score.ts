import { branchNodes, givenAnswer, matchTreeAnswers } from './branchAnswers';
import type { BranchAnswer } from './branchQuestions';
import type { Branch, Variant } from '@/lib/quran/branches';

export type ScoredQuestion = { correctAnswer?: string; phrase?: string; partition?: string; branches?: BranchAnswer[]; tree?: Branch; variants?: Variant[]; asked?: number[] };
export type QuestionAnswer = string | string[];

export const isAsked = (question: ScoredQuestion, index: number) => !question.asked || question.asked.includes(index);
export const givenNodes = (question: ScoredQuestion) => new Set(question.tree ? branchNodes(question.tree).flatMap((_, index) => isAsked(question, index) ? [] : [index]) : []);

export const emptyBranchAnswers = (question: ScoredQuestion) => question.tree ? branchNodes(question.tree).map((node, index) => isAsked(question, index) ? "" : givenAnswer(node)) : [];

export const branchesCorrect = (question: ScoredQuestion, typed: string[]) => Boolean(question.tree &&
  typed.length === branchNodes(question.tree).length && typed.length > 0 && matchTreeAnswers(question.tree, typed, givenNodes(question)).every(hit => hit?.correct));

export function branchPoints(question: ScoredQuestion, typed: string[]) {
  if (!question.tree) return { earned: 0, total: 0 };
  const matches = matchTreeAnswers(question.tree, typed, givenNodes(question));
  const asked = branchNodes(question.tree).flatMap((_, index) => isAsked(question, index) ? [index] : []);
  return { earned: asked.filter(index => matches[index]?.correct).length, total: asked.length };
}

/** A tree question scores one point per asked leaf, any other question one point. */
export function questionPoints(question: ScoredQuestion, answer: QuestionAnswer | undefined) {
  if (question.tree) return branchPoints(question, Array.isArray(answer) ? answer : emptyBranchAnswers(question));
  return { earned: Number(answer !== undefined && answer === question.correctAnswer), total: 1 };
}
