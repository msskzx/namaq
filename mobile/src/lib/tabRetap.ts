import { useEffect, useRef } from 'react';

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
