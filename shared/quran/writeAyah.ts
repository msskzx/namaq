import { matchedWords } from '../quiz/branchAnswers';
import { normalizeWord } from './normalize';

export const WRITE_EACH = 3;

export function writeTargets(count: number, each = WRITE_EACH): number[] {
  if (count <= each * 2) return Array.from({ length: count }, (_, i) => i);
  return [...Array.from({ length: each }, (_, i) => i), ...Array.from({ length: each }, (_, i) => count - each + i)];
}

export const wordTargets = (words: string[], each = WRITE_EACH): number[] => {
  const spoken = words.flatMap((word, at) => maxLetters(word) ? [at] : []);
  return writeTargets(spoken.length, each).map(at => spoken[at]);
};

const MARKS = '[\u064B-\u065F\u06E1\u06E2\u06ED]*';
const SEATED_HAMZA = new RegExp(`(.)${MARKS}\u0640(${MARKS})[\u0654\u0655](${MARKS})(?=(.?))`, 'g');

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

export const keepsSpace = (typed: string, word: string) =>
  /^[وف]?[يه]ا$/.test(typedLetters(typed)) && /^([وف]\u064E?)?[يه]\u064E?\u0670/.test(word) && maxLetters(word) > typedLetters(typed).length;

export const typedLetters = (text: string) => text.replace(/\s+/g, '');

export const writtenRight = (typed: string, word: string) => matchedWords(typedLetters(typed).replace(/آ/g, 'ا'), [word]) === 1;

export type Boxes = { typed: Record<number, string>; current: number | null };

export const freshBoxes = (asked: number[]): Boxes => ({ typed: {}, current: asked.length ? asked[0] : null });

export function nextBox(boxes: Boxes, asked: number[]): { boxes: Boxes; finished: boolean } {
  const at = boxes.current === null ? -1 : asked.indexOf(boxes.current);
  return at + 1 < asked.length ? { boxes: { ...boxes, current: asked[at + 1] }, finished: false } : { boxes, finished: true };
}

export function clearLastBox(boxes: Boxes, asked: number[]): Boxes | null {
  const last = [...asked].reverse().find(at => boxes.typed[at]);
  if (last === undefined) return null;
  const typed = { ...boxes.typed };
  delete typed[last];
  return { typed, current: last };
}

export function previousBox(boxes: Boxes, asked: number[]): Boxes | null {
  const at = boxes.current === null ? -1 : asked.indexOf(boxes.current);
  return at > 0 ? { ...boxes, current: asked[at - 1] } : null;
}

export function typeInBox(boxes: Boxes, asked: number[], words: string[], text: string, composing = false): { boxes: Boxes; finished: boolean } {
  if (boxes.current === null) return { boxes, finished: false };
  const word = words[boxes.current];
  const letters = typedLetters(text);
  const filled = { ...boxes, typed: { ...boxes.typed, [boxes.current]: letters } };
  const done = !composing && ((/\s/.test(text) && !keepsSpace(text, word)) || letters.length >= maxLetters(word));
  return done ? nextBox(filled, asked) : { boxes: filled, finished: false };
}

export function gradeWritten(asked: number[], typed: Record<number, string>, words: string[]) {
  const right = asked.filter(at => writtenRight(typed[at] ?? '', words[at]));
  const wrong = asked.filter(at => !right.includes(at));
  return { right, wrong, typed: Object.fromEntries(wrong.map(at => [at, typed[at] ?? ''])) as Record<number, string> };
}

export const PEN_RULES = ['ends', 'whole'] as const;
export type PenRule = (typeof PEN_RULES)[number];
export const isPenRule = (value: unknown): value is PenRule => (PEN_RULES as readonly unknown[]).includes(value);

export const penTargets = (words: string[], rule: PenRule): number[] =>
  rule === 'whole' ? words.flatMap((word, at) => (maxLetters(word) ? [at] : [])) : wordTargets(words);

export type PageAsk = { shows?: number; recite?: boolean; title?: 'hidden' | 'shown' };

export function shownCut(key: string, pageWords: string[], shows: number | undefined): number {
  if (shows === undefined) return pageWords.length;
  if (shows <= 0) return 0;
  const spoken = pageWords.flatMap((word, at) => (maxLetters(word) ? [at] : []));
  return (spoken[shows - 1] ?? pageWords.length - 1) + 1;
}
