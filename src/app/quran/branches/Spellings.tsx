'use client';

import React, { useState } from 'react';

// docs/plans/quran-shared-openings.md
export default function Spellings({ children, list }: { children: React.ReactNode; list: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {children}
      <span className="flex flex-wrap items-center gap-2">
        <button type="button" aria-expanded={open} aria-label="تشكيل الكلمات في كل آية" onClick={() => setOpen(!open)}
          className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-full text-[var(--home-muted)] hover:text-[var(--home-ink)]">
          <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-current" />
        </button>
        {open && list}
      </span>
    </>
  );
}
