import { useCallback, useRef, useSyncExternalStore } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { nextCompact, type ScrollPoint } from './scrollShrink';

/** A tiny store any screen can set and the bars read. */
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

/** Whether the reader has put the app's bars away (as the website does on phones until the page is tapped). */
const immersive = flag();
export const setImmersive = immersive.set;
export const useImmersive = immersive.use;

/** Whether the page is scrolling down (see scrollShrink.ts): the bottom tab bar is drawn smaller and a hideOnScroll top bar slides away. */
const compact = flag();
export const setCompact = compact.set;
export const useCompact = compact.use;

/** onScroll for a page that scrolls up and down: pass it with scrollEventThrottle={16}. Pager pages don't use it, so their bar stays full size. */
export function useShrinkOnScroll() {
  const last = useRef<ScrollPoint | null>(null);
  return useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const now = { y: contentOffset.y, maxY: Math.max(0, contentSize.height - layoutMeasurement.height) };
    // Every page starts at the top, and its height is only known from the first scroll.
    compact.set(nextCompact(compact.get(), last.current ?? { y: 0, maxY: now.maxY }, now));
    last.current = now;
  }, []);
}
