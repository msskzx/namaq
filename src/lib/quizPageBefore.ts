// The website side of the app's «quiz-page-before» setting (mobile/src/lib/settings.ts): the ayat before an asked ayah are
// written on its quiz page. Kept per device in localStorage; off by default (owner, 2026-11-17).
import { useSyncExternalStore } from 'react';

const STORAGE = 'quiz-page-before';
const listeners = new Set<() => void>();

function read(): boolean {
  try { return localStorage.getItem(STORAGE) === '1'; } catch { return false; }
}

export function setQuizPageBefore(on: boolean) {
  try { localStorage.setItem(STORAGE, on ? '1' : '0'); } catch { /* private mode: still applies for this visit */ }
  listeners.forEach(listener => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

export const useQuizPageBefore = () => useSyncExternalStore(subscribe, read, () => false);
