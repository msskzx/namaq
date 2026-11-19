// The written quizzes (متشابهات and the compare quiz) write their blanks in recite mode's boxes (owner, 2026-11-19): one box a
// word, as wide as the word, in its place on the line, typed through the one hidden field (useWriteBoxes). A blank's words
// enough to grade it are boxes; the rest of its words are recite mode's faint boxes. The quiz itself still keeps one text a
// blank (words joined by spaces), so grading, hints, parties and saved runs are unchanged.
import { LEAF_WORDS, spoken } from './branchAnswers';

/** A blank: its key in the quiz's answers (a tree node, or a compare blank), its spoken words, and how many are written. */
export type WriteBlank = { id: number; words: string[]; write: number };

/** A blank of `words` (signs included) where the first two spoken words are enough, or all of them (`whole`). */
export function writeBlank(id: number, words: string[], whole = false): WriteBlank {
  const said = spoken(words);
  return { id, words: said, write: whole ? said.length : Math.min(LEAF_WORDS, said.length) };
}

/** The boxes of all the blanks in a row: the words written, and where each blank's first box is. */
export function blankBoxes(blanks: WriteBlank[]) {
  const words: string[] = [];
  const first: number[] = [];
  for (const blank of blanks) {
    first.push(words.length);
    words.push(...blank.words.slice(0, blank.write));
  }
  return { words, asked: words.map((_, at) => at), first };
}

/**
 * A blank's text from its boxes: its words in order, up to the first empty box. A word written after an empty box is not
 * counted (grading reads the words from the first), so the empty box grades as the missing word it is.
 */
export function blankText(blank: WriteBlank, first: number, typed: Record<number, string>): string {
  const words = Array.from({ length: blank.write }, (_, at) => (typed[first + at] ?? '').trim());
  const gap = words.indexOf('');
  return (gap < 0 ? words : words.slice(0, gap)).join(' ');
}

/**
 * The boxes holding the blanks' texts (in the blanks' order): each word into its own box (a saved run, answers cleared, a
 * party's copy). Words past the boxes are left out: grading needs only the words the boxes ask.
 */
export function boxesOf(blanks: WriteBlank[], first: number[], texts: string[]): Record<number, string> {
  const typed: Record<number, string> = {};
  blanks.forEach((blank, index) => {
    const words = (texts[index] ?? '').trim().split(/\s+/).filter(Boolean);
    words.slice(0, blank.write).forEach((word, at) => { typed[first[index] + at] = word; });
  });
  return typed;
}
