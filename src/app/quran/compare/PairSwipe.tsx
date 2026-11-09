'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { reducedMotion, SLIDE, useSwipe } from '@/components/common/useSwipe';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';

/** `preview` is the neighbouring page itself (its first cards), drawn beside this one while swiping. */
export type PairStep = { href: string; label: string; preview?: React.ReactNode };

/** Room between the page and the neighbouring pair's card that comes in beside it. */
const GAP = 16;

/**
 * A sideways swipe moves to the next or previous surah pair, the way the branches trees do: forward is a drag to the
 * right in Arabic (the next pair sits on the left) and to the left in English. The page follows the finger with the
 * neighbouring pair's card beside it; past the threshold that card slides into place and its pair opens.
 * Key it by the pair so it starts fresh.
 */
export default function PairSwipe({ previous, next, ar, children }: { previous?: PairStep; next?: PairStep; ar: boolean; children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const lane = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const [settling, setSettling] = useState(false);
  // How far down the page the screen is, so the neighbouring page shows its top where the reader is looking.
  const [top, setTop] = useState(0);
  // The side being dragged toward (1 = the page moves right), kept while it slides back; only that neighbour is drawn.
  const [toward, setToward] = useState(0);
  const leaving = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const router = useNavigatingRouter();
  const target = (forward: boolean) => (forward ? next : previous);
  const sign = (forward: boolean) => (forward === ar ? 1 : -1);
  useEffect(() => () => clearTimeout(timer.current), []);
  const { justSwiped } = useSwipe(box, !!(previous || next), {
    allowed: () => !leaving.current && !document.querySelector('dialog[open]'),
    forward: dx => (ar ? dx > 0 : dx < 0),
    canStep: forward => !!target(forward),
    start: () => { clearTimeout(timer.current); setSettling(false); },
    drag: dx => {
      // Measured once a sideways drag begins, not on every touch.
      if (Math.sign(dx) !== toward) {
        setToward(Math.sign(dx));
        setTop(Math.max(0, -(lane.current?.getBoundingClientRect().top ?? 0) + 64));
      }
      setX(dx);
    },
    step: forward => {
      const to = target(forward);
      if (!to || leaving.current) return;
      leaving.current = true;
      // If the next pair never arrives (an offline phone), this one comes back after a while.
      const leave = () => { router.push(to.href); timer.current = setTimeout(() => { leaving.current = false; setSettling(true); setX(0); }, 8000); };
      if (reducedMotion()) { leave(); return; }
      setSettling(true);
      // Move by exactly the distance to the neighbour's card, so it ends where this page was.
      setToward(sign(forward));
      setX(sign(forward) * ((lane.current?.clientWidth ?? window.innerWidth) + GAP));
      timer.current = setTimeout(leave, SLIDE);
    },
    cancel: () => {
      setSettling(true);
      setX(0);
      timer.current = setTimeout(() => { setSettling(false); setToward(0); }, SLIDE);
    },
  });
  // The next pair's card sits on the side the page moves away from: left in Arabic, right in English.
  const side = (forward: boolean): React.CSSProperties => (sign(forward) > 0 ? { right: `calc(100% + ${GAP}px)` } : { left: `calc(100% + ${GAP}px)` });
  const neighbour = (forward: boolean) => {
    const step = target(forward);
    // Kept while sliding back, so the page doesn't return beside an empty gap.
    if (!step || sign(forward) !== toward || (!x && !settling)) return null;
    // Bounded to the page's height, so a long neighbour never adds scroll below this page.
    return <div aria-hidden inert data-pair-neighbour={forward ? 'next' : 'previous'} className="pointer-events-none absolute inset-y-0 w-full overflow-hidden" style={{ ...side(forward), paddingTop: top }}>
      {step.preview ?? <div className="flex flex-col items-center gap-2 rounded-lg border border-[var(--home-rule)] bg-[var(--home-card,var(--home-paper))] px-4 py-6 text-center">
        <ArrowLeftRight size={20} aria-hidden className="text-[var(--home-muted)]" />
        <span className="text-lg text-[var(--home-accent)]">{step.label}</span>
      </div>}
    </div>;
  };
  return <div ref={box} data-pair-swipe className="overflow-x-clip" onClickCapture={event => { if (justSwiped()) { event.preventDefault(); event.stopPropagation(); } }}>
    <div ref={lane} className="relative flex min-h-[60dvh] min-w-0 flex-col gap-4" style={{ transform: x ? `translate3d(${x}px, 0, 0)` : undefined, transition: settling ? `transform ${SLIDE}ms ease-out` : undefined }}>
      {neighbour(true)}
      {neighbour(false)}
      {children}
    </div>
  </div>;
}
