import { keyStore } from './storage';

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

export const FEED_AHEAD = 60;
export const FEED_FAR = 100 * FEED_AHEAD;

const AWAY_MS = 30 * 60_000;
let visit = Date.now();
const visitListeners = new Set<() => void>();
export const subscribeVisit = (listener: () => void) => {
  visitListeners.add(listener);
  return () => { visitListeners.delete(listener); };
};
export const serverVisit = () => 0;
let leftAt: number | null = null;
export const visitStart = () => visit;
export function leftVisit(now = Date.now()) { leftAt = now; }
export function backToVisit(now = Date.now()) {
  if (leftAt !== null && now - leftAt >= AWAY_MS) {
    visit = now;
    visitListeners.forEach(listener => listener());
  }
  leftAt = null;
}
export function newVisit(now = Date.now()) {
  visit = now;
  leftAt = null;
  visitListeners.forEach(listener => listener());
}

export function markFeedSeen(ids: string[], now = Date.now()) {
  const seen = feed.read();
  const fresh = ids.filter(id => !(id in seen));
  if (fresh.length) feed.write(JSON.stringify({ ...seen, ...Object.fromEntries(fresh.map(id => [id, now])) }));
}

export const isFresh = (seen: Seen, id: string, since = visitStart()) => !(id in seen) || seen[id] >= since;

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

export function growingPicks<T>(holder: { reset?: unknown[]; list: T[] }, reset: unknown[], pick: (offset: number) => T | undefined,
  idOf: (item: T) => string, seen: Seen, count: number, options: { tries?: number; since?: number; prefer?: (item: T) => boolean } = {}): T[] {
  const same = holder.reset?.length === reset.length && reset.every((value, at) => Object.is(value, holder.reset![at]));
  holder.reset = reset;
  holder.list = freshPicks(pick, idOf, seen, count, { ...options, keep: same ? holder.list.slice(0, count) : [] });
  return holder.list;
}

export const hasSavedCard = (slot: number) => slot > 0 && slot % 2 === 0;

export function savedOfSlot<T extends { savedAt: number }>(items: readonly T[], day: number, slot: number): T | undefined {
  const turn = slot / 2 - 1;
  if (!hasSavedCard(slot) || turn >= items.length) return undefined;
  const newest = [...items].sort((a, b) => b.savedAt - a.savedAt);
  return newest[(((day + turn) % newest.length) + newest.length) % newest.length];
}
