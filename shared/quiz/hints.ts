// Hints in the tree quiz (owner, 2026-11-13): each tap on the bulb shows one more letter of the first word in every
// leaf still empty, faded in its box. A hint costs nothing; the review marks the leaves that had one.
import { branchNodes } from './branchAnswers';
import { isAsked, type ScoredQuestion } from './score';

/** Letters revealed so far, by node index. */
export type Hints = Record<number, number>;

/** A word's letters as the mushaf writes them, without tashkeel or the small signs; ٱ is a plain alif. */
export const hintLetters = (word: string) => [...word.replace(/[ً-ٰٟۖ-ۭـ]/g, '').replace(/ٱ/g, 'ا')];

/** What a hinted box shows: the first letters of its first word, and … while more are left. */
export function hintText(words: string[], letters: number) {
  if (!letters || !words.length) return '';
  const all = hintLetters(words[0]);
  return all.length > letters ? `${all.slice(0, letters).join('')}…` : all.join('');
}

/** One more letter in every asked node still empty, up to the whole first word. */
export function addHint(question: ScoredQuestion, typed: string[], hints: Hints): Hints {
  if (!question.tree) return hints;
  const next = { ...hints };
  branchNodes(question.tree).forEach((node, index) => {
    if (!isAsked(question, index) || (typed[index] ?? '').trim() || !node.words.length) return;
    next[index] = Math.min((next[index] ?? 0) + 1, hintLetters(node.words[0]).length);
  });
  return next;
}

/** The hint each node shows, for drawing the boxes. */
export const hintsOf = (question: ScoredQuestion, hints: Hints | undefined): string[] =>
  question.tree ? branchNodes(question.tree).map((node, index) => hintText(node.words, hints?.[index] ?? 0)) : [];
