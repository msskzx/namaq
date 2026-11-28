import { keyStore } from './storage';
import { reportError } from './errors';

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
  } catch (error) { reportError('ayah marks: read', error); }
  return Object.keys(marks).length ? marks : NONE;
}

const store = keyStore('ayah-forgot', parse);

export const readAyahMarks = store.read;
const write = (marks: AyahMarks) => store.write(JSON.stringify(marks));

const DAY = 86_400_000;
export const REST_DAYS = [1, 3, 7, 30];

export const markAyah = (key: string) => key.split(':').slice(0, 2).join(':');
export const markWord = (key: string) => key.split(':').length === 3 ? Number(key.split(':')[2]) : undefined;
export const wordMarkKey = (ayah: string, word: number) => `${ayah}:${word}`;

export function clearForgotten(key: string) {
  const marks = { ...readAyahMarks() };
  delete marks[key];
  write(marks);
}

export function markForgotten(key: string, now = Date.now()) {
  const marks = readAyahMarks();
  write({ ...marks, [key]: { forgot: (marks[key]?.forgot ?? 0) + 1, at: now } });
}

export function rememberAyah(key: string, now = Date.now()) {
  const marks = readAyahMarks();
  const mark = marks[key];
  if (!mark) return;
  const step = (mark.step ?? 0) + 1;
  write({ ...marks, [key]: { ...mark, step, due: now + REST_DAYS[Math.min(step, REST_DAYS.length) - 1] * DAY } });
}

export function restoreMark(key: string, mark: AyahMark | undefined) {
  const marks = { ...readAyahMarks() };
  if (mark) marks[key] = mark;
  else delete marks[key];
  write(marks);
}

const isDue = (mark: AyahMark, now: number) => !mark.due || mark.due <= now;

export function toggleForgotten(keys: string | string[], now = Date.now()) {
  const list = typeof keys === 'string' ? [keys] : keys;
  const due = readDueMarks(now);
  const remembered = list.every(key => due[key]);
  if (remembered) list.forEach(key => rememberAyah(key, now));
  else list.filter(key => !due[key]).forEach(key => markForgotten(key, now));
  return !remembered;
}

export function dueMarks(marks: AyahMarks, now = Date.now()): AyahMarks {
  const due = Object.entries(marks).filter(([, mark]) => isDue(mark, now));
  return due.length === Object.keys(marks).length ? marks : due.length ? Object.fromEntries(due) : NONE;
}

export const mostForgotten = (marks: AyahMarks) =>
  Object.keys(marks).sort((a, b) => marks[b].forgot - marks[a].forgot || marks[b].at - marks[a].at);

export const subscribeAyahMarks = store.subscribe;

let dueCache: { stored: AyahMarks; keys: string; value: AyahMarks } | null = null;
export function readDueMarks(now = Date.now()) {
  const stored = readAyahMarks();
  const value = dueMarks(stored, now);
  const keys = Object.keys(value).join(',');
  if (dueCache && dueCache.stored === stored && dueCache.keys === keys) return dueCache.value;
  dueCache = { stored, keys, value };
  return value;
}

export function subscribeDueMarks(listener: () => void) {
  const off = store.subscribe(listener);
  const timer = setInterval(listener, 60_000);
  return () => { off(); clearInterval(timer); };
}
export const serverAyahMarks = () => NONE;

export const ayahBookmarkId = (key: string) => `ayah:${key}`;
export const ayahHref = (key: string) => `/quran/read/ayah/${markAyah(key).replace(':', '/')}`;
