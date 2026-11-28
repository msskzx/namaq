import { num } from '../quran/arabicNumber';


export const HOLD_MS = 1500;
export const SLIDE_MS = 700;
export const END_MS = 3500;
export const PART_LIMIT_MS = 180_000;

export type Segment =
  | { kind: 'end'; start: number; end: number }
  | { kind: 'card'; card: number; start: number; end: number; ends: number[] }
  | { kind: 'slide'; from: number; to: number; start: number; end: number };

export const stepEnds = (times: number[]) => times.reduce<number[]>((list, ms) => [...list, (list[list.length - 1] ?? 0) + ms], []);

type Unplaced<S = Segment> = S extends Segment ? Omit<S, 'start' | 'end'> : never;

const reading = (ends: number[]) => ends[ends.length - 1] ?? 0;

export function videoTimeline(cards: number[][]): Segment[] {
  const segments: Segment[] = [];
  let at = 0;
  const add = (segment: Unplaced, ms: number) => { segments.push({ ...segment, start: at, end: at + ms } as Segment); at += ms; };
  cards.forEach((ends, card) => {
    if (card > 0) add({ kind: 'slide', from: card - 1, to: card }, SLIDE_MS);
    add({ kind: 'card', card, ends }, reading(ends) + HOLD_MS);
  });
  add({ kind: 'end' }, END_MS);
  return segments;
}

export const videoLength = (segments: Segment[]) => segments[segments.length - 1]?.end ?? 0;

export function segmentAt(segments: Segment[], t: number) {
  const segment = segments.find(item => t < item.end) ?? segments[segments.length - 1];
  return { segment, local: segment ? Math.max(0, t - segment.start) : 0 };
}

export function videoParts(cards: number[][], limit = PART_LIMIT_MS): number[][] {
  const parts: number[][] = [];
  let part: number[] = [];
  let length = 0;
  cards.forEach((ends, index) => {
    const own = reading(ends) + HOLD_MS;
    const added = part.length ? SLIDE_MS + own : own + END_MS;
    if (part.length && length + added > limit) { parts.push(part); part = []; length = 0; }
    length += part.length ? SLIDE_MS + own : own + END_MS;
    part.push(index);
  });
  if (part.length) parts.push(part);
  return parts;
}

export const partLengths = (cards: number[][]) => videoParts(cards).map(part => videoLength(videoTimeline(part.map(index => cards[index]))));

export function clock(ms: number) {
  const seconds = Math.round(ms / 1000);
  return `${num(Math.floor(seconds / 60))}:${num(seconds % 60).padStart(2, num(0))}`;
}
