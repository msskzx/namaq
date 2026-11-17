// The website side of the app's «pen-rule» and «quiz-pen» settings (mobile/src/lib/settings.ts): what recite mode's pen
// asks to write, everywhere it recites, and a quiz's own rule or the same one. Per device in localStorage; the whole
// ayah by default (owner, 2026-11-17).
import { useSyncExternalStore } from 'react';
import { isPenRule, type PenRule } from '@shared/quran/writeAyah';

const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
function read<T>(key: string, fallback: T, valid: (value: unknown) => value is T): T {
  try { const value = localStorage.getItem(key); return valid(value) ? value : fallback; } catch { return fallback; }
}
function store(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* private mode: still applies for this visit */ }
  listeners.forEach(listener => listener());
}

export type QuizPen = PenRule | 'same';
const isQuizPen = (value: unknown): value is QuizPen => value === 'same' || isPenRule(value);
const readPen = () => read<PenRule>('pen-rule', 'whole', isPenRule);
const readQuizPen = () => read<QuizPen>('quiz-pen', 'same', isQuizPen);

export const setPenRule = (rule: PenRule) => store('pen-rule', rule);
export const setQuizPen = (rule: QuizPen) => store('quiz-pen', rule);
export const usePenRule = () => useSyncExternalStore(subscribe, readPen, () => 'whole' as const);
export const useQuizPenSetting = () => useSyncExternalStore(subscribe, readQuizPen, () => 'same' as const);
/** The rule a quiz writes by: its own, or the one in settings. */
export function useQuizPen(): PenRule {
  const rule = usePenRule();
  const quiz = useQuizPenSetting();
  return quiz === 'same' ? rule : quiz;
}
