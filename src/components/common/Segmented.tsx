import React from 'react';
import Link from 'next/link';

export type SegmentedOption = { key: string; label: string; icon?: React.ReactNode; current: boolean } & ({ href: string } | { onClick: () => void });

const OPTION = 'inline-flex items-center justify-center gap-2 rounded-md text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home-accent)]';
const STATE = (current: boolean) => (current ? 'bg-[var(--home-accent)] text-[var(--home-paper)] shadow-sm' : 'text-[var(--home-muted)] hover:text-[var(--home-ink)]');

export default function Segmented({ label, options, className = '', iconOnly = false }: { label: string; options: SegmentedOption[]; className?: string; iconOnly?: boolean }) {
  const shape = iconOnly ? 'size-11 [&_svg]:size-5' : 'px-3 py-1.5';
  const text = (option: SegmentedOption) => iconOnly ? undefined : <span>{option.label}</span>;
  const named = (option: SegmentedOption) => iconOnly ? { 'aria-label': option.label, title: option.label } : {};
  return (
    <div role="group" aria-label={label} className={`inline-flex max-w-full flex-wrap rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] p-1 ${className}`}>
      {options.map(option => 'href' in option ? (
        <Link key={option.key} href={option.href} scroll={false} data-range-navigation aria-current={option.current ? 'page' : undefined} className={`${OPTION} ${shape} ${STATE(option.current)}`} {...named(option)}>
          {option.icon}
          {text(option)}
        </Link>
      ) : (
        <button key={option.key} type="button" aria-pressed={option.current} onClick={option.onClick} className={`${OPTION} ${shape} ${STATE(option.current)}`} {...named(option)}>
          {option.icon}
          {text(option)}
        </button>
      ))}
    </div>
  );
}
