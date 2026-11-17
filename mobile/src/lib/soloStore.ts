import { useSyncExternalStore } from 'react';
import { cleanSolo, type SoloRun, type SoloSettings } from './quiz';
import { arrayOf, isBoolean, isNumberIn, isRecord, readJson, writeJson } from './storage';

const RUN = 'quiz-solo-run';
const SETTINGS = 'quiz-solo-settings';

let run: SoloRun | null | undefined;

/** A saved run whose lists no longer line up with its questions (an older app's) is not resumed. */
const isRun = (value: unknown): value is SoloRun => {
  if (!isRecord(value) || !isRecord(value.settings) || !Array.isArray(value.questions) || !value.questions.every(isRecord)) return false;
  const count = value.questions.length;
  const lists = [value.typed, value.checked, value.shown, value.hints].filter(list => list !== undefined);
  return lists.every(list => Array.isArray(list) && list.length === count) && arrayOf(Array.isArray)(value.typed) && arrayOf(isBoolean)(value.checked)
    && isNumberIn(0, Math.max(0, count - 1))(value.current) && isBoolean(value.submitted);
};
const listeners = new Set<() => void>();

/** The solo quiz in progress, kept on the device so it is still there after the app was closed. */
export function getRun(): SoloRun | null {
  if (run === undefined) run = readJson(RUN, isRun) ?? null;
  return run;
}

let pending: ReturnType<typeof setTimeout> | undefined;

/** Screens update at once; the write to the device waits for a pause in typing, so each keystroke stays light. */
export function setRun(next: SoloRun | null) {
  run = next;
  listeners.forEach(listener => listener());
  clearTimeout(pending);
  pending = setTimeout(() => writeJson(RUN, run), 400);
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

export const useRun = () => useSyncExternalStore(subscribe, getRun);

export const readSettings = () => cleanSolo(readJson(SETTINGS, isRecord) as Partial<SoloSettings> | undefined);
export const writeSettings = (settings: SoloSettings) => writeJson(SETTINGS, settings);
