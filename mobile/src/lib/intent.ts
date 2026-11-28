import { useEffect, useSyncExternalStore } from 'react';

export type Intent =
  | { tab: 'branches'; open?: string; query?: string; saved?: boolean; surah?: number; juz?: number; ayah?: string; view?: 'tree' }
  | { tab: 'compare'; lead: number; other?: number; ayat?: string[] }
  | { tab: 'read'; at?: string; page?: number; recite?: boolean; review?: boolean; word?: number };

let pending: Intent | null = null;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };

export function setIntent(intent: Intent) {
  pending = intent;
  listeners.forEach(listener => listener());
}

export function useIntent<T extends Intent['tab']>(tab: T, take: (intent: Extract<Intent, { tab: T }>) => void) {
  const intent = useSyncExternalStore(subscribe, () => pending);
  useEffect(() => {
    if (!intent || intent.tab !== tab) return;
    pending = null;
    take(intent as Extract<Intent, { tab: T }>);
  }, [intent]); // eslint-disable-line react-hooks/exhaustive-deps
}
