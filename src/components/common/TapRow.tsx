import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * A row of a drawing with no frame of its own, as the app's `ui/TapRow`: a link to what it names (`href`), or a button
 * that shows its source (`onClick`). At least 44 tall. The rows of the «حياته» timeline (components/tarajim/LifeTimeline.tsx).
 */
export default function TapRow({ href, onClick, label, className = '', children }: { href?: string; onClick?: () => void;
  /** Its name for a screen reader, where the words shown are not all of it (a card's source line: «المصدر: …»). */
  label?: string; className?: string; children: ReactNode }) {
  const look = `flex min-h-11 flex-1 items-center text-start hover:underline ${className}`;
  return href ? <Link href={href} aria-label={label} className={look}>{children}</Link> : <button type="button" onClick={onClick} aria-label={label} className={look}>{children}</button>;
}
