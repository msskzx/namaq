import type { CSSProperties, ReactNode } from 'react';
import { FLOW_LINE, FLOW_SIZE } from '@shared/quran/quranText/flow';
import { mushafText } from '@shared/quran/mushafText';

/** Tailwind needs each clamp written out whole; a clamp is its own box, so it stands in for `block`. */
const CLAMP = { 2: 'line-clamp-2', 3: 'line-clamp-3', 4: 'line-clamp-4', 5: 'line-clamp-5', 6: 'line-clamp-6' } as const;

/**
 * Ayah text off the page (owner, 2026-11-19: every ayah view keeps the mushaf's line size and height), as the app's AyahFlow:
 * the room the words flow in, sized from its own width as the reader's flowing text is (shared/quran/quranText/flow.ts).
 * Words and write boxes inside take that size (em); the place sets only colour, never a size.
 */
export default function AyahFlow({ children, row = false, lines, className = '' }: { children: ReactNode;
  /** Pieces side by side, wrapping (words and boxes in a matrix row); otherwise one justified paragraph. */
  row?: boolean;
  /** At most this many lines, the rest cut (a note's ayah over its text); not with `row`. */
  lines?: 2 | 3 | 4 | 5 | 6; className?: string }) {
  const size: CSSProperties = { fontSize: `${FLOW_SIZE * 100}cqi`, lineHeight: FLOW_LINE };
  return (
    // Spans shown as blocks, so it may sit in a paragraph, a button or a choice's label.
    <span className={`block w-full min-w-0 ${className}`} style={{ containerType: 'inline-size' }}>
      <span lang="ar" dir="rtl" data-ayah-flow className={`font-quran ${row ? 'flex flex-wrap items-center gap-x-[0.35em]' : `${lines ? CLAMP[lines] : 'block'} text-justify [text-align-last:right]`}`} style={size}>{children}</span>
    </span>
  );
}

/** Page words in an AyahFlow, at its size; `className` sets colour and marks only. */
export function AyahWords({ children, className }: { children: string; className?: string }) {
  return <span className={className}>{mushafText(children)}</span>;
}
