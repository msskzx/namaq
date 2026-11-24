import { useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

/** What a card's share button hands the share sheet: the card drawn for the image at the width given, its link, its video where it has one, and its whole page's video (compare). */
export type ShareRequest = { content: (width: number) => ReactNode; link?: string; onVideo?: () => void; onPageVideo?: () => void;
  /** Shared as equal 4:5 pictures instead of one (a story, owner 2026-11-21); `content` is then unused. */
  paged?: (width: number) => SharePaged };

/**
 * A long drawing laid out on equal pictures (shared/sharePages.ts): `head` on the first only, the `blocks` flowing between
 * them, those from `tailFrom` on together on the last, and `foot` (the source) at the last one's foot.
 */
export type SharePaged = { head: ReactNode; blocks: ReactNode[]; tailFrom?: number; foot?: ReactNode;
  /** Whole 4:5 pictures the place has laid out itself (a scene's pages), captured as they are: head and blocks are then unused. */
  pictures?: ReactNode[] };

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
