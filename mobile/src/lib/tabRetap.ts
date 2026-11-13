import { useEffect, useRef } from 'react';

/**
 * Tapping the tab that is already open (owner, 2026-11-13, as on Instagram): the first tap takes the page back to its top
 * (the first card, or the top of a scrolled page); a tap while already at the top resets the page's filters.
 * The tab bar calls retapTab; each tab page listens with useTabRetap.
 */
const listeners = new Map<string, Set<() => void>>();

export function retapTab(tab: string) {
  listeners.get(tab)?.forEach(listener => listener());
}

export function useTabRetap(tab: string, onRetap: () => void) {
  const latest = useRef(onRetap);
  latest.current = onRetap;
  useEffect(() => {
    const listener = () => latest.current();
    const set = listeners.get(tab) ?? new Set();
    set.add(listener);
    listeners.set(tab, set);
    return () => { set.delete(listener); };
  }, [tab]);
}
