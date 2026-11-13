'use client';

import Link from 'next/link';
import { ArrowLeftRight } from 'lucide-react';
import useDismissable from '@/components/common/useDismissable';
import type { CompareLink } from '@/app/quran/compare/pairCards';

/** The compare pages holding a kept card of these ayat: one opens at once, several open a list to choose from. */
/** `side` is the edge the list hangs from: `start` for a button on the right edge of a right-to-left card. */
export default function CompareLinks({ links, label, className, side = 'end' }: { links: CompareLink[]; label: string; className: string; side?: 'start' | 'end' }) {
  const ref = useDismissable<HTMLDetailsElement>();
  if (!links.length) return null;
  if (links.length === 1) return <Link href={links[0].href} aria-label={label} title={label} className={className}><ArrowLeftRight size={16} aria-hidden /></Link>;
  return (
    <details ref={ref} className="relative">
      <summary aria-label={label} title={label} className={`flex cursor-pointer list-none [&::-webkit-details-marker]:hidden ${className}`}>
        <ArrowLeftRight size={16} aria-hidden />
      </summary>
      <div className={`absolute top-full ${side === 'start' ? 'start-0' : 'end-0'} z-30 mt-1 flex w-72 max-w-[calc(100vw-2rem)] flex-col gap-1 rounded-md border border-[var(--home-rule)] bg-[var(--home-paper)] p-2 shadow-lg`}>
        <p className="px-2 text-sm font-semibold">افتح في المقارنة</p>
        {links.map(link => <Link key={link.href} href={link.href} className="rounded px-2 py-2 text-sm hover:bg-[var(--home-paper-deep)]">{link.label}</Link>)}
      </div>
    </details>
  );
}
