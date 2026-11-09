'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { LOCK } from './useSwipe';

/** How far (px) a sheet must be dragged before letting go closes it. */
export const CLOSE_DRAG = 80;
/** A quicker flick (px per ms) closes it from any distance. */
const FLICK = 0.5;
/** How long (ms) the sheet takes to slide out or back. */
const SETTLE = 200;

export type SwipeCloseOptions = {
  /** 'down' for a sheet at the bottom of the screen, 'up' for a panel hanging from the top. */
  direction: 'down' | 'up';
  /** Called once the sheet has slid out of view. */
  onClose: () => void;
};

/** The nearest element between the touch and the sheet that scrolls vertically, if any. */
function scrollerOf(target: EventTarget | null, sheet: HTMLElement): HTMLElement | null {
  for (let node = target instanceof Element ? target : null; node && sheet.contains(node); node = node.parentElement) {
    if (!(node instanceof HTMLElement) || node.scrollHeight <= node.clientHeight + 1) continue;
    const overflow = getComputedStyle(node).overflowY;
    if (overflow === 'auto' || overflow === 'scroll') return node;
    if (node === sheet) break;
  }
  return null;
}

/** Whether the scroller has nothing more to show in the direction the finger pulls the sheet. */
function atEdge(scroller: HTMLElement | null, direction: 'down' | 'up') {
  if (!scroller) return true;
  return direction === 'down' ? scroller.scrollTop <= 0 : scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
}

/**
 * Drag a sheet or menu toward the screen edge it came from to close it, as in YouTube and Instagram:
 * the sheet follows the finger, and letting go past CLOSE_DRAG (or with a flick) slides it out, otherwise it springs back.
 * A list inside scrolls as usual; the drag only takes over once that list is at its end, so pulling past the top
 * of a bottom sheet's list (or the bottom of a top panel's list) closes it in the same gesture.
 * Touch only: a mouse keeps its clicks and text selection.
 */
export function useSwipeClose(ref: RefObject<HTMLElement | null>, enabled: boolean, options: SwipeCloseOptions) {
  const latest = useRef(options);
  latest.current = options;
  useEffect(() => {
    const sheet = ref.current;
    if (!enabled || !sheet) return;
    let touch: { x: number; y: number; axis?: 'x' | 'y'; scroller: HTMLElement | null } | null = null;
    // Set while the sheet follows the finger: where the drag started, and the last point for the flick speed.
    let drag: { from: number; y: number; t: number; speed: number } | null = null;
    let closing = false;
    const sign = () => (latest.current.direction === 'down' ? 1 : -1);
    const place = (offset: number, animate: boolean) => {
      sheet.style.transition = animate ? `transform ${SETTLE}ms ease-out` : 'none';
      sheet.style.transform = offset ? `translateY(${offset}px)` : '';
    };
    const reset = () => { sheet.style.transition = ''; sheet.style.transform = ''; };
    const start = (event: TouchEvent) => {
      if (closing) return;
      if (event.touches.length !== 1) { cancel(); return; }
      const target = event.target as Element | null;
      // Sliders and text selection handles keep their own drags.
      if (target?.closest?.('input[type="range"], [data-no-swipe-close]')) { touch = null; return; }
      touch = { x: event.touches[0].clientX, y: event.touches[0].clientY, scroller: scrollerOf(event.target, sheet) };
      drag = null;
    };
    const move = (event: TouchEvent) => {
      if (!touch || closing) return;
      if (event.touches.length !== 1) { cancel(); return; }
      const { clientX: x, clientY: y } = event.touches[0];
      if (!touch.axis) {
        const dx = x - touch.x, dy = y - touch.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < LOCK) return;
        touch.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
      if (touch.axis !== 'y') return;
      const now = performance.now();
      if (!drag) {
        // Start following once the finger pulls toward the edge and the list under it cannot scroll that way.
        const pulling = (y - touch.y) * sign() > 0;
        if (!pulling || !atEdge(touch.scroller, latest.current.direction)) { touch.y = y; return; }
        drag = { from: y, y, t: now, speed: 0 };
      }
      event.preventDefault();
      const offset = Math.max(0, (y - drag.from) * sign());
      const elapsed = now - drag.t;
      if (elapsed > 0) drag.speed = ((y - drag.y) * sign()) / elapsed;
      drag.y = y; drag.t = now;
      place(offset * sign(), false);
    };
    const end = () => {
      const was = drag;
      touch = null; drag = null;
      if (!was) return;
      const offset = Math.max(0, (was.y - was.from) * sign());
      if (offset < CLOSE_DRAG && was.speed < FLICK) { place(0, true); return; }
      closing = true;
      // Slide on out past the screen edge: the top below the screen for a bottom sheet, the bottom above it for a top panel.
      const bounds = sheet.getBoundingClientRect();
      const now = offset * sign();
      place(latest.current.direction === 'down' ? now + window.innerHeight - bounds.top : now - bounds.bottom, true);
      window.setTimeout(() => {
        closing = false;
        latest.current.onClose();
        reset();
      }, SETTLE);
    };
    function cancel() {
      if (drag) place(0, true);
      touch = null; drag = null;
    }
    sheet.addEventListener('touchstart', start, { passive: true });
    sheet.addEventListener('touchmove', move, { passive: false });
    sheet.addEventListener('touchend', end);
    sheet.addEventListener('touchcancel', cancel);
    return () => {
      sheet.removeEventListener('touchstart', start);
      sheet.removeEventListener('touchmove', move);
      sheet.removeEventListener('touchend', end);
      sheet.removeEventListener('touchcancel', cancel);
      if (!closing) reset();
    };
  }, [ref, enabled]);
}
