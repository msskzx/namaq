'use client';

import { useEffect, useRef, useState } from 'react';
import { Ellipsis, type LucideIcon } from 'lucide-react';
import Button from './Button';

/** One choice of a «⋯» menu: its icon, its name under it, what a screen reader says, and what it does. */
export type MoreItem = { Icon: LucideIcon; name: string; label: string; onClick: () => void };

/**
 * A card's «⋯» (owner, 2026-11-20; the app's ui/MoreMenu): alone at the far end of its row, it opens a small menu over it
 * with its choices («ليس من اهتماماتي»); a click outside or Escape closes it. Nothing is drawn when there is no choice.
 */
export default function MoreMenu({ items, label = 'خيارات البطاقة' }: { items: MoreItem[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !box.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);
  if (!items.length) return null;
  return (
    <span ref={box} className="relative ms-auto">
      <Button size="lg" variant="muted" aria-label={label} title={label} aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(!open)}><Ellipsis aria-hidden /></Button>
      {open && <span role="menu" aria-label={label} className="absolute end-0 bottom-full z-20 mb-1 flex gap-1 rounded-xl border border-[var(--home-rule)] bg-[var(--home-paper)] p-1.5 shadow-lg">
        {items.map(item => (
          <Button key={item.name} size="act" variant="muted" role="menuitem" aria-label={item.label} onClick={() => { setOpen(false); item.onClick(); }}>
            <item.Icon aria-hidden /><span className="whitespace-nowrap">{item.name}</span>
          </Button>
        ))}
      </span>}
    </span>
  );
}
