'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * A passage's credit under a rule at the foot of its card (the book and page), folded; a click opens the edition and the
 * page's link. Also the list of ayat a balagha quote fits when its paragraph names none. The reader's book sheets share it (BalaghaPanel, GharibPanel); the app has mobile/src/ui/Folded.tsx.
 */
export default function Folded({ credit, children, startOpen = false, bare = false }: { credit: string; children: ReactNode;
  /** Open at first (a story's ayat, owner 2026-11-18), as the app's Folded `startOpen`. */
  startOpen?: boolean;
  /** Its contents keep their own look (cards, the mushaf's lines) instead of the muted small text of a credit. */
  bare?: boolean }) {
  const [open, setOpen] = useState(startOpen);
  return (
    <>
      <button type="button" onClick={() => setOpen(was => !was)} aria-expanded={open}
        className="mt-2 flex min-h-9 w-full items-center gap-1.5 border-t border-[var(--home-rule)] pt-2 text-sm text-[var(--home-muted)]">
        {open ? <ChevronUp size={16} aria-hidden /> : <ChevronDown size={16} aria-hidden />}
        {credit}
      </button>
      {open && <div className={bare ? 'flex flex-col gap-2.5 pt-1' : 'flex flex-col gap-1 text-sm leading-6 text-[var(--home-muted)]'}>{children}</div>}
    </>
  );
}
