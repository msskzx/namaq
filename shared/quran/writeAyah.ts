// Write quiz in recite mode (owner, 2026-11-13): the next ayah's words stay boxes in their places on the mushaf
// page, and the reader writes its first and last few words, one box each.
import { matchedWords } from '../quiz/branchAnswers';
import { normalizeWord } from './normalize';

/** How many words are written at each end of an ayah. */
export const WRITE_EACH = 3;

/** The words (by place in the ayah, from 0) to write: the first and last few, or all of a short ayah. */
export function writeTargets(count: number, each = WRITE_EACH): number[] {
  if (count <= each * 2) return Array.from({ length: count }, (_, i) => i);
  return [...Array.from({ length: each }, (_, i) => i), ...Array.from({ length: each }, (_, i) => count - each + i)];
}

/**
 * The most letters a word can be written with: its letters as spoken, a small alif written in full
 * (ٱلْكِتَـٰبُ → الكتاب). Writing that many moves on to the next box; a shorter spelling moves on with a space.
 */
export const maxLetters = (word: string) =>
  normalizeWord(word.replace(/[ويى]?ٰ/g, 'ا')).replace(/[^ء-ي]/g, '').length;

/** Typed letters only, as the box keeps them: no spaces, no tashkeel typed by the keyboard. */
export const typedLetters = (text: string) => text.replace(/\s+/g, '');

/**
 * Whether a typed word is this word, by the quiz leaves' rule: strict on the letters, forgiving tashkeel, hamza seats,
 * ة/ه, ى/ي and small letters. A typed آ counts as ا too, since the hamza on it is forgiven anyway (وبالآخرة).
 */
export const writtenRight = (typed: string, word: string) => matchedWords(typedLetters(typed).replace(/آ/g, 'ا'), [word]) === 1;
