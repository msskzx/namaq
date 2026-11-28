import { useSyncExternalStore } from 'react';
import { cleanSolo, type SoloRun, type SoloSettings } from './quiz';
import { arrayOf, isBoolean, isNumberIn, isRecord, onLeave, readJson, writeJson } from './storage';

const RUN = 'quiz-solo-run';
const SETTINGS = 'quiz-solo-settings';

let run: SoloRun | null | undefined;

const isRun = (value: unknown): value is SoloRun => {
  if (!isRecord(value) || !isRecord(value.settings) || !Array.isArray(value.questions) || !value.questions.every(isRecord)) return false;
  const count = value.questions.length;
  const lists = [value.typed, value.checked, value.shown, value.hints].filter(list => list !== undefined);
  return lists.every(list => Array.isArray(list) && list.length === count) && arrayOf(Array.isArray)(value.typed) && arrayOf(isBoolean)(value.checked)
    && isNumberIn(0, Math.max(0, count - 1))(value.current) && isBoolean(value.submitted);
};
const listeners = new Set<() => void>();

export function getRun(): SoloRun | null {
  if (run === undefined) run = readJson(RUN, isRun) ?? null;
  return run;
}

let pending: ReturnType<typeof setTimeout> | undefined;

export function setRun(next: SoloRun | null) {
  run = next;
  listeners.forEach(listener => listener());
  clearTimeout(pending);
  pending = setTimeout(flushRun, 400);
}

function flushRun() {
  if (pending === undefined) return;
  clearTimeout(pending);
  pending = undefined;
  writeJson(RUN, run);
}
onLeave(flushRun);

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

export const useRun = () => useSyncExternalStore(subscribe, getRun);

export const readSettings = () => cleanSolo(readJson(SETTINGS, isRecord) as Partial<SoloSettings> | undefined);
export const writeSettings = (settings: SoloSettings) => writeJson(SETTINGS, settings);
