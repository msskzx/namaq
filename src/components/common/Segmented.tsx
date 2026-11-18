import React from 'react';
import Link from 'next/link';

/** `name` is what a screen reader says when the label is short (ع, EN); `id` and `controls` tie a tab to its panel. */
export type SegmentedOption = { key: string; label: string; name?: string; lang?: string; icon?: React.ReactNode; current: boolean; id?: string; controls?: string } & ({ href: string } | { onClick: () => void });

const OPTION = 'inline-flex items-center justify-center gap-2 rounded-md text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home-accent)]';
const STATE = (current: boolean) => (current ? 'bg-[var(--home-accent)] text-[var(--home-paper)] shadow-sm' : 'text-[var(--home-muted)] hover:text-[var(--home-ink)]');

/**
 * The one row of tabs or switches, as the app's `ui/Tabs`: a framed row, the open one filled in the accent.
 * For a few views of one thing (two books, a sheet's contents or search) pass `tabs`, which makes it a tablist;
 * without it the options are pressed buttons or links (a setting, a range). `fill` stretches the options across the row.
 * A list of words or filters that wraps is chips, not this.
 */
export default function Segmented({ label, options, className = '', iconOnly = false, tabs = false, fill = false }: { label: string; options: SegmentedOption[]; className?: string; iconOnly?: boolean; tabs?: boolean; fill?: boolean }) {
  const shape = `${iconOnly ? 'size-11 [&_svg]:size-5' : 'px-3 py-1.5'} ${fill ? 'flex-1' : ''}`;
  const text = (option: SegmentedOption) => iconOnly ? undefined : <span>{option.label}</span>;
  const named = (option: SegmentedOption) => iconOnly || option.name ? { 'aria-label': option.name ?? option.label, title: option.name ?? option.label } : {};
  const state = (option: SegmentedOption) => tabs ? { role: 'tab', 'aria-selected': option.current, id: option.id, 'aria-controls': option.controls } : { 'aria-pressed': option.current };
  return (
    <div role={tabs ? 'tablist' : 'group'} aria-label={label} className={`${fill ? 'flex w-full' : 'inline-flex max-w-full flex-wrap'} rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] p-1 ${className}`}>
      {options.map(option => 'href' in option ? (
        <Link key={option.key} href={option.href} scroll={false} data-range-navigation aria-current={option.current ? 'page' : undefined} lang={option.lang} className={`${OPTION} ${shape} ${STATE(option.current)}`} {...named(option)}>
          {option.icon}
          {text(option)}
        </Link>
      ) : (
        <button key={option.key} type="button" {...state(option)} onClick={option.onClick} lang={option.lang} className={`${OPTION} ${shape} ${STATE(option.current)}`} {...named(option)}>
          {option.icon}
          {text(option)}
        </button>
      ))}
    </div>
  );
}
