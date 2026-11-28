import { branchNodes, spoken } from './branchAnswers';
import { isAsked, type ScoredQuestion } from './score';

export type Hints = Record<number, number>;

export const hintLetters = (word: string) => [...word.replace(/[ً-ٰٟۖ-ۭـ]/g, '').replace(/ٱ/g, 'ا')];

export function hintText(words: string[], letters: number) {
  const [first] = spoken(words);
  if (!letters || !first) return '';
  const all = hintLetters(first);
  return all.length > letters ? `${all.slice(0, letters).join('')}…` : all.join('');
}

export function addHint(question: ScoredQuestion, typed: string[], hints: Hints): Hints {
  if (!question.tree) return hints;
  const next = { ...hints };
  branchNodes(question.tree).forEach((node, index) => {
    const [first] = spoken(node.words);
    if (!isAsked(question, index) || (typed[index] ?? '').trim() || !first) return;
    next[index] = Math.min((next[index] ?? 0) + 1, hintLetters(first).length);
  });
  return next;
}

export const hintsOf = (question: ScoredQuestion, hints: Hints | undefined): string[] =>
  question.tree ? branchNodes(question.tree).map((node, index) => hintText(node.words, hints?.[index] ?? 0)) : [];
