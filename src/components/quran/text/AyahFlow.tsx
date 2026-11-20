import type { CSSProperties, ReactNode } from 'react';
import { CARD_MARGINS, FLOW_LINE, FLOW_SIZE, PHONE_WIDTH } from '@shared/quran/quranText/flow';
import { mushafText } from '@shared/quran/mushafText';

/** Tailwind needs each clamp written out whole; a clamp is its own box, so it stands in for `block`. */
const CLAMP = { 2: 'line-clamp-2', 3: 'line-clamp-3', 4: 'line-clamp-4', 5: 'line-clamp-5', 6: 'line-clamp-6' } as const;

/**
 * Ayah text off the page (owner, 2026-11-19: every ayah view keeps the mushaf's line size and height), as the app's AyahFlow:
 * the room the words flow in, sized from its own width as the reader's flowing text is (shared/quran/quranText/flow.ts).
 * Words and write boxes inside take that size (em); the place sets only colour, never a size.
 */
export default function AyahFlow({ children, row = false, center = false, lines, className = '' }: { children: ReactNode;
  /** Pieces side by side, wrapping (words and boxes in a matrix row); otherwise one justified paragraph. */
  row?: boolean;
  /** Lines centred instead of justified (a narration between a dialogue's turns), as the app's. */
  center?: boolean;
  /** At most this many lines, the rest cut (a note's ayah over its text); not with `row`. */
  lines?: 2 | 3 | 4 | 5 | 6; className?: string }) {
  const size: CSSProperties = { fontSize: `${FLOW_SIZE * 100}cqi`, lineHeight: FLOW_LINE };
  return (
    // Spans shown as blocks, so it may sit in a paragraph, a button or a choice's label.
    <span className={`block w-full min-w-0 ${className}`} style={{ containerType: 'inline-size' }}>
      <span lang="ar" dir="rtl" data-ayah-flow className={`font-quran ${row ? 'flex flex-wrap items-center gap-x-[0.35em]' : `${lines ? CLAMP[lines] : 'block'} ${center ? 'text-center' : 'text-justify [text-align-last:right]'}`}`} style={size}>{children}</span>
    </span>
  );
}

/** Page words in an AyahFlow, at its size; `className` sets colour and marks only. */
export function AyahWords({ children, className }: { children: string; className?: string }) {
  return <span className={className}>{mushafText(children)}</span>;
}

/** A word on its own, as the app's wordFontSize: the size an ayah has in a card on a phone, never bigger on a wider window. */
const WORD_SIZE: CSSProperties = { fontSize: `calc(${FLOW_SIZE} * (min(100vw, ${PHONE_WIDTH}px) - ${CARD_MARGINS}px))`, lineHeight: FLOW_LINE };

/**
 * A Quran word (or a few) on its own, outside an ayah (owner, 2026-11-20: one word size), as the app's QuranWord: a word
 * list's row, the picked word of an i'rab sheet, a reading, a legend's sample. `className` sets colour and room only.
 */
export function QuranWord({ children, className = '' }: { children: string; className?: string }) {
  return <span lang="ar" dir="rtl" className={`font-quran ${className}`} style={WORD_SIZE}>{mushafText(children)}</span>;
}

/**
 * A tree box's words, as the app's TreeText (owner, 2026-11-20: trees take the reader's size too, as they zoom): the word
 * size, the flowing line height, as a block in the box. `className` sets colour only.
 */
export function TreeText({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span lang="ar" data-tree-text className={`block font-quran ${className}`} style={WORD_SIZE}>{children}</span>;
}
