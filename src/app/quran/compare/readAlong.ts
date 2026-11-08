import { useEffect, useState, useSyncExternalStore } from 'react';
import type { PairCard } from './pairCards';

/** One word the read-along stops on: `side` of the card, the ayah's place in that side, the word, and the partner it lights.
 *  `option` picks the partner of a one-to-many card while this word is read. */
export type ReadStep = { side: 0 | 1; ayah: number; word: number; link?: string; option?: number; last: boolean };

/** Both ayat stay on screen; the reading moves over one side word by word and each matched word lights its partner across.
 *  A range card reads its first side ayah by ayah. A one-to-many card reads the shared ayah once, then each partner in turn. */
export function readPlan(card: PairCard): ReadStep[] {
  const words = (side: 0 | 1, ayah: { number: number; words: string[]; marks?: Record<number, { link?: string }> }, option?: number) =>
    ayah.words.map((_, word): ReadStep => ({ side, ayah: ayah.number, word, link: ayah.marks?.[word]?.link, ...(option === undefined ? {} : { option }), last: word === ayah.words.length - 1 }));
  if (!card.many) return card.sides[0].ayat.flatMap(ayah => words(0, ayah));
  const many = card.many.side;
  const shared = (1 - many) as 0 | 1;
  return [
    ...words(shared, card.many.options[0].shared, 0),
    ...card.many.options.flatMap((option, i) => words(many, option.ayah, i)),
  ];
}

/** Where each ayah read starts, for the progress bars. */
export const ayahStarts = (plan: ReadStep[]) => plan.flatMap((step, i) => (i === 0 || plan[i - 1].last ? [i] : []));

// Every speed reads at half its first pace: 1× is the old 0.5×, 0.5× slower still.
export const READ_SPEEDS = [1, 1.5, 2, 0.5];
// Milliseconds at 1×: a word, the longer stay on a word with a partner, the pause at an ayah's end. 1× is a calm reading pace.
const WORD = 760;
const MATCH = 1300;
const AYAH_END = 1800;
export const stepTime = (step: ReadStep, speed: number) => ((step.link ? MATCH : WORD) + (step.last ? AYAH_END : 0)) / speed;

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
