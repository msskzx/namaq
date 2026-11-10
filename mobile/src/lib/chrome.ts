import { useSyncExternalStore } from 'react';

/** Whether the reader has put the app's bars away (as the website does on phones until the page is tapped). */
let immersive = false;
const listeners = new Set<() => void>();

export function setImmersive(next: boolean) {
  if (next === immersive) return;
  immersive = next;
  listeners.forEach(listener => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

export const useImmersive = () => useSyncExternalStore(subscribe, () => immersive);
