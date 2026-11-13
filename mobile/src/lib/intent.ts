import { useEffect, useSyncExternalStore } from 'react';

/** What another screen (the homepage) asks a tab to open when it is shown: a tree, a surah or juz, a compare pair, an ayah. */
export type Intent =
  | { tab: 'branches'; open?: string; query?: string; saved?: boolean; surah?: number; juz?: number; ayah?: string }
  | { tab: 'compare'; lead: number; other?: number; ayat?: string[] }
  | { tab: 'read'; at?: string; page?: number; recite?: boolean; review?: boolean; write?: boolean };

let pending: Intent | null = null;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };

export function setIntent(intent: Intent) {
  pending = intent;
  listeners.forEach(listener => listener());
}

/** Runs `take` once for each intent meant for this tab, whether the tab was open already or opens because of it. */
export function useIntent<T extends Intent['tab']>(tab: T, take: (intent: Extract<Intent, { tab: T }>) => void) {
  const intent = useSyncExternalStore(subscribe, () => pending);
  useEffect(() => {
    if (!intent || intent.tab !== tab) return;
    pending = null;
    take(intent as Extract<Intent, { tab: T }>);
  }, [intent]); // eslint-disable-line react-hooks/exhaustive-deps
}
