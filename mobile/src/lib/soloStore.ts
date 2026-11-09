import { useSyncExternalStore } from 'react';
import { cleanSolo, type SoloRun, type SoloSettings } from './quiz';
import { readJson, writeJson } from './storage';

const RUN = 'quiz-solo-run';
const SETTINGS = 'quiz-solo-settings';

let run: SoloRun | null | undefined;
const listeners = new Set<() => void>();

/** The solo quiz in progress, kept on the device so it is still there after the app was closed. */
export function getRun(): SoloRun | null {
  if (run === undefined) run = readJson<SoloRun>(RUN) ?? null;
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

export const readSettings = () => cleanSolo(readJson<Partial<SoloSettings>>(SETTINGS));
export const writeSettings = (settings: SoloSettings) => writeJson(SETTINGS, settings);
