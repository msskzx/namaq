import { keyStore } from './storage';

/**
 * What the home feed has shown on this device, for good (owner, 2026-11-13): each pair's or tree's id with when (ms) it was first shown.
 * The feed skips what was shown before this visit, so it brings something new; what it showed in this visit stays, so the feed holds still
 * while it is open. Once everything was seen, it starts again from the seen ones. Nothing here is ever counted or shown.
 */
export type Seen = Record<string, number>;

const NONE: Seen = {};

function parse(raw: string | null): Seen {
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return NONE;
    const seen: Seen = {};
    for (const [id, day] of Object.entries(parsed)) if (Number.isFinite(day)) seen[id] = Number(day);
    return Object.keys(seen).length ? seen : NONE;
  } catch {
    return NONE;
  }
}

const feed = keyStore('feed-seen', parse);
export const readFeedSeen = feed.read;
export const subscribeFeedSeen = feed.subscribe;
export const serverFeedSeen = () => NONE;

/** How far the feed looks ahead for things not seen yet, on the app and the website alike; «more» stops there. */
export const FEED_AHEAD = 60;

/** Away this long (app in the background, tab hidden), coming back starts a new visit. */
const AWAY_MS = 30 * 60_000;
let visit = Date.now();
const visitListeners = new Set<() => void>();
export const subscribeVisit = (listener: () => void) => {
  visitListeners.add(listener);
  return () => { visitListeners.delete(listener); };
};
export const serverVisit = () => 0;
let leftAt: number | null = null;
/** When this visit began: what was first shown after it still counts as new, so the open feed holds still. */
export const visitStart = () => visit;
/** The app went to the background or the tab was hidden. */
export function leftVisit(now = Date.now()) { leftAt = now; }
/** Back again: after a long time away, a new visit begins, and what was shown before counts as seen. */
export function backToVisit(now = Date.now()) {
  if (leftAt !== null && now - leftAt >= AWAY_MS) {
    visit = now;
    visitListeners.forEach(listener => listener());
  }
  leftAt = null;
}
/** A new visit now, asked for (home pulled down to refresh): what was shown before counts as seen. */
export function newVisit(now = Date.now()) {
  visit = now;
  leftAt = null;
  visitListeners.forEach(listener => listener());
}

/** Notes the ids as shown now; ids shown before keep their first time. */
export function markFeedSeen(ids: string[], now = Date.now()) {
  const seen = feed.read();
  const fresh = ids.filter(id => !(id in seen));
  if (fresh.length) feed.write(JSON.stringify({ ...seen, ...Object.fromEntries(fresh.map(id => [id, now])) }));
}

/** New to the reader: never shown, or first shown in this visit. */
export const isFresh = (seen: Seen, id: string, since = visitStart()) => !(id in seen) || seen[id] >= since;

/**
 * `count` items for the feed, walking `pick(0)`, `pick(1)`… and keeping the fresh ones, without repeats.
 * With `prefer` (the «قدّم ما أحفظه» setting), fresh items it likes come first, the rest after, each in walking order.
 * When too few are fresh (everything was seen), the rest are filled from the seen ones, so the feed starts over.
 */
export function freshPicks<T>(pick: (offset: number) => T | undefined, idOf: (item: T) => string, seen: Seen, count: number,
  { tries = FEED_AHEAD, since = visitStart(), prefer }: { tries?: number; since?: number; prefer?: (item: T) => boolean } = {}): T[] {
  const liked: T[] = [];
  const fresh: T[] = [];
  const old: T[] = [];
  const taken = new Set<string>();
  for (let offset = 0; offset < tries && liked.length < count && (prefer || fresh.length < count); offset++) {
    const item = pick(offset);
    if (item === undefined || item === null) continue;
    const id = idOf(item);
    if (taken.has(id)) continue;
    taken.add(id);
    if (!isFresh(seen, id, since)) old.push(item);
    else (prefer?.(item) ? liked : fresh).push(item);
  }
  return [...liked, ...fresh, ...old].slice(0, count);
}

/**
 * The stories row: when each circle was last opened (ms), kept for good. A circle's ring lights when its content is newer than that
 * (a new juz day, an ayah newly due, a new save or note).
 */
export type StoriesOpened = Record<string, number>;
const stories = keyStore('stories-opened', raw => parse(raw) as StoriesOpened);
export const readStoriesOpened = stories.read;
export const subscribeStoriesOpened = stories.subscribe;
export const serverStoriesOpened = () => NONE as StoriesOpened;
export function markStoryOpened(id: string, now = Date.now()) {
  stories.write(JSON.stringify({ ...stories.read(), [id]: now }));
}
/** Whether a circle has something it has not shown: content dated `newest` (ms) after it was last opened. */
export const storyIsNew = (opened: StoriesOpened, id: string, newest: number | null | undefined) => !!newest && newest > (opened[id] ?? 0);

/** The stories row's circles, right to left. */
export const STORIES = ['juz', 'forgotten', 'saved', 'notes', 'prophets'] as const;
export type StoryId = (typeof STORIES)[number];

/**
 * When each circle's content last changed (ms): today's juz from local midnight, an ayah from when it came due (or was forgotten),
 * a save or note from when it was made. The prophets circle lights only until it is first opened.
 */
export function storyTimes({ due, saved, notes, now = Date.now() }: { due: Record<string, { at: number; due?: number }>; saved: { savedAt: number }[]; notes: Record<string, { at: number }>; now?: number }): Record<StoryId, number | null> {
  const latest = (times: number[]) => (times.length ? Math.max(...times) : null);
  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);
  return {
    juz: midnight.getTime(),
    forgotten: latest(Object.values(due).map(mark => mark.due ?? mark.at)),
    saved: latest(saved.map(item => item.savedAt)),
    notes: latest(Object.values(notes).map(note => note.at)),
    prophets: 1,
  };
}

/** The batches that carry a prophets card (shared/quran/prophets/storyGroup.ts): every other one after the first. */
export const hasStoryCard = (slot: number) => slot % 2 === 1;

/** The batches that carry a saved card (owner, 2026-11-14: saved cards come up in the feed now and then): every other one from the third. */
export const hasSavedCard = (slot: number) => slot > 0 && slot % 2 === 0;

/**
 * The saved item the card in batch `slot` shows on a day: each saved item once in a visit, newest first, starting one further
 * on each day. Pass the list as it was when the visit began, so saving or unsaving does not move the cards on screen.
 */
export function savedOfSlot<T extends { savedAt: number }>(items: readonly T[], day: number, slot: number): T | undefined {
  const turn = slot / 2 - 1;
  if (!hasSavedCard(slot) || turn >= items.length) return undefined;
  const newest = [...items].sort((a, b) => b.savedAt - a.savedAt);
  return newest[(((day + turn) % newest.length) + newest.length) % newest.length];
}
