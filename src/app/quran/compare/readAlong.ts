import { useEffect, useState, useSyncExternalStore } from 'react';
import type { PairCard } from '@shared/quran/compareCards';
import { readPlan, READ_SPEEDS, stepTime } from '@shared/quran/readPlan';

export { ayahStarts, isRefrain, READ_SPEEDS, stepTime, type ReadStep } from '@shared/quran/readPlan';

// Renamed when 1× was slowed to half, so a speed saved before reads at the new pace.
const SPEED_KEY = 'compare-read-pace';
type Shared = { active: string | null; speed: number };
let shared: Shared = { active: null, speed: 1 };
const listeners = new Set<() => void>();
const setShared = (next: Partial<Shared>) => { shared = { ...shared, ...next }; listeners.forEach(listener => listener()); };
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const serverShared = shared;
const useShared = () => useSyncExternalStore(subscribe, () => shared, () => serverShared);

export function setReadSpeed(speed: number) {
  setShared({ speed });
  try { localStorage.setItem(SPEED_KEY, String(speed)); } catch {}
}

/** The read-along speed every card and the page video share. */
export const useReadSpeed = () => useShared().speed;

export type ReadStatus = 'idle' | 'playing' | 'paused' | 'done';

/** A card's read-along. Only one card plays at a time: starting one stops the others. */
export function useReadAlong(card: PairCard) {
  const { active, speed } = useShared();
  const [studio, setStudio] = useState(false);
  const [status, setStatus] = useState<ReadStatus>('idle');
  const [at, setAt] = useState(0);
  const [plan] = useState(() => readPlan(card));
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(SPEED_KEY));
      if (READ_SPEEDS.includes(saved) && saved !== shared.speed) setShared({ speed: saved });
    } catch {}
  }, []);
  useEffect(() => {
    if (active !== card.id && (status === 'playing' || status === 'paused')) { setStatus('idle'); setAt(0); }
  }, [active, card.id, status]);
  useEffect(() => {
    if (status !== 'playing') return;
    const step = plan[at];
    if (!step) { setStatus('done'); return; }
    const timer = setTimeout(() => {
      if (at + 1 >= plan.length) setStatus('done');
      else setAt(at + 1);
    }, stepTime(step, speed));
    return () => clearTimeout(timer);
  }, [status, at, plan, speed]);
  useEffect(() => () => { if (shared.active === card.id) setShared({ active: null }); }, [card.id]);
  const play = (from?: number) => {
    setShared({ active: card.id });
    if (from !== undefined) setAt(from);
    else if (status === 'done' || status === 'idle') setAt(0);
    setStatus('playing');
  };
  const pause = () => setStatus('paused');
  const reset = () => { setStatus('idle'); setAt(0); };
  const open = () => setStudio(true);
  const close = () => { reset(); setStudio(false); if (shared.active === card.id) setShared({ active: null }); };
  const running = status === 'playing' || status === 'paused';
  return { plan, studio, status, at, speed, step: running ? plan[at] : undefined, play, pause, reset, open, close };
}
