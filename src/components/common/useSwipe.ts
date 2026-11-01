'use client';

import { useEffect, useRef, type RefObject } from 'react';

/** How far (px) a finger or trackpad gesture must travel sideways to step. */
export const SWIPE = 50;
/** How far (px) a finger moves before the gesture is locked to one axis. */
export const LOCK = 8;
/** How long (ms) a slide animation takes; matches the CSS transitions. */
export const SLIDE = 250;
const WHEEL_GAP = 250;

export type SwipeHandlers = {
  /** Whether a gesture may start now, for example only while a tree is at fit zoom. */
  allowed?: () => boolean;
  /** Whether a sideways move by dx (finger pixels, right is positive) goes forward. */
  forward: (dx: number) => boolean;
  canStep: (forward: boolean) => boolean;
  /** Called when a one-finger gesture starts, before any drag. */
  start?: () => void;
  /** Follows the finger: x is the drag in pixels, damped when there is nothing to step to. */
  drag: (x: number) => void;
  step: (forward: boolean) => void;
  /** The gesture ended short of a step (or a second finger joined): slide back. */
  cancel: () => void;
};

/**
 * One-finger sideways swipes and one-step-per-gesture trackpad swipes, shared by the ayah matrix and the tree view.
 * The gesture locks to one axis after LOCK pixels; only a sideways one is taken, so vertical scrolling stays native.
 */
export function useSwipe(ref: RefObject<HTMLElement | null>, enabled: boolean, handlers: SwipeHandlers) {
  const latest = useRef(handlers);
  latest.current = handlers;
  const swiped = useRef(0);
  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;
    let swipe: { x: number; y: number; axis?: 'x' | 'y' } | null = null;
    let dragged = 0;
    const abandon = () => {
      const was = swipe;
      swipe = null;
      if (was?.axis === 'x') { dragged = 0; latest.current.cancel(); }
    };
    const start = (event: TouchEvent) => {
      const h = latest.current;
      if (event.touches.length !== 1 || (h.allowed && !h.allowed())) { abandon(); return; }
      h.start?.();
      dragged = 0;
      swipe = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    };
    const move = (event: TouchEvent) => {
      if (!swipe) return;
      if (event.touches.length !== 1) { abandon(); return; }
      const dx = event.touches[0].clientX - swipe.x;
      const dy = event.touches[0].clientY - swipe.y;
      if (!swipe.axis) {
        // Only a clearly sideways first move is cancelled, so iOS does not start a vertical pan;
        // cancelling a jittery one would stop the browser scrolling for the whole touch.
        if (Math.abs(dx) < LOCK && Math.abs(dy) < LOCK) {
          if (Math.abs(dx) >= 3 && Math.abs(dx) > 2 * Math.abs(dy) && event.cancelable) event.preventDefault();
          return;
        }
        swipe.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
      if (swipe.axis !== 'x') return;
      if (event.cancelable) event.preventDefault();
      const h = latest.current;
      dragged = h.canStep(h.forward(dx)) ? dx : dx / 4;
      h.drag(dragged);
    };
    const end = () => {
      const was = swipe;
      swipe = null;
      if (was?.axis !== 'x') return;
      swiped.current = Date.now();
      const h = latest.current;
      const forward = h.forward(dragged);
      if (Math.abs(dragged) >= SWIPE && h.canStep(forward)) h.step(forward);
      else h.cancel();
      dragged = 0;
    };
    const gesture = { sum: 0, done: false, timer: undefined as ReturnType<typeof setTimeout> | undefined };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      const h = latest.current;
      if (h.allowed && !h.allowed()) return;
      // Keeps a two-finger trackpad swipe from also going back or forward in the browser history.
      if (event.cancelable) event.preventDefault();
      clearTimeout(gesture.timer);
      gesture.timer = setTimeout(() => { gesture.sum = 0; gesture.done = false; }, WHEEL_GAP);
      if (gesture.done) return;
      gesture.sum += event.deltaX;
      if (Math.abs(gesture.sum) < SWIPE) return;
      gesture.done = true;
      // Two fingers moving right scroll the content left, so a wheel delta is the opposite of a finger drag.
      const forward = h.forward(-gesture.sum);
      if (h.canStep(forward)) h.step(forward);
    };
    element.addEventListener('touchstart', start, { passive: true });
    element.addEventListener('touchmove', move, { passive: false });
    element.addEventListener('touchend', end);
    element.addEventListener('touchcancel', end);
    element.addEventListener('wheel', wheel, { passive: false });
    return () => {
      clearTimeout(gesture.timer);
      element.removeEventListener('touchstart', start);
      element.removeEventListener('touchmove', move);
      element.removeEventListener('touchend', end);
      element.removeEventListener('touchcancel', end);
      element.removeEventListener('wheel', wheel);
    };
  }, [ref, enabled]);
  /** True right after a sideways swipe, so the click the browser sends when the finger lifts is ignored. */
  return { justSwiped: () => Date.now() - swiped.current < 500 };
}

export const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
