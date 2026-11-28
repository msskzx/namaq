import { useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

export type ShareRequest = { content: (width: number) => ReactNode; link?: string; onVideo?: () => void; onPageVideo?: () => void;
  paged?: (width: number) => SharePaged };

export type SharePaged = { head: ReactNode; blocks: ReactNode[]; tailFrom?: number; foot?: ReactNode;
  pictures?: ReactNode[] };

export const MODAL_GAP = 350;

let current: ShareRequest | null = null;
const listeners = new Set<() => void>();
const set = (next: ShareRequest | null) => { current = next; listeners.forEach(listener => listener()); };

export const shareCard = (request: ShareRequest) => set(request);
export const shareCardLater = (request: ShareRequest) => setTimeout(() => set(request), MODAL_GAP);
export const closeShare = () => set(null);
export const readShare = () => current;
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
export const useShareRequest = () => useSyncExternalStore(subscribe, readShare);
