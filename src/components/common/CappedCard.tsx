'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CARD_CAP_SHARE } from '@shared/homeFeed';
import Card from './Card';
import Button from './Button';
import Sheet from './Sheet';

/**
 * A feed card whose content can run long (owner, 2026-11-20; the app's ui/Card `CardWithRow` `cap`): past CARD_CAP_SHARE of
 * the screen it stops with a fade, and «اقرأ كاملًا» under it opens `whole` (the content again, with the card's buttons and
 * source line at its foot) in a sheet. Shorter content shows as a plain card. `className` is the card's, as on `Card`.
 */
export default function CappedCard({ className, whole, children }: { className?: string; whole: ReactNode; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [capped, setCapped] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const frame = box.current;
    if (!frame) return;
    const measure = () => setCapped(frame.scrollHeight > frame.clientHeight + 1);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const watch = new ResizeObserver(measure);
    watch.observe(frame);
    if (frame.firstElementChild) watch.observe(frame.firstElementChild);
    return () => watch.disconnect();
  }, []);
  return <>
    <Card className={className}>
      <div ref={box} className="relative overflow-hidden" style={{ maxHeight: `${Math.round(CARD_CAP_SHARE * 100)}svh` }}>
        <div>{children}</div>
        {capped && <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[4.5rem] bg-gradient-to-b from-transparent to-[var(--home-card)]" />}
      </div>
    </Card>
    {capped && <Button variant="ghost" className="self-start" onClick={() => setOpen(true)}>اقرأ كاملًا</Button>}
    <Sheet open={open} onClose={() => setOpen(false)} label="اقرأ كاملًا" className="overflow-y-auto">
      {open && <div className="flex flex-col gap-1 p-3">{whole}</div>}
    </Sheet>
  </>;
}
