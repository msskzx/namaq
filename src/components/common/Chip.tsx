'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Check, X } from 'lucide-react';
import { num } from '@shared/quran/arabicNumber';

/**
 * The one chip, as the app's `ui/Chip`: a round, framed word to pick among others in a row (filters, a topic, a surah).
 * On, a chip is filled in the accent. `lit` chips (the words of an ayah, a tree's surahs) stay framed when on, in the
 * accent over a deeper paper, so the Quran's words keep their colour. `quran` sets the label in the mushaf font,
 * `dashed` marks the one to look at first, `small` sits in a row under a card, `count` follows the label.
 * Without `onClick` it is only a label. With `onClear` or `clearHref` it is a filter in use, removed by its ×.
 * A few views of one thing are tabs (Segmented), not chips. `className` is for its place only.
 */
export default function Chip({ label, on = false, onClick, role = 'button', name, check = false, lit = false, quran = false, dashed = false, small = false, count, onClear, clearHref, clearLabel, disabled = false, tapThrough = false, className = '' }: {
  label: ReactNode; on?: boolean; onClick?: () => void;
  /** `tab` for one word of several, `radio` for one of a set, `button` for a filter. */
  role?: 'button' | 'radio' | 'tab';
  /** What a screen reader says, when the label alone is not enough. */
  name?: string;
  check?: boolean; lit?: boolean; quran?: boolean; dashed?: boolean; small?: boolean; count?: number;
  onClear?: () => void; clearHref?: string; clearLabel?: string;
  disabled?: boolean;
  /** A double tap on it still reaches the card around it (saving a card), as on a compare card's ayah picker. */
  tapThrough?: boolean;
  className?: string;
}) {
  const size = small ? 'h-7 px-2.5 text-sm' : quran ? 'px-3.5 font-quran text-[1.375rem] leading-[1.8]' : 'min-h-9 px-3 text-[0.9375rem]';
  const base = `inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border ${size}`;
  if (onClear || clearHref) {
    const x = 'grid size-6 place-items-center rounded-full text-[var(--home-muted)] hover:bg-[var(--home-paper-deep)] hover:text-[var(--home-ink)]';
    return <span className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--home-rule)] ps-3 pe-1 ${small ? 'h-7 text-sm' : 'min-h-9 text-[0.9375rem]'} text-[var(--home-ink)] ${className}`}>
      {label}
      {clearHref ? <Link href={clearHref} scroll={false} aria-label={clearLabel} title={clearLabel} className={x}><X size={14} aria-hidden /></Link>
        : <button type="button" onClick={onClear} aria-label={clearLabel} title={clearLabel} className={x}><X size={14} aria-hidden /></button>}
    </span>;
  }
  const filled = on && !lit;
  const look = filled ? 'border-[var(--home-accent)] bg-[var(--home-accent)] text-[var(--home-paper)]'
    : on ? 'border-[var(--home-accent)] bg-[var(--home-paper-deep)] text-[var(--home-accent)]'
    : dashed ? 'border-dashed border-[var(--home-accent)] text-[var(--home-ink)]'
    : 'border-[var(--home-rule)] text-[var(--home-ink)]';
  const body = <>
    {check && on && <Check size={13} aria-hidden />}
    {label}
    {count !== undefined && <span className="text-xs opacity-70">{num(count)}</span>}
  </>;
  if (!onClick) return <span className={`${base} ${look} ${className}`}>{body}</span>;
  const state = role === 'tab' ? { role: 'tab', 'aria-selected': on } : role === 'radio' ? { role: 'radio', 'aria-checked': on } : { 'aria-pressed': on };
  return <button type="button" {...state} data-tap-through={tapThrough || undefined} onClick={onClick} disabled={disabled} aria-label={name} title={name}
    className={`${base} ${look} transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${on ? '' : 'hover:border-[var(--home-accent)]'} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home-accent)] ${className}`}>{body}</button>;
}
