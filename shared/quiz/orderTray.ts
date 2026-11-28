import { PICKS, picksOf } from './choiceKinds';

export type Tray = { boxes: (string | null)[]; at: number | null; back: string[] };

export const emptyTray = (count: number): Tray => ({ boxes: Array.from({ length: count }, () => null), at: count ? 0 : null, back: [] });

function nextEmpty(boxes: (string | null)[], from: number) {
  for (let i = 0; i < boxes.length; i++) {
    const at = (from + i) % boxes.length;
    if (boxes[at] === null) return at;
  }
  return null;
}

export function put(tray: Tray, value: string): Tray {
  if (tray.at === null || tray.boxes.includes(value)) return tray;
  const boxes = tray.boxes.map((box, i) => (i === tray.at ? value : box));
  return { boxes, at: nextEmpty(boxes, tray.at + 1), back: tray.back.filter(each => each !== value) };
}

export function tapBox(tray: Tray, at: number): Tray {
  const value = tray.boxes[at];
  if (value === null) return { ...tray, at };
  return { boxes: tray.boxes.map((box, i) => (i === at ? null : box)), at: tray.at ?? at, back: [value, ...tray.back] };
}

export const inTray = (choices: readonly string[], tray: Tray) => {
  const placed = new Set(tray.boxes.filter((box): box is string => box !== null));
  return [...tray.back.filter(value => !placed.has(value)), ...choices.filter(value => !placed.has(value) && !tray.back.includes(value))];
};

export const sentTray = (tray: Tray) => tray.boxes.map(box => box ?? '').join(PICKS);

export function trayOf(sent: string | undefined, count: number): Tray {
  const given = picksOf(sent);
  const boxes = Array.from({ length: count }, (_, i) => given[i] || null);
  return { boxes, at: nextEmpty(boxes, 0), back: [] };
}

export type BoxResult = { right: string; given: string | null; state: 'right' | 'wrong' | 'empty' };
export const trayResults = (right: readonly string[], sent: string | undefined): BoxResult[] => {
  const given = picksOf(sent);
  return right.map((value, i) => {
    const put = given[i] || null;
    return { right: value, given: put, state: put === null ? 'empty' : put === value ? 'right' : 'wrong' };
  });
};

export const boxNumbers = (choices: readonly string[]) => [...choices].map(Number).sort((a, b) => a - b);
