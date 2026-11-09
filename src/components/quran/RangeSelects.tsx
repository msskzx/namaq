'use client';

import React, { useEffect } from 'react';
import type { RangeDraft } from './RangeFilter';

export type RangeOption = { value: number; label: string };

/**
 * From and to as two lists (a picker wheel on phones), each option naming what the number is, such as «٧٠ المعارج».
 * The to list starts at the from value, so the range is always valid; moving from past to pulls to along.
 */
export default function RangeSelects({ options, draft, onChange, labels }: { options: RangeOption[]; draft: RangeDraft; onChange: (draft: RangeDraft) => void; labels: { from: string; to: string; toText: string } }) {
  const last = options[options.length - 1]?.value ?? 1;
  const from = Math.min(Math.max(Math.trunc(Number(draft[0])) || 1, 1), last);
  const to = Math.min(Math.max(Math.trunc(Number(draft[1])) || last, from), last);
  // A range from the address bar may be backwards or out of bounds: keep the draft equal to what the lists show.
  useEffect(() => { if (draft[0] !== String(from) || draft[1] !== String(to)) onChange([String(from), String(to)]); }, [draft, from, to, onChange]);
  const select = 'h-10 min-w-0 flex-1 rounded border border-[var(--home-rule)] bg-[var(--home-paper)] px-2 py-1.5 text-base';
  return <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
    <select aria-label={labels.from} value={from} className={select}
      onChange={event => { const value = Number(event.target.value); onChange([String(value), String(Math.max(value, to))]); }}>
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    <span className="shrink-0">{labels.toText}</span>
    <select aria-label={labels.to} value={to} className={select} onChange={event => onChange([String(from), event.target.value])}>
      {options.filter(option => option.value >= from).map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </div>;
}
