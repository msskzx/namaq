'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * A passage's credit under a rule at the foot of its card (the book and page), folded; a click opens the edition and the
 * page's link. The reader's book sheets share it (BalaghaPanel, GharibPanel); the app has mobile/src/ui/Folded.tsx.
 */
export default function Folded({ credit, children }: { credit: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(was => !was)} aria-expanded={open}
        className="mt-2 flex min-h-9 w-full items-center gap-1.5 border-t border-[var(--home-rule)] pt-2 text-sm text-[var(--home-muted)]">
        {open ? <ChevronUp size={16} aria-hidden /> : <ChevronDown size={16} aria-hidden />}
        {credit}
      </button>
      {open && <div className="flex flex-col gap-1 text-sm leading-6 text-[var(--home-muted)]">{children}</div>}
    </>
  );
}
