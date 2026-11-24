import { useEffect, useState, useSyncExternalStore } from 'react';
import { AppState } from 'react-native';
import { router } from 'expo-router';
import type { AdhkarOccasion } from '@shared/adhkar';
import { countsOnDay, localDay, sayOnce, type SaidToday } from '@shared/adhkarCount';
import { adhkarSaid, utilityView } from './settings';
import { toTab } from './ways';

/**
 * The adhkar page's open time, or none for the list of times (owner, 2026-11-24: times → a time's adhkar → one dhikr).
 * Kept in memory only: the page opens on the list of times each launch.
 */
let place: AdhkarOccasion | null = null;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const get = () => place;

export function showAdhkar(occasion: AdhkarOccasion | null) {
  place = occasion;
  listeners.forEach(listener => listener());
}

export const useAdhkarPlace = () => useSyncExternalStore(subscribe, get, get);

/** Open the utilities on the adhkar of `occasion` (a reminder after fajr or asr). */
export function openAdhkar(occasion: AdhkarOccasion) {
  showAdhkar(occasion);
  utilityView.set('adhkar');
  toTab('/utilities');
}

/** Open one dhikr full screen, swiping through the rest of `occasion`'s adhkar (a search, a feed card, the list). */
export function openDhikr(occasion: AdhkarOccasion, id: string) {
  router.push({ pathname: '/dhikr', params: { occasion, id } });
}

/** The phone's day, drawn again at midnight and when the app comes back, so yesterday's ticks never show today. */
function useToday() {
  const [day, setDay] = useState(() => localDay(new Date()));
  useEffect(() => {
    const check = () => setDay(localDay(new Date()));
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const timer = setTimeout(check, midnight + 1000);
    const listener = AppState.addEventListener('change', state => { if (state === 'active') check(); });
    return () => { clearTimeout(timer); listener.remove(); };
  }, [day]);
  return day;
}

/** Today's counts, gone at the phone's midnight, and the way to count one more (`of`) or start one again (`null`). */
export function useSaidToday(): [SaidToday['counts'], (key: string, of: number | null) => void] {
  const [saved] = adhkarSaid.use();
  const day = useToday();
  const say = (key: string, of: number | null) => {
    const today = localDay(new Date());
    adhkarSaid.set({ day: today, counts: sayOnce(countsOnDay(adhkarSaid.get(), today), key, of) });
  };
  return [countsOnDay(saved, day), say];
}
