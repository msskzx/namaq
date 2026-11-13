import { useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

/** What a card's share button hands the share sheet: the card drawn for the image at the width given, its link, and its video where it has one. */
export type ShareRequest = { content: (width: number) => ReactNode; link?: string; onVideo?: () => void };

/** iOS shows one modal at a time: what opens after another sheet closes waits this long for it to go. */
export const MODAL_GAP = 350;

let current: ShareRequest | null = null;
const listeners = new Set<() => void>();
const set = (next: ShareRequest | null) => { current = next; listeners.forEach(listener => listener()); };

/** Opens the share sheet (mounted once in the root layout) on a card. */
export const shareCard = (request: ShareRequest) => set(request);
/** The same, from a sheet or menu that is closing (its own modal must be gone first). */
export const shareCardLater = (request: ShareRequest) => setTimeout(() => set(request), MODAL_GAP);
export const closeShare = () => set(null);
export const readShare = () => current;
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
export const useShareRequest = () => useSyncExternalStore(subscribe, readShare);
