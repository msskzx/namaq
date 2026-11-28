import { useCallback, useEffect, useRef } from 'react';
import type { Gesture } from '@shared/readerGestures';
import type { Touch } from '@/components/MushafPageView';

export const DOUBLE_TAP = 260;

type OnGesture = (gesture: Gesture, key: string | null, x: number, y: number, word?: number) => void;

export function usePageTouch(onGesture: OnGesture, waitForDouble: () => boolean) {
  const latest = useRef({ onGesture, waitForDouble });
  latest.current = { onGesture, waitForDouble };
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancel = useCallback(() => {
    if (pending.current) clearTimeout(pending.current);
    pending.current = null;
  }, []);
  useEffect(() => cancel, [cancel]);
  const touch = useCallback((kind: Touch, key: string | null, x: number, y: number, word?: number) => {
    const fire = (gesture: Gesture) => latest.current.onGesture(gesture, key, x, y, word);
    if (kind === 'long') return fire('long');
    if (pending.current) { cancel(); return fire('double'); }
    if (!latest.current.waitForDouble()) return fire('tap');
    pending.current = setTimeout(() => { pending.current = null; fire('tap'); }, DOUBLE_TAP);
  }, [cancel]);
  return { touch, cancel };
}
