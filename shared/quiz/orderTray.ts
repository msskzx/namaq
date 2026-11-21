// «رتّب الجزء كله» (owner, 2026-11-21; sketch /mnt/project-files/surah-order-tray/sketch-dark.png): a long order filled into
// numbered boxes from a tray of names instead of dragged. Light, with no Quran text, for the screens of the app and the website.
import { PICKS, picksOf } from './choiceKinds';

/** The boxes as filled (null for empty), the box the next name goes to (null when none is empty), and the names sent back, last first. */
export type Tray = { boxes: (string | null)[]; at: number | null; back: string[] };

export const emptyTray = (count: number): Tray => ({ boxes: Array.from({ length: count }, () => null), at: count ? 0 : null, back: [] });

/** The first empty box from `from` on, wrapping round to the start; null when every box is filled. */
function nextEmpty(boxes: (string | null)[], from: number) {
  for (let i = 0; i < boxes.length; i++) {
    const at = (from + i) % boxes.length;
    if (boxes[at] === null) return at;
  }
  return null;
}

/** A name tapped in the tray: it goes into the lit box, and the next empty box after it lights. */
export function put(tray: Tray, value: string): Tray {
  if (tray.at === null || tray.boxes.includes(value)) return tray;
  const boxes = tray.boxes.map((box, i) => (i === tray.at ? value : box));
  return { boxes, at: nextEmpty(boxes, tray.at + 1), back: tray.back.filter(each => each !== value) };
}

/**
 * A box tapped: a filled one sends its name back to the front of the tray (the lit box stays where it is, or lights this
 * one when none was); an empty one becomes the one the next name goes to, so the reader fills what he knows first.
 */
export function tapBox(tray: Tray, at: number): Tray {
  const value = tray.boxes[at];
  if (value === null) return { ...tray, at };
  return { boxes: tray.boxes.map((box, i) => (i === at ? null : box)), at: tray.at ?? at, back: [value, ...tray.back] };
}

/** The names still in the tray: the ones sent back first, then the rest in the question's shuffled order. */
export const inTray = (choices: readonly string[], tray: Tray) => {
  const placed = new Set(tray.boxes.filter((box): box is string => box !== null));
  return [...tray.back.filter(value => !placed.has(value)), ...choices.filter(value => !placed.has(value) && !tray.back.includes(value))];
};

/** The order as it is sent, an empty box as nothing (owner, 2026-11-21: «تحقق» works with boxes left empty). */
export const sentTray = (tray: Tray) => tray.boxes.map(box => box ?? '').join(PICKS);

/** A tray from an order sent before (a party's draft): the boxes as they were, the lit box the first empty one. */
export function trayOf(sent: string | undefined, count: number): Tray {
  const given = picksOf(sent);
  const boxes = Array.from({ length: count }, (_, i) => given[i] || null);
  return { boxes, at: nextEmpty(boxes, 0), back: [] };
}

/** Each box once checked: right, wrong (with what was put there), or left empty. */
export type BoxResult = { right: string; given: string | null; state: 'right' | 'wrong' | 'empty' };
export const trayResults = (right: readonly string[], sent: string | undefined): BoxResult[] => {
  const given = picksOf(sent);
  return right.map((value, i) => {
    const put = given[i] || null;
    return { right: value, given: put, state: put === null ? 'empty' : put === value ? 'right' : 'wrong' };
  });
};

/** The boxes' labels before the answer: each surah's number in the mushaf, which are the choices' values in order. */
export const boxNumbers = (choices: readonly string[]) => [...choices].map(Number).sort((a, b) => a - b);
