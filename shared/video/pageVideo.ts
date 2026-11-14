import { num } from '../quran/arabicNumber';

/**
 * A video of one card or several in a row: each card read along, a short slide to the next card, and the end frame with the emblem.
 * No title frame (owner, 2026-11-14): the emblem shows only at the end, and the pair's name stays on top while the cards play.
 * The timing lives here so the website and the app record the same video; their recorders only draw what it says.
 */

/** Milliseconds: the stay on a card after its last word, the slide to the next card, the end frame. */
export const HOLD_MS = 1500;
export const SLIDE_MS = 700;
export const END_MS = 3500;
/** Reels run up to about 3 minutes, so a longer video is split into parts no longer than this. */
export const PART_LIMIT_MS = 180_000;

export type Segment =
  | { kind: 'end'; start: number; end: number }
  /** `ends`: where each step of the card's reading ends, from the card's start. */
  | { kind: 'card'; card: number; start: number; end: number; ends: number[] }
  | { kind: 'slide'; from: number; to: number; start: number; end: number };

/** Where each step ends, from the card's start. */
export const stepEnds = (times: number[]) => times.reduce<number[]>((list, ms) => [...list, (list[list.length - 1] ?? 0) + ms], []);

type Unplaced<S = Segment> = S extends Segment ? Omit<S, 'start' | 'end'> : never;

const reading = (ends: number[]) => ends[ends.length - 1] ?? 0;

/** The segments of one video: the cards in turn, then the end frame. */
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

/** The segment playing at `t`, and how far into it. */
export function segmentAt(segments: Segment[], t: number) {
  const segment = segments.find(item => t < item.end) ?? segments[segments.length - 1];
  return { segment, local: segment ? Math.max(0, t - segment.start) : 0 };
}

/** The cards in parts, in order, each part's video within `limit` with its end frame. A card is never cut; one longer than the limit is a part alone. */
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

/** How long each part's video runs, for the picked cards. */
export const partLengths = (cards: number[][]) => videoParts(cards).map(part => videoLength(videoTimeline(part.map(index => cards[index]))));

/** A length as minutes and seconds in Arabic digits: «٢:٠٥». */
export function clock(ms: number) {
  const seconds = Math.round(ms / 1000);
  return `${num(Math.floor(seconds / 60))}:${num(seconds % 60).padStart(2, num(0))}`;
}
