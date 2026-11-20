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

/**
 * How far past what it shows the feed looks for things not seen yet, on the app and the website alike, and how many the
 * website asks the server for at a time. Never a limit: the feed goes on for as long as the reader scrolls (owner, 2026-11-18).
 */
export const FEED_AHEAD = 60;
/**
 * The farthest offset the website's feed API answers. It only keeps strangers from filling the server's caches with far
 * days; a reader would scroll for days to reach it, and the app's feed, which needs no server, has no such bound.
 */
export const FEED_FAR = 100 * FEED_AHEAD;

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
 * `keep`: items already on screen, which stay first and in place; only the rest are picked.
 */
export function freshPicks<T>(pick: (offset: number) => T | undefined, idOf: (item: T) => string, seen: Seen, count: number,
  { tries = count + FEED_AHEAD, since = visitStart(), prefer, keep = [] }: { tries?: number; since?: number; prefer?: (item: T) => boolean; keep?: T[] } = {}): T[] {
  if (keep.length >= count) return keep.slice(0, count);
  const need = count - keep.length;
  const liked: T[] = [];
  const fresh: T[] = [];
  const old: T[] = [];
  const taken = new Set(keep.map(idOf));
  for (let offset = 0; offset < tries && liked.length < need && (prefer || fresh.length < need); offset++) {
    const item = pick(offset);
    if (item === undefined || item === null) continue;
    const id = idOf(item);
    if (taken.has(id)) continue;
    taken.add(id);
    if (!isFresh(seen, id, since)) old.push(item);
    else (prefer?.(item) ? liked : fresh).push(item);
  }
  return [...keep, ...[...liked, ...fresh, ...old].slice(0, need)];
}

/**
 * `freshPicks` for a feed that grows: what `holder` gave last time stays first and in place, so cards on screen never move
 * or change as more come (looking further on can find fresher ones). A change in any of `reset` (a new visit, a new day, a
 * setting) picks afresh.
 */
export function growingPicks<T>(holder: { reset?: unknown[]; list: T[] }, reset: unknown[], pick: (offset: number) => T | undefined,
  idOf: (item: T) => string, seen: Seen, count: number, options: { tries?: number; since?: number; prefer?: (item: T) => boolean } = {}): T[] {
  const same = holder.reset?.length === reset.length && reset.every((value, at) => Object.is(value, holder.reset![at]));
  holder.reset = reset;
  holder.list = freshPicks(pick, idOf, seen, count, { ...options, keep: same ? holder.list.slice(0, count) : [] });
  return holder.list;
}

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
