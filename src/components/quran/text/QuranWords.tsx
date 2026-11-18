import type { ReactNode } from 'react';

/** Page words set on their own in the mushaf font (a word list's chip, a picked word): the module's one way to set it inline. */
export default function QuranWords({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span lang="ar" className={`font-quran ${className}`}>{children}</span>;
}
