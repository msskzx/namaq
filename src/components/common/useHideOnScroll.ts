'use client';

import { useSyncExternalStore } from 'react';

// One state for the page, so the top bar and anything that slides with it (the pager's progress) hide and return together.
let hidden = false;
const listeners = new Set<() => void>();
const set = (next: boolean) => { if (next === hidden) return; hidden = next; listeners.forEach(listener => listener()); };
const THRESHOLD = 8;
let last = 0;
let frame = 0;
const update = () => {
  frame = 0;
  const y = Math.max(0, window.scrollY);
  if (y < 64) set(false);
  else if (y - last > THRESHOLD) set(true);
  else if (last - y > THRESHOLD) set(false);
  else return;
  last = y;
};
const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
function subscribe(listener: () => void) {
  if (listeners.size === 0) { last = window.scrollY; window.addEventListener('scroll', onScroll, { passive: true }); }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); frame = 0; set(false); }
  };
}
const show = () => set(false);

/** True after the page scrolls down past the bar, false again as soon as it scrolls up. `show` brings it back, e.g. on focus. */
export function useHideOnScroll() {
  return [useSyncExternalStore(subscribe, () => hidden, () => false), show] as const;
}
