import type { ReactNode } from 'react';

/**
 * Words someone says, with who says them on a muted line before them (owner 2026-11-20: «قال فلان:» first, as the hadith
 * and the sira put the speaker; the app's ui/Saying). `by` left out draws the words alone (the author's own).
 */
export default function Saying({ by, className = 'gap-0.5', children }: { by?: string;
  /** Layout only: the gap between the sayer's line and the words. */
  className?: string; children: ReactNode }) {
  return (
    <div className={`flex flex-col ${className}`}>
      {by && <p className="text-sm text-[var(--home-muted)]">{by}</p>}
      {children}
    </div>
  );
}
