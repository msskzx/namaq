// The compare quiz (owner, 2026-11-17): one compare card asked as its matrix, one ayah given whole and the other blank where
// it parts from it. Grading follows the tree quiz's leaf rule: the first two words of each blank are enough.
// Light on purpose: the party server grades with it (score.ts).
import { num } from '../quran/arabicNumber';
import type { Likeness } from '../quran/wordMatch';
import { LEAF_WORDS, matchedWords, rightWords, spoken, withoutRepeat } from './branchAnswers';
import type { Correction } from './feedback';
import { hintLetters, hintText, type Hints } from './hints';
import { SURAH_NAMES } from '../quran/surahNames';

export const COMPARE_QUIZ = 'COMPARE';

/** A word's likeness to the other ayah, coloured by the app-wide word-match rule. */
export type Tone = Likeness | 'related' | undefined;
/** One ayah of the card: its key, its words and each word's tone. */
export type CompareLine = { key: string; words: string[]; tones: Tone[] };
/** `blanks`: the word ranges [from, to) of the asked ayah that part from the shown one, each typed into one box. */
export type CompareAsk = { card: string; shown: CompareLine; asked: CompareLine; blanks: [number, number][] };

type Asking = { compare?: CompareAsk };

const names = SURAH_NAMES;
/** «يس ٥٣»: surah first, then ayah. */
export const compareLabel = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return `${names[surah]} ${num(ayah)}`; };

export const blankWords = (ask: CompareAsk, blank: number) => ask.asked.words.slice(...ask.blanks[blank]);

/** One row per blank: what was typed against its words, as the tree quiz's corrections. */
export function compareCorrections(ask: CompareAsk, typed: string[]): Correction[] {
  return ask.blanks.map(([from], index) => {
    const words = spoken(blankWords(ask, index));
    const text = withoutRepeat(typed[index] ?? '', words, spoken(ask.asked.words.slice(0, from)));
    const needed = Math.min(LEAF_WORDS, words.length);
    return { index, number: index + 1, node: { words: blankWords(ask, index), ayat: [ask.asked.key], children: [] }, typed: text,
      correct: matchedWords(text, words) >= needed, right: rightWords(text, words), needed };
  });
}

export function comparePoints(question: Asking, typed: string[]) {
  if (!question.compare) return { earned: 0, total: 0 };
  return { earned: compareCorrections(question.compare, typed).filter(row => row.correct).length, total: question.compare.blanks.length };
}

export const emptyCompareAnswers = (question: Asking) => question.compare?.blanks.map(() => '') ?? [];

/** One more letter of the first word in every blank still empty, as the tree quiz's bulb. */
export function addCompareHint(ask: CompareAsk, typed: string[], hints: Hints): Hints {
  const next = { ...hints };
  ask.blanks.forEach((_, index) => {
    const [first] = spoken(blankWords(ask, index));
    if ((typed[index] ?? '').trim() || !first) return;
    next[index] = Math.min((next[index] ?? 0) + 1, hintLetters(first).length);
  });
  return next;
}

export const compareHintsOf = (ask: CompareAsk, hints: Hints | undefined) => ask.blanks.map((_, index) => hintText(blankWords(ask, index), hints?.[index] ?? 0));

/** The asked ayah as pieces to draw: runs of given words, and each blank. */
export type ComparePiece = { given: number[] } | { blank: number };

export function comparePieces(ask: CompareAsk): ComparePiece[] {
  const pieces: ComparePiece[] = [];
  let at = 0;
  ask.blanks.forEach(([from, to], blank) => {
    if (from > at) pieces.push({ given: range(at, from) });
    pieces.push({ blank });
    at = to;
  });
  if (at < ask.asked.words.length) pieces.push({ given: range(at, ask.asked.words.length) });
  return pieces;
}

const range = (from: number, to: number) => Array.from({ length: to - from }, (_, i) => from + i);
