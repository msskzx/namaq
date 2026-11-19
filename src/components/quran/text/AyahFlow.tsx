import type { CSSProperties, ReactNode } from 'react';
import { FLOW_LINE, FLOW_SIZE } from '@shared/quran/quranText/flow';
import { mushafText } from '@shared/quran/mushafText';

/**
 * Ayah text off the page (owner, 2026-11-19: every ayah view keeps the mushaf's line size and height), as the app's AyahFlow:
 * the room the words flow in, sized from its own width as the reader's flowing text is (shared/quran/quranText/flow.ts).
 * Words and write boxes inside take that size (em); the place sets only colour, never a size.
 */
export default function AyahFlow({ children, row = false, className = '' }: { children: ReactNode;
  /** Pieces side by side, wrapping (words and boxes in a matrix row); otherwise one justified paragraph. */
  row?: boolean; className?: string }) {
  const size: CSSProperties = { fontSize: `${FLOW_SIZE * 100}cqi`, lineHeight: FLOW_LINE };
  return (
    // Spans shown as blocks, so it may sit in a paragraph, a button or a choice's label.
    <span className={`block w-full min-w-0 ${className}`} style={{ containerType: 'inline-size' }}>
      <span lang="ar" dir="rtl" data-ayah-flow className={`font-quran ${row ? 'flex flex-wrap items-center gap-x-[0.35em]' : 'block text-justify [text-align-last:right]'}`} style={size}>{children}</span>
    </span>
  );
}

/** Page words in an AyahFlow, at its size; `className` sets colour and marks only. */
export function AyahWords({ children, className }: { children: string; className?: string }) {
  return <span className={className}>{mushafText(children)}</span>;
}
