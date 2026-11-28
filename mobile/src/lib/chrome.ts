import { useCallback, useRef, useSyncExternalStore } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { nextCompact, type ScrollPoint } from './scrollShrink';

function flag() {
  let value = false;
  const listeners = new Set<() => void>();
  const set = (next: boolean) => {
    if (next === value) return;
    value = next;
    listeners.forEach(listener => listener());
  };
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  };
  const get = () => value;
  return { set, get, use: () => useSyncExternalStore(subscribe, get) };
}

const immersive = flag();
export const setImmersive = immersive.set;
export const useImmersive = immersive.use;

const compact = flag();
export const setCompact = compact.set;
export const useCompact = compact.use;

export function useShrinkOnScroll() {
  const last = useRef<ScrollPoint | null>(null);
  return useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const now = { y: contentOffset.y, maxY: Math.max(0, contentSize.height - layoutMeasurement.height) };
    compact.set(nextCompact(compact.get(), last.current ?? { y: 0, maxY: now.maxY }, now));
    last.current = now;
  }, []);
}
