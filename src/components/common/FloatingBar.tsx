'use client';

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { LucideIcon } from 'lucide-react';
import { clampBox, keepBarPlace, readBarPlaces, serverBarPlaces, subscribeBarPlaces } from '@shared/barPlaces';
import Button from './Button';

/** How far the pointer moves on a bar before it counts as a drag, not a press (more than the app's Tap allows a tap). */
const DRAG = 10;
/** How close to the window's edges a bar may go. */
const EDGE = 8;

/** What a dropped bar keeps clear of: the window's edges, the phone's tab pill and the keyboard below (CSS variables the page sets). */
function clearOf(element: HTMLElement) {
  const style = getComputedStyle(element);
  const px = (name: string) => parseFloat(style.getPropertyValue(name)) || 0;
  return { top: EDGE, bottom: EDGE + Math.max(px('--app-tabbar'), px('--keyboard')), side: EDGE };
}

/**
 * A bar that floats over the page (owner, 2026-11-19; the app's ui/FloatingBar): the page under it keeps its full size.
 * Dragged by any part, buttons included (a drag never clicks), it goes anywhere in the window and stays where it is let
 * go, remembered for next time (shared/barPlaces.ts, the same places as the app's). Folded, it is a small frosted circle
 * with the bar's sign: a click opens the bar again where the circle is, and a drag moves the circle. Until it is first
 * dropped it sits where `className` puts it (low over the page, near the thumb). The reader's recite and listen bars float with it.
 */
export default function FloatingBar({ id, openLabel, Icon, className, style, children }: {
  id: string;
  /** The folded circle's name: what a click on it does («افتح أدوات التسميع»). */
  openLabel: string; Icon: LucideIcon;
  /** Its starting place, before it is first dropped. */
  className: string; style?: React.CSSProperties;
  /** The bar, given the way to fold it: its fold button calls `fold`. */
  children: (fold: () => void) => React.ReactNode;
}) {
  const places = useSyncExternalStore(subscribeBarPlaces, readBarPlaces, serverBarPlaces);
  const saved = places[id];
  const folded = !!saved?.folded;
  const self = useRef<HTMLDivElement>(null);
  /** A drag just ended: the click it would make is swallowed. */
  const dragged = useRef(false);
  /** Where it shows while dragged, its top left; null when it rests at its kept place or its starting one. */
  const [moving, setMoving] = useState<{ left: number; top: number } | null>(null);
  const [placed, setPlaced] = useState<{ left: number; top: number } | null>(null);
  const screen = () => ({ width: window.innerWidth, height: window.innerHeight });
  /** The bar itself (the pill or the circle), not the full-width strip that holds it before it is dropped. */
  const bar = () => (self.current?.firstElementChild as HTMLElement | null) ?? self.current;
  const sizeOf = (element: HTMLElement) => ({ width: element.offsetWidth, height: element.offsetHeight });

  // Its kept place, held inside the window as it is now: re-held when the window, the bar's own size or the keyboard changes.
  useLayoutEffect(() => {
    const element = bar();
    if (!saved || !element) { setPlaced(null); return; }
    const place = () => {
      const size = screen();
      setPlaced(clampBox({ x: saved.x * size.width, y: saved.y * size.height }, sizeOf(element), size, clearOf(element)));
    };
    place();
    const watch = new ResizeObserver(place);
    watch.observe(element);
    window.addEventListener('resize', place);
    return () => { watch.disconnect(); window.removeEventListener('resize', place); };
  }, [saved?.x, saved?.y, folded]); // eslint-disable-line react-hooks/exhaustive-deps

  const centreNow = () => {
    const box = bar()!.getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  };
  const keep = (fold: boolean) => keepBarPlace(id, centreNow(), screen(), fold);

  // The pointer leaves the bar as soon as it moves, so a drag follows it on the window until it lifts.
  const onPointerDown = (event: React.PointerEvent) => {
    dragged.current = false;
    if (event.button !== 0 || (event.target as Element).closest('input, select, textarea')) return;
    const pointer = event.pointerId, from = { x: event.clientX, y: event.clientY }, centre = centreNow();
    let moved = false;
    const move = (next: PointerEvent) => {
      if (next.pointerId !== pointer) return;
      const dx = next.clientX - from.x, dy = next.clientY - from.y;
      if (!moved && Math.hypot(dx, dy) < DRAG) return;
      moved = true;
      dragged.current = true;
      next.preventDefault();
      const element = bar()!;
      setMoving(clampBox({ x: centre.x + dx, y: centre.y + dy }, sizeOf(element), screen(), clearOf(element)));
    };
    const end = (last: PointerEvent) => {
      if (last.pointerId !== pointer) return;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      if (moved && last.type === 'pointerup') keep(folded);
      setMoving(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  };
  const at = moving ?? placed;
  return (
    <div ref={self} className={at ? 'fixed z-20' : className} style={at ? { left: at.left, top: at.top, touchAction: 'none' } : { ...style, touchAction: 'none' }}
      data-floating={id} data-folded={folded || undefined}
      onPointerDown={onPointerDown}
      // A drag that ended on a button is not a press of it.
      onClickCapture={event => { if (dragged.current) { event.stopPropagation(); event.preventDefault(); dragged.current = false; } }}>
      {folded ? (
        <Button size="round" variant="muted" aria-label={openLabel} title={openLabel} onClick={() => keep(false)}
          className="pointer-events-auto !size-14 border border-[color-mix(in_srgb,var(--home-ink)_12%,transparent)] bg-[color-mix(in_srgb,var(--home-paper)_72%,transparent)] shadow-[0_6px_24px_rgb(0_0_0/0.3)] backdrop-blur-[20px]">
          <Icon aria-hidden className="size-6 text-[var(--home-ink)]" />
        </Button>
      ) : children(() => keep(true))}
    </div>
  );
}
