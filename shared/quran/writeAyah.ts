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

/** The words of an ayah to write, by place: as writeTargets, past signs that are no words (the ۞ opening a quarter). */
export const wordTargets = (words: string[], each = WRITE_EACH): number[] => {
  const spoken = words.flatMap((word, at) => maxLetters(word) ? [at] : []);
  return writeTargets(spoken.length, each).map(at => spoken[at]);
};

const MARKS = '[\u064B-\u065F\u06E1\u06E2\u06ED]*';
const SEATED_HAMZA = new RegExp(`(.)${MARKS}\u0640(${MARKS})[\u0654\u0655](${MARKS})(?=(.?))`, 'g');

/**
 * The most letters a word can be written with: its letters as spoken, with the letters the mushaf writes small or
 * leaves out written in full as people type them: a small alif (ٱلْكِتَـٰبُ → الكتاب), a hamza on a tatweel
 * (شَيۡـٔٗا → شيئا, سَيِّـَٔاتِ → سيئات, but بِـَٔايَٰتِ → بآيات), the small ya, waw and noon (إِبۡرَٰهِـۧمَ → إبراهيم,
 * دَاوُۥدَ → داوود, نُـۨجِي → ننجي) except the pronoun's (لَهُۥ, بِهِۦ). Writing that many moves on to the next box;
 * a shorter spelling moves on with a space.
 */
export const maxLetters = (word: string) =>
  normalizeWord(word
    .replace(/[ويى]?\u0670/g, 'ا')
    .replace(SEATED_HAMZA, (_, before: string, ahead: string, after: string, next: string) =>
      `${before}${ahead + after === '\u064E' && next === 'ا' && before !== 'ي' ? '' : 'ء'}`)
    .replace(/\u06E7/g, 'ي')
    .replace(/\u06E8/g, 'ن')
    .replace(new RegExp(`([\u0621-\u0646\u0648-\u064A])(${MARKS})([\u06E5\u06E6])`, 'g'), (_, letter: string, marks: string, small: string) =>
      `${letter}${marks}${small === '\u06E5' ? 'و' : 'ي'}`))
    .replace(/[^ء-ي]/g, '').length;

/** A space after a vocative يا or ها keeps the box: the mushaf joins it to the next word (يَٰقَوۡمِ), people type it apart. */
export const keepsSpace = (typed: string, word: string) =>
  /^[وف]?[يه]ا$/.test(typedLetters(typed)) && /^([وف]\u064E?)?[يه]\u064E?\u0670/.test(word) && maxLetters(word) > typedLetters(typed).length;

/** Typed letters only, as the box keeps them: no spaces, no tashkeel typed by the keyboard. */
export const typedLetters = (text: string) => text.replace(/\s+/g, '');

/**
 * Whether a typed word is this word, by the quiz leaves' rule: strict on the letters, forgiving tashkeel, hamza seats,
 * ة/ه, ى/ي and small letters. A typed آ counts as ا too, since the hamza on it is forgiven anyway (وبالآخرة).
 */
export const writtenRight = (typed: string, word: string) => matchedWords(typedLetters(typed).replace(/آ/g, 'ا'), [word]) === 1;

/** What the write boxes hold: the letters typed in each (by word place) and the box being written. */
export type Boxes = { typed: Record<number, string>; current: number | null };

/** Empty boxes, the first one being written. */
export const freshBoxes = (asked: number[]): Boxes => ({ typed: {}, current: asked.length ? asked[0] : null });

/** On to the box after the one being written; `finished` when it was the last, so the ayah is checked. */
export function nextBox(boxes: Boxes, asked: number[]): { boxes: Boxes; finished: boolean } {
  const at = boxes.current === null ? -1 : asked.indexOf(boxes.current);
  return at + 1 < asked.length ? { boxes: { ...boxes, current: asked[at + 1] }, finished: false } : { boxes, finished: true };
}

/** Back to the box before (a Backspace in an empty box), or null on the first one. */
export function previousBox(boxes: Boxes, asked: number[]): Boxes | null {
  const at = boxes.current === null ? -1 : asked.indexOf(boxes.current);
  return at > 0 ? { ...boxes, current: asked[at - 1] } : null;
}

/**
 * The hidden field changed while writing a box: the box keeps the typed letters, and a space (not one a vocative keeps)
 * or a full box moves on to the next. `composing` (a keyboard still composing a letter) never moves on.
 */
export function typeInBox(boxes: Boxes, asked: number[], words: string[], text: string, composing = false): { boxes: Boxes; finished: boolean } {
  if (boxes.current === null) return { boxes, finished: false };
  const word = words[boxes.current];
  const letters = typedLetters(text);
  const filled = { ...boxes, typed: { ...boxes.typed, [boxes.current]: letters } };
  const done = !composing && ((/\s/.test(text) && !keepsSpace(text, word)) || letters.length >= maxLetters(word));
  return done ? nextBox(filled, asked) : { boxes: filled, finished: false };
}

/** The written words graded: right and wrong places, and what was typed for each wrong one. */
export function gradeWritten(asked: number[], typed: Record<number, string>, words: string[]) {
  const right = asked.filter(at => writtenRight(typed[at] ?? '', words[at]));
  const wrong = asked.filter(at => !right.includes(at));
  return { right, wrong, typed: Object.fromEntries(wrong.map(at => [at, typed[at] ?? ''])) as Record<number, string> };
}
