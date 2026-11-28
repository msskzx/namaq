import { useEffect, useState, useSyncExternalStore } from 'react';
import { AppState } from 'react-native';
import type { AdhkarOccasion } from '@shared/adhkar';
import { countsOnDay, localDay, sayOnce, type SaidToday } from '@shared/adhkarCount';
import { adhkarSaid, utilityView } from './settings';
import { toTab } from './ways';

let place: AdhkarOccasion | null = null;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const get = () => place;

export function showAdhkar(occasion: AdhkarOccasion | null) {
  place = occasion;
  listeners.forEach(listener => listener());
}

export const useAdhkarPlace = () => useSyncExternalStore(subscribe, get, get);

export function openAdhkar(occasion: AdhkarOccasion) {
  showAdhkar(occasion);
  utilityView.set('adhkar');
  toTab('/utilities');
}

export function openDhikr(occasion: AdhkarOccasion, id: string) {
  toTab({ pathname: '/dhikr', params: { occasion, id } });
}

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

export function useSaidToday(): [SaidToday['counts'], (key: string, of: number | null) => void] {
  const [saved] = adhkarSaid.use();
  const day = useToday();
  const say = (key: string, of: number | null) => {
    const today = localDay(new Date());
    adhkarSaid.set({ day: today, counts: sayOnce(countsOnDay(adhkarSaid.get(), today), key, of) });
  };
  return [countsOnDay(saved, day), say];
}
