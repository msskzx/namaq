import type { CSSProperties, ReactNode, Ref } from 'react';

/**
 * The small round pop-up over one button of an open menu, as a chat app's reactions (owner, 2026-11-19: the reader's
 * «نسيت» and «نسخ» ask in it whether they act on the ayah or the lit words). The menu places it; the app's is
 * FloatingMenu's `bubble`.
 */
export default function ReactionBubble({ label, style, tip, ref, children }: { label: string; style?: CSSProperties;
  /** The small tip pointing at the button: how far sideways from the bubble's middle, and whether it points down (the bubble above). */
  tip?: { x: number; down: boolean };
  ref?: Ref<HTMLDivElement>; children: ReactNode }) {
  return (
    <div ref={ref} role="group" aria-label={label} style={style}
      className="absolute z-[1] flex max-w-[calc(100vw-1rem)] gap-0.5 rounded-[2.25rem] border border-[var(--home-accent)] bg-[var(--home-paper)] p-1 shadow-[0_8px_24px_rgb(0_0_0/0.25)]">
      {tip && <span aria-hidden className={`pointer-events-none absolute size-3 rotate-45 border-[var(--home-accent)] bg-[var(--home-paper)] ${tip.down ? '-bottom-[7px] border-b border-r' : '-top-[7px] border-l border-t'}`}
        style={{ left: `calc(50% + ${tip.x}px - 6px)` }} />}
      {children}
    </div>
  );
}
