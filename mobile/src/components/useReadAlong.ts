import { useEffect, useState, useSyncExternalStore } from 'react';
import type { PairCard } from '@shared/quran/compareCards';
import { readPlan, READ_SPEEDS, stepTime } from '@shared/quran/readPlan';
import { deviceStorage } from '@/lib/deviceStorage';

const SPEED_KEY = 'compare-read-pace';
type Shared = { active: string | null; speed: number };
const savedSpeed = () => { try { const value = Number(deviceStorage.getItem(SPEED_KEY)); return READ_SPEEDS.includes(value) ? value : 1; } catch { return 1; } };
let shared: Shared = { active: null, speed: savedSpeed() };
const listeners = new Set<() => void>();
const setShared = (next: Partial<Shared>) => { shared = { ...shared, ...next }; listeners.forEach(listener => listener()); };
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };

export function nextSpeed() {
  const speed = READ_SPEEDS[(READ_SPEEDS.indexOf(shared.speed) + 1) % READ_SPEEDS.length];
  setShared({ speed });
  try { deviceStorage.setItem(SPEED_KEY, String(speed)); } catch {}
}

export type ReadStatus = 'idle' | 'playing' | 'paused' | 'done';

/** A card's read-along, as on the website. Only one card plays at a time: starting one stops the others. */
export function useReadAlong(card: PairCard) {
  const { active, speed } = useSyncExternalStore(subscribe, () => shared);
  const [studio, setStudio] = useState(false);
  const [status, setStatus] = useState<ReadStatus>('idle');
  const [at, setAt] = useState(0);
  const [plan] = useState(() => readPlan(card));
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
  const close = () => { reset(); setStudio(false); if (shared.active === card.id) setShared({ active: null }); };
  const running = status === 'playing' || status === 'paused';
  return { plan, studio, status, at, speed, step: running ? plan[at] : undefined, play, pause, reset, open: () => setStudio(true), close };
}
