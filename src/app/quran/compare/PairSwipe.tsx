'use client';

import React, { useRef, useState } from 'react';
import { reducedMotion, SLIDE, SWIPE, useSwipe } from '@/components/common/useSwipe';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';

export type PairStep = { href: string; label: string };

/**
 * A sideways swipe moves to the next or previous surah pair (finger to the right = next, as on the branches cards).
 * The page follows the finger and the pair it leads to shows at the uncovered edge. Key it by the pair so it starts fresh.
 */
export default function PairSwipe({ previous, next, children }: { previous?: PairStep; next?: PairStep; children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const [settling, setSettling] = useState(false);
  const router = useNavigatingRouter();
  const target = (forward: boolean) => (forward ? next : previous);
  const { justSwiped } = useSwipe(box, !!(previous || next), {
    allowed: () => !document.querySelector('dialog[open]'),
    forward: dx => dx > 0,
    canStep: forward => !!target(forward),
    start: () => setSettling(false),
    drag: setX,
    step: forward => {
      const to = target(forward);
      if (!to) return;
      if (reducedMotion()) { router.push(to.href); return; }
      setSettling(true);
      setX((forward ? 1 : -1) * window.innerWidth);
      setTimeout(() => router.push(to.href), SLIDE);
    },
    cancel: () => { setSettling(true); setX(0); },
  });
  const peek = x > 0 ? next : x < 0 ? previous : undefined;
  return <div ref={box} data-pair-swipe className="relative min-h-[60dvh] overflow-x-clip" onClickCapture={event => { if (justSwiped()) { event.preventDefault(); event.stopPropagation(); } }}>
    {peek && <div aria-hidden className={`pointer-events-none fixed top-1/2 z-10 max-w-[45vw] -translate-y-1/2 rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] px-3 py-2 text-sm text-[var(--home-accent)] shadow ${x > 0 ? 'left-2' : 'right-2'}`}
      style={{ opacity: Math.min(1, Math.abs(x) / SWIPE) }}>{peek.label}</div>}
    <div className="flex min-w-0 flex-col gap-4" style={{ transform: x ? `translateX(${x}px)` : undefined, transition: settling ? `transform ${SLIDE}ms ease-out` : undefined }}>{children}</div>
  </div>;
}
