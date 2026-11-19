import { wordMarkKey } from '../ayahMarks';

/**
 * What the reader's long press selects (owner, 2026-11-19): an ayah, a word in it, or several words dragged over after
 * the long press. It is never saved; it is only what the menu's actions act on. The long press opens the ayah's menu
 * with the pressed word lit, and a tab above the menu switches to the word's (or words') own actions.
 * Words count from 0 in their ayah, the ۞ sign not counted (the app's and the website's `data-at`).
 */
export type Selection = { key: string; from: number; to: number };
export type Scope = 'ayah' | 'word' | 'words';

/** The selection from the pressed word to the one the finger is on now, whichever way it went. */
export const selectionOf = (key: string, anchor: number, now = anchor): Selection => ({ key, from: Math.min(anchor, now), to: Math.max(anchor, now) });

/** The word side of the selection: one word or several. */
export const wordScope = (selection: Selection): Exclude<Scope, 'ayah'> => (selection.to > selection.from ? 'words' : 'word');

/** The tab's two names, the ayah's and the words'. */
export const SCOPE_NAMES: Record<Scope, string> = { ayah: 'الآية', word: 'الكلمة', words: 'الكلمات' };

/** The places in the ayah the selection holds. */
export const selectedWords = ({ from, to }: Selection) => Array.from({ length: to - from + 1 }, (_, at) => from + at);

/** What «نسيت» marks: the ayah, or each selected word on its own, so the review asks each word as its own blank. */
export const forgotKeys = (scope: Scope, selection: Selection) =>
  scope === 'ayah' ? [selection.key] : selectedWords(selection).map(word => wordMarkKey(selection.key, word));

/** Every key is already forgotten, so «نسيت» lets them go (the word's old «تراجع»); otherwise it marks them. */
export const allForgotten = (keys: string[], marks: Record<string, unknown>) => keys.length > 0 && keys.every(key => !!marks[key]);

/** The selected words as text, for copying and sharing. */
export const selectedText = (words: string[], selection: Selection) => words.slice(selection.from, selection.to + 1).join(' ');

/** «نسيت» and its label for each selection, the one forgotten button (owner, 2026-11-19: no second button, no pop-up). */
export function forgotLabel(scope: Scope, times: number, undo: boolean) {
  if (undo) return scope === 'words' ? 'تذكّرت هذه الكلمات' : 'تذكّرت هذه الكلمة';
  if (scope === 'ayah') return times ? 'نسيت الآية مجددًا' : 'نسيت الآية';
  return scope === 'words' ? 'نسيت هذه الكلمات' : 'نسيت الكلمة';
}

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
