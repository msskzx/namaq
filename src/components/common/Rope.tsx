'use client';

import { useId } from 'react';

const WAVE = 'M6 0 C 0 6, 0 14, 6 20 C 12 26, 12 34, 6 40';

/** One wavy strand running down whatever height it is given, after the theme's rope: a joined and continuous route. */
export default function Rope({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg aria-hidden width="12" className={className} style={{ minHeight: 40 }}>
      <defs>
        <pattern id={id} width="12" height="40" patternUnits="userSpaceOnUse">
          <path d={WAVE} stroke="currentColor" strokeWidth="1.25" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
