import { wordMarkKey } from '../ayahMarks';

/**
 * What the reader's long press selects (owner, 2026-11-19): the pressed word, or several words the finger dragged over
 * after the long press, inside the ayah whose menu opens. It is never saved; «نسيت» and «نسخ» ask, in a bubble, whether
 * they act on the ayah or on it. Words count from 0 in their ayah, the ۞ sign not counted (the app's and the website's
 * `data-at`).
 */
export type Selection = { key: string; from: number; to: number };

/** The selection from the pressed word to the one the finger is on now, whichever way it went. */
export const selectionOf = (key: string, anchor: number, now = anchor): Selection => ({ key, from: Math.min(anchor, now), to: Math.max(anchor, now) });

/** Whether a touch on `key`'s word `word` lands on the selected words (a double tap there acts on them, owner 2026-11-21). */
export const inSelection = (selection: Selection | undefined | null, key: string | null, word: number | undefined) =>
  !!selection && key === selection.key && word !== undefined && word >= selection.from && word <= selection.to;

/** Several words, not one. */
export const isPhrase = (selection: Selection) => selection.to > selection.from;

/** The places in the ayah the selection holds. */
export const selectedWords = ({ from, to }: Selection) => Array.from({ length: to - from + 1 }, (_, at) => from + at);

/** Each selected word's forgotten mark: the review asks each word as its own blank. */
export const wordKeys = (selection: Selection) => selectedWords(selection).map(word => wordMarkKey(selection.key, word));

/**
 * «نسيت» is one bulb toggle for each choice in its bubble (owner, 2026-11-19): the keys are forgotten when every one of
 * them is due for review, and a tap then rests them all as remembered; otherwise a tap marks them forgotten.
 */
export const isForgotten = (keys: string[], due: Record<string, unknown>) => keys.length > 0 && keys.every(key => !!due[key]);

/** What a tap on one of those bulbs does: rest every key, or mark forgotten the ones not already due (no second count). */
export const forgotToggle = (keys: string[], due: Record<string, unknown>) =>
  isForgotten(keys, due) ? { rest: keys, forget: [] } : { rest: [], forget: keys.filter(key => !due[key]) };

/** The selected words as text, for copying. */
export const selectedText = (words: string[], selection: Selection) => words.slice(selection.from, selection.to + 1).join(' ');

/** The reader's note on an ayah: «دوّن» (owner, 2026-11-19; it was «تأمّل»). */
export const NOTE_NAME = 'دوّن';

/** Which box (the words' boxes, in the same order as the words) holds the point, or the nearest one on the nearest line. */
export function wordAtPoint(boxes: ({ x: number; y: number; w: number; h: number } | null)[], x: number, y: number) {
  let best = -1, bestLine = Infinity, bestSide = Infinity;
  boxes.forEach((box, at) => {
    if (!box) return;
    const line = y < box.y ? box.y - y : y > box.y + box.h ? y - box.y - box.h : 0;
    const side = x < box.x ? box.x - x : x > box.x + box.w ? x - box.x - box.w : 0;
    if (line < bestLine || (line === bestLine && side < bestSide)) { best = at; bestLine = line; bestSide = side; }
  });
  return best < 0 ? null : best;
}
