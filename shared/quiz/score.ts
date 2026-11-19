import { branchNodes, givenAnswer, matchTreeAnswers } from './branchAnswers';
import type { BranchAnswer } from './branchQuestions';
import type { Branch, Variant } from '../quran/branches';
import { comparePoints, type CompareAsk } from './compareAnswers';
import { gradeWritten } from '../quran/writeAyah';
import { PICKS } from './choiceKinds';

/** An ayah written with the pen in a party: its words as its page sets them, and the places the host's pen rule asks. */
export type WriteAsk = { asked: number[]; words?: string[] };
export type ScoredQuestion = { correctAnswer?: string; correctAnswers?: string[]; phrase?: string; branches?: BranchAnswer[]; tree?: Branch; variants?: Variant[]; prefixes?: Variant[]; asked?: number[]; compare?: CompareAsk; write?: WriteAsk };
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

/** What was written for each asked place (`answer[i]` for `asked[i]`), graded as recite mode grades it. */
export function writtenGrade(write: Required<WriteAsk>, answer: QuestionAnswer | undefined) {
  const typed = Array.isArray(answer) ? answer : [];
  return gradeWritten(write.asked, Object.fromEntries(write.asked.map((at, i) => [at, typed[i] ?? ''])), write.words);
}

/** A tree question scores one point per asked leaf, a compare question one per blank, a written ayah one per asked word, any other question one point. */
export function questionPoints(question: ScoredQuestion, answer: QuestionAnswer | undefined) {
  if (question.write?.words) return { earned: writtenGrade(question.write as Required<WriteAsk>, answer).right.length, total: question.write.asked.length };
  if (question.compare) return comparePoints(question, Array.isArray(answer) ? answer : []);
  if (question.tree) return branchPoints(question, Array.isArray(answer) ? answer : emptyBranchAnswers(question));
  if (question.correctAnswers) return pickedPoints(question.correctAnswers, Array.isArray(answer) ? answer : answer ? answer.split(PICKS) : []);
  return { earned: Number(answer !== undefined && answer === question.correctAnswer), total: 1 };
}

/**
 * A question with several right choices, scored per choice (owner, 2026-11-19): each right one ticked earns a share, each
 * wrong one ticked takes a share back, never below nothing; a right one left unticked earns nothing. The total is the
 * right choices, so a party pays the question its ten points in all (`share`).
 */
export function pickedPoints(right: readonly string[], picked: readonly string[]) {
  const ticked = new Set(picked);
  const hits = right.filter(value => ticked.has(value)).length;
  return { earned: Math.max(0, hits - (ticked.size - hits)), total: right.length };
}

/** What a question's points are worth in a party: one per thing asked, but a question of several right choices counts once in all. */
export const share = (question: ScoredQuestion, points: { earned: number; total: number }) =>
  question.correctAnswers && points.total ? points.earned / points.total : points.earned;

/**
 * A party's points (owner, 2026-11-19; sketch /mnt/project-files/quiz-lookup): ten for each thing asked that is answered
 * right, five when the player opened «ابحث عن الجواب» before answering, so one who knew stays ahead of one who looked.
 */
export const POINTS = 10;
export const LOOKED_POINTS = 5;
export const partyPoints = (earned: number, looked: boolean) => Math.round(earned * (looked ? LOOKED_POINTS : POINTS));
