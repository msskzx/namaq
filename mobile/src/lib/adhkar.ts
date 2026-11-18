import { useSyncExternalStore } from 'react';
import type { AdhkarOccasion } from '@shared/adhkar';
import { utilityView } from './settings';
import { toTab } from './ways';

/**
 * The adhkar page's open tab and the card to bring into view (from a search or a reminder). Kept in memory only:
 * the page opens on the morning adhkar each launch, and nothing about what was read is stored (owner, 2026-11-17).
 */
export type AdhkarPlace = { occasion: AdhkarOccasion; id?: string; at: number };
let place: AdhkarPlace = { occasion: 'morning', at: 0 };
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const get = () => place;

export function showAdhkar(occasion: AdhkarOccasion, id?: string) {
  place = { occasion, id, at: Date.now() };
  listeners.forEach(listener => listener());
}

export const useAdhkarPlace = () => useSyncExternalStore(subscribe, get, get);

/** The asked-for card is in view: forget it, so opening the page again starts at the top. */
export function reachedAdhkar() {
  if (!place.id) return;
  place = { ...place, id: undefined };
  listeners.forEach(listener => listener());
}

/** Open the utilities on the adhkar page, on `occasion`'s tab, scrolled to the card `id` when given. */
export function openAdhkar(occasion: AdhkarOccasion, id?: string) {
  showAdhkar(occasion, id);
  utilityView.set('adhkar');
  toTab('/utilities');
}
