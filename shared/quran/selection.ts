import { wordMarkKey } from '../ayahMarks';

export type Selection = { key: string; from: number; to: number };

export const selectionOf = (key: string, anchor: number, now = anchor): Selection => ({ key, from: Math.min(anchor, now), to: Math.max(anchor, now) });

export const inSelection = (selection: Selection | undefined | null, key: string | null, word: number | undefined) =>
  !!selection && key === selection.key && word !== undefined && word >= selection.from && word <= selection.to;

export const isPhrase = (selection: Selection) => selection.to > selection.from;

export const selectedWords = ({ from, to }: Selection) => Array.from({ length: to - from + 1 }, (_, at) => from + at);

export const wordKeys = (selection: Selection) => selectedWords(selection).map(word => wordMarkKey(selection.key, word));

export const isForgotten = (keys: string[], due: Record<string, unknown>) => keys.length > 0 && keys.every(key => !!due[key]);

export const forgotToggle = (keys: string[], due: Record<string, unknown>) =>
  isForgotten(keys, due) ? { rest: keys, forget: [] } : { rest: [], forget: keys.filter(key => !due[key]) };

export const selectedText = (words: string[], selection: Selection) => words.slice(selection.from, selection.to + 1).join(' ');

export const NOTE_NAME = 'دوّن';

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
