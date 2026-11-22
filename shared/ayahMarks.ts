import { keyStore } from './storage';

/**
 * Ayat a reader forgot while reading or reciting, with how often, kept on this device for now. Saved ayat go to the shared bookmarks.
 * `step` counts the times the reader remembered it since it was last forgotten; until `due` it rests off the shelf.
 */
export type AyahMark = { forgot: number; at: number; step?: number; due?: number };
export type AyahMarks = Record<string, AyahMark>;

const NONE: AyahMarks = {};

function parse(raw: string | null): AyahMarks {
  const marks: AyahMarks = {};
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      for (const [key, value] of Object.entries(parsed)) {
        const mark = value as Partial<AyahMark> | null;
        if (/^[1-9]\d*:[1-9]\d*(?::(?:0|[1-9]\d*))?$/.test(key) && mark && Number(mark.forgot) > 0) {
          marks[key] = { forgot: Number(mark.forgot), at: Number(mark.at) || 0 };
          if (Number(mark.step) > 0) marks[key].step = Number(mark.step);
          if (Number(mark.due) > 0) marks[key].due = Number(mark.due);
        }
      }
    }
  } catch {}
  return Object.keys(marks).length ? marks : NONE;
}

const store = keyStore('ayah-forgot', parse);

export const readAyahMarks = store.read;
const write = (marks: AyahMarks) => store.write(JSON.stringify(marks));

const DAY = 86_400_000;
/** How long a remembered ayah rests before it comes back: 1 day, 3 days, a week, then a month every time after (owner, 2026-11-13). */
export const REST_DAYS = [1, 3, 7, 30];

export const markAyah = (key: string) => key.split(':').slice(0, 2).join(':');
export const markWord = (key: string) => key.split(':').length === 3 ? Number(key.split(':')[2]) : undefined;
export const wordMarkKey = (ayah: string, word: number) => `${ayah}:${word}`;

export function clearForgotten(key: string) {
  const marks = { ...readAyahMarks() };
  delete marks[key];
  write(marks);
}

/** Counts one more time this ayah was forgotten; it is due again now and its rests start over. */
export function markForgotten(key: string, now = Date.now()) {
  const marks = readAyahMarks();
  write({ ...marks, [key]: { forgot: (marks[key]?.forgot ?? 0) + 1, at: now } });
}

/** The reader remembered it: the ayah leaves the shelf for its next rest, each one longer than the last. */
export function rememberAyah(key: string, now = Date.now()) {
  const marks = readAyahMarks();
  const mark = marks[key];
  if (!mark) return;
  const step = (mark.step ?? 0) + 1;
  write({ ...marks, [key]: { ...mark, step, due: now + REST_DAYS[Math.min(step, REST_DAYS.length) - 1] * DAY } });
}

/** Puts an ayah's mark back as it was (`undefined`: no mark): a tick on a card taken back (owner, 2026-11-22). */
export function restoreMark(key: string, mark: AyahMark | undefined) {
  const marks = { ...readAyahMarks() };
  if (mark) marks[key] = mark;
  else delete marks[key];
  write(marks);
}

const isDue = (mark: AyahMark, now: number) => !mark.due || mark.due <= now;

/**
 * «نسيت» as one toggle (owner, 2026-11-19), and the reader's double tap set to it (owner, 2026-11-21): marks all due for
 * review are rested as remembered; otherwise the ones not due are marked forgotten. `keys`: an ayah, or its words under review.
 */
export function toggleForgotten(keys: string | string[], now = Date.now()) {
  const list = typeof keys === 'string' ? [keys] : keys;
  const due = readDueMarks(now);
  const remembered = list.every(key => due[key]);
  if (remembered) list.forEach(key => rememberAyah(key, now));
  else list.filter(key => !due[key]).forEach(key => markForgotten(key, now));
  /** Whether they are forgotten now. */
  return !remembered;
}

/** The ayat to review now: every forgotten ayah that is not resting. */
export function dueMarks(marks: AyahMarks, now = Date.now()): AyahMarks {
  const due = Object.entries(marks).filter(([, mark]) => isDue(mark, now));
  return due.length === Object.keys(marks).length ? marks : due.length ? Object.fromEntries(due) : NONE;
}

/** The forgotten ayat as the homepage shows them: the most often forgotten first, then the last one forgotten. */
export const mostForgotten = (marks: AyahMarks) =>
  Object.keys(marks).sort((a, b) => marks[b].forgot - marks[a].forgot || marks[b].at - marks[a].at);

export const subscribeAyahMarks = store.subscribe;

let dueCache: { stored: AyahMarks; keys: string; value: AyahMarks } | null = null;
/** The ayat due now, the same object while nothing changes, for `useSyncExternalStore` with `subscribeDueMarks`. */
export function readDueMarks(now = Date.now()) {
  const stored = readAyahMarks();
  const value = dueMarks(stored, now);
  const keys = Object.keys(value).join(',');
  if (dueCache && dueCache.stored === stored && dueCache.keys === keys) return dueCache.value;
  dueCache = { stored, keys, value };
  return value;
}

/** Like `subscribeAyahMarks`, and also checks every minute, so a page left open sees a rested ayah come back. */
export function subscribeDueMarks(listener: () => void) {
  const off = store.subscribe(listener);
  const timer = setInterval(listener, 60_000);
  return () => { off(); clearInterval(timer); };
}
export const serverAyahMarks = () => NONE;

/** Bookmark id and link for one saved ayah. */
export const ayahBookmarkId = (key: string) => `ayah:${key}`;
/** An ayah's page on the website; a forgotten word's key opens its ayah. */
export const ayahHref = (key: string) => `/quran/read/ayah/${markAyah(key).replace(':', '/')}`;
