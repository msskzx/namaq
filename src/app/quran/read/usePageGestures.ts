'use client';

import { useEffect, useRef, type RefObject } from 'react';
import type { Gesture } from '@shared/readerGestures';

/** How long (ms) a press must last to count as a long press. */
export const LONG_PRESS = 500;
/** How long (ms) a first tap waits for a second one, when a double tap does something. */
export const DOUBLE_TAP = 260;
/** How far (px) a finger may move and still tap or press. */
const SLOP = 10;

/**
 * Tap, double tap and long press on the reader's page, for mouse, pen and touch alike.
 * A first tap waits for a second only when `waitForDouble()` says a double tap does something,
 * so a plain tap stays instant otherwise. A drag, a swipe or a text selection is not a gesture.
 */
export function usePageGestures(
  ref: RefObject<HTMLElement | null>,
  handlers: { onGesture: (gesture: Gesture, target: Element, mouse: boolean) => void; waitForDouble: () => boolean; ignore?: () => boolean },
) {
  const latest = useRef(handlers);
  latest.current = handlers;
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let press: { x: number; y: number; id: number; target: Element; timer: ReturnType<typeof setTimeout>; long: boolean } | null = null;
    let touch = false;
    let pending: { timer: ReturnType<typeof setTimeout>; target: Element } | null = null;
    const fire = (gesture: Gesture, target: Element) => latest.current.onGesture(gesture, target, !touch);
    const skip = (target: EventTarget | null) => target instanceof Element && !!target.closest('button, a, input, select, textarea, [role="dialog"]');
    const down = (event: PointerEvent) => {
      touch = event.pointerType !== 'mouse';
      if (event.isPrimary === false || event.button > 0 || skip(event.target)) return;
      if (press) clearTimeout(press.timer);
      const target = event.target as Element;
      press = { x: event.clientX, y: event.clientY, id: event.pointerId, target, long: false, timer: setTimeout(() => {
        if (!press) return;
        press.long = true;
        if (pending) { clearTimeout(pending.timer); pending = null; }
        fire('long', target);
      }, LONG_PRESS) };
    };
    const move = (event: PointerEvent) => {
      if (press && event.pointerId === press.id && Math.hypot(event.clientX - press.x, event.clientY - press.y) > SLOP) {
        clearTimeout(press.timer);
        press = null;
      }
    };
    const up = (event: PointerEvent) => {
      if (!press || event.pointerId !== press.id) return;
      const done = press;
      press = null;
      clearTimeout(done.timer);
      if (done.long || latest.current.ignore?.() || window.getSelection()?.toString()) return;
      if (pending) {
        clearTimeout(pending.timer);
        pending = null;
        fire('double', done.target);
        return;
      }
      if (!latest.current.waitForDouble()) { fire('tap', done.target); return; }
      pending = { target: done.target, timer: setTimeout(() => { const was = pending; pending = null; if (was) fire('tap', was.target); }, DOUBLE_TAP) };
    };
    const cancel = () => { if (press) clearTimeout(press.timer); press = null; };
    // A long press by finger would otherwise open the phone's text menu; a mouse keeps its right-click menu.
    const menu = (event: Event) => { if (touch && !skip(event.target)) event.preventDefault(); };
    element.addEventListener('pointerdown', down);
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerup', up);
    element.addEventListener('pointercancel', cancel);
    element.addEventListener('contextmenu', menu);
    return () => {
      cancel();
      if (pending) clearTimeout(pending.timer);
      element.removeEventListener('pointerdown', down);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerup', up);
      element.removeEventListener('pointercancel', cancel);
      element.removeEventListener('contextmenu', menu);
    };
  }, [ref]);
}
