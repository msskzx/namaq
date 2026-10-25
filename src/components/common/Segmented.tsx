import React from 'react';
import Link from 'next/link';

export type SegmentedOption = { key: string; label: string; icon?: React.ReactNode; current: boolean } & ({ href: string } | { onClick: () => void });

const OPTION = 'inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home-accent)]';
const STATE = (current: boolean) => (current ? 'bg-[var(--home-accent)] text-[var(--home-paper)] shadow-sm' : 'text-[var(--home-muted)] hover:text-[var(--home-ink)]');

export default function Segmented({ label, options, className = '' }: { label: string; options: SegmentedOption[]; className?: string }) {
  return (
    <div role="group" aria-label={label} className={`inline-flex max-w-full flex-wrap rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] p-1 ${className}`}>
      {options.map(option => 'href' in option ? (
        <Link key={option.key} href={option.href} scroll={false} data-range-navigation aria-current={option.current ? 'page' : undefined} className={`${OPTION} ${STATE(option.current)}`}>
          {option.icon}
          <span>{option.label}</span>
        </Link>
      ) : (
        <button key={option.key} type="button" aria-pressed={option.current} onClick={option.onClick} className={`${OPTION} ${STATE(option.current)}`}>
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
