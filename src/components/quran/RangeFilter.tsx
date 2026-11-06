'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Check, RotateCcw } from 'lucide-react';
import Button from '@/components/common/Button';
import NumberInput from '@/components/common/NumberInput';
import { useLanguage } from '@/components/language/LanguageContext';
import type { JuzRange } from '@/lib/quran/juz';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';

export const NAVIGATING = 'range-filter:navigating';
export const announceNavigation = () => document.dispatchEvent(new Event(NAVIGATING));
export type RangeDraft = [string, string];
export type RangeLabels = { from: string; to: string; toText?: string; all: string; form: string; invalid: (range: JuzRange) => string };

export function rangeFromDraft(draft: RangeDraft, max: number): JuzRange | null {
  const [from, to] = draft.map(Number);
  return draft.every(value => value.trim() !== '' && Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= max) && from <= to ? { from, to } : null;
}

type FieldProps = { range: JuzRange | null; max: number; names: [string, string]; labels: RangeLabels; iconOnly?: boolean; arabicDigits?: boolean; hideFromLabel?: boolean; draft: RangeDraft; onChange: (draft: RangeDraft) => void };

export function RangeFields({ range, max, names, labels, iconOnly = false, arabicDigits = false, hideFromLabel = false, draft, onChange }: FieldProps) {
  const valid = rangeFromDraft(draft, max);
  return <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 text-sm">
    {[0, 1].map(index => <span key={index} className="flex items-center gap-2">
      {index === 1 ? labels.toText ?? labels.to : !hideFromLabel && labels.from}
      <NumberInput className="[&_input]:h-10" name={names[index]} label={index === 0 ? labels.from : labels.to} iconFamily="lucide" draftValue={draft[index]} onDraftChange={value => onChange(index === 0 ? [value, draft[1]] : [draft[0], value])} min={1} max={max} steppers={false} arabicDigits={arabicDigits} />
    </span>)}
    {(draft[0] !== '1' || draft[1] !== String(max)) && <Button variant="muted" size={iconOnly ? 'icon' : 'sm'} onClick={() => onChange(['1', String(max)])} aria-label={labels.all} title={labels.all}>
      <RotateCcw size={16} aria-hidden />{!iconOnly && labels.all}
    </Button>}
    {!valid && <p role="status" className="w-full text-sm text-[var(--home-muted)]">{labels.invalid(range ?? { from: 1, to: max })}</p>}
  </div>;
}

export default function RangeFilter(props: Omit<FieldProps, 'draft' | 'onChange'> & { href: (range?: JuzRange) => string }) {
  const { range, max, href, labels } = props;
  const ar = useLanguage().language === 'ar';
  const router = useNavigatingRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const route = `${pathname}?${params.toString()}`;
  const from = range?.from ?? 1;
  const to = range?.to ?? max;
  const [draft, setDraft] = useState<RangeDraft>([String(from), String(to)]);
  useEffect(() => { setDraft([String(from), String(to)]); }, [from, to, route]);
  const next = rangeFromDraft(draft, max);
  return <form aria-label={labels.form} className="flex flex-wrap items-center gap-3 text-sm" onSubmit={event => {
    event.preventDefault();
    if (next) router.replace(href(next.from === 1 && next.to === max ? undefined : next), { scroll: false });
  }}>
    <RangeFields {...props} draft={draft} onChange={setDraft} />
    <Button type="submit" size="sm" variant="primary" disabled={!next}><Check size={16} aria-hidden />{ar ? 'تطبيق' : 'Apply'}</Button>
  </form>;
}
