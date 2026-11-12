'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, Funnel, RotateCcw, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { useSwipeClose } from '@/components/common/useSwipeClose';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@shared/quran/arabicNumber';
import { plainName } from '@shared/quran/normalize';
import { JUZ_STARTS, type JuzRange } from '@shared/quran/juz';
import { RangeFields, rangeFromDraft, type RangeDraft } from './RangeFilter';
import RangeSelects, { type RangeOption } from './RangeSelects';
import ScopePicker, { type ScopeOption } from './ScopePicker';

export type FilterUnit = 'juz' | 'surah' | 'page' | 'surahs' | 'juzs';
const RANGE_MAX = { juz: 30, surah: 114, page: 604 };
export const scopeMax = (unit: FilterUnit) => (unit in RANGE_MAX ? RANGE_MAX[unit as keyof typeof RANGE_MAX] : 30);
export const isRangeUnit = (unit: FilterUnit) => unit === 'juz' || unit === 'surah' || unit === 'page';
/** The range as typed, or null while it is not a valid one. */
export const scopeRange = (unit: FilterUnit, values: RangeDraft) => rangeFromDraft(values, scopeMax(unit));

export type ScopeDraft = { unit: FilterUnit; values: RangeDraft; surahs?: string; juz?: string };

/** What to filter by: the unit dropdown, then its range or its picked chapters or juz. */
export function ScopeFields({ draft, onChange, range, allSurahs }: { draft: ScopeDraft; onChange: (draft: ScopeDraft) => void; range: JuzRange | null; allSurahs: ScopeOption[] }) {
  const ar = useLanguage().language === 'ar';
  const { unit } = draft;
  const max = scopeMax(unit);
  const units: { value: FilterUnit; label: string }[] = [
    { value: 'juz', label: ar ? 'من الجزء' : 'From juz' },
    { value: 'surah', label: ar ? 'من السورة' : 'From chapter' },
    { value: 'page', label: ar ? 'من الصفحة' : 'From page' },
    { value: 'surahs', label: ar ? 'سور محددة' : 'Specific chapters' },
    { value: 'juzs', label: ar ? 'أجزاء محددة' : 'Specific juz' },
  ];
  const fromLabel = unit === 'surah' ? (ar ? 'من السورة' : 'From chapter') : unit === 'page' ? (ar ? 'من الصفحة' : 'From page') : (ar ? 'من الجزء' : 'From juz');
  const toLabel = unit === 'surah' ? (ar ? 'إلى السورة' : 'To chapter') : unit === 'page' ? (ar ? 'إلى الصفحة' : 'To page') : (ar ? 'إلى الجزء' : 'To juz');
  const label = ar ? 'تصفية' : 'Filter';
  const show = (n: number) => (ar ? num(n) : String(n));
  const surahName = (n: number) => { const option = allSurahs.find(item => item.number === n); return (!ar && option?.nameEn) || plainName(option?.name ?? '').replace(/^سورة\s*/, ''); };
  // Surahs and juz are picked from lists that say which surah each number is; pages stay typed numbers.
  const listed: RangeOption[] | null = unit === 'surah' && allSurahs.length
    ? Array.from({ length: 114 }, (_, i) => ({ value: i + 1, label: `${show(i + 1)} ${surahName(i + 1)}`.trim() }))
    : unit === 'juz' && allSurahs.length
      ? JUZ_STARTS.map((start, i) => { const [surah, ayah] = start.split(':').map(Number); return { value: i + 1, label: `${show(i + 1)} · ${surahName(surah)} ${show(ayah)}` }; })
      : null;
  return <div className="flex flex-wrap items-start gap-2">
    <select aria-label={ar ? 'التصفية حسب' : 'Filter by'} value={unit} onChange={event => { const next = event.target.value as FilterUnit; onChange({ ...draft, unit: next, values: ['1', String(scopeMax(next))] }); }}
      className="h-9 max-w-[45%] shrink-0 rounded border border-[var(--home-rule)] bg-[var(--home-paper)] px-2 py-0 text-base">
      {units.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
    </select>
    {listed ? <div className="min-w-0 basis-full"><RangeSelects options={listed} draft={draft.values} onChange={values => onChange({ ...draft, values })} labels={{ from: fromLabel, to: toLabel, toText: ar ? 'إلى' : 'to' }} /></div>
      : isRangeUnit(unit) ? <RangeFields range={unit === 'juz' ? range : null} max={max} names={[`${unit}From`, `${unit}To`]} draft={draft.values} onChange={values => onChange({ ...draft, values })} iconOnly arabicDigits hideFromLabel hideReset
      labels={{ from: fromLabel, to: toLabel, toText: ar ? 'إلى' : 'to', form: label, all: ar ? 'الكل' : 'All', invalid: () => ar ? `أدخل رقمين من ١ إلى ${num(max)}، على أن تكون البداية قبل النهاية أو مساوية لها.` : `Enter whole numbers from 1 to ${max}, with From no greater than To.` }} />
      : <ScopePicker key={unit} name={unit === 'surahs' ? (ar ? 'ابحث عن سورة' : 'Find a chapter') : (ar ? 'ابحث عن جزء' : 'Find a juz')}
        value={unit === 'surahs' ? draft.surahs : draft.juz} onChange={value => onChange({ ...draft, [unit === 'surahs' ? 'surahs' : 'juz']: value })}
        options={unit === 'surahs' ? allSurahs : Array.from({ length: 30 }, (_, index) => ({ number: index + 1, name: ar ? `الجزء ${num(index + 1)}` : `Juz ${index + 1}` }))} />}
  </div>;
}

/** The funnel button and the panel it opens. `onSubmit` returns false to keep the panel open. */
export function FilterSheet({ active, onOpen, onSubmit, onReset, submitDisabled, top, children }: { active: boolean; onOpen: () => void; onSubmit: () => boolean | void; onReset: () => void; submitDisabled: boolean; top?: React.ReactNode; children: React.ReactNode }) {
  const ar = useLanguage().language === 'ar';
  const sheet = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLSpanElement>(null);
  const panelId = useId();
  const [expanded, setExpanded] = useState(false);
  const label = ar ? 'تصفية' : 'Filter';
  const close = ar ? 'إغلاق' : 'Close';
  const place = () => {
    const panel = sheet.current;
    const button = trigger.current;
    if (!panel || !button) return;
    const bounds = button.getBoundingClientRect();
    const position = bounds.bottom + 8;
    panel.style.top = `${position}px`;
    const buttonCenter = bounds.left + bounds.width / 2;
    const center = buttonCenter + (window.innerWidth / 2 - buttonCenter) / 3;
    panel.style.left = `${Math.max(8, Math.min(center - panel.offsetWidth / 2, window.innerWidth - panel.offsetWidth - 8))}px`;
    panel.style.maxHeight = `${Math.max(0, window.innerHeight - position - 8)}px`;
  };
  // The panel hangs below its button, so swiping it up closes it.
  useSwipeClose(sheet, expanded, { direction: 'up', onClose: () => closePanel() });
  useEffect(() => {
    if (!expanded) return;
    const onScroll = (event: Event) => { if (!sheet.current?.contains(event.target as Node)) place(); };
    window.addEventListener('resize', place);
    window.addEventListener('scroll', onScroll, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', onScroll, true); };
  }, [expanded]);
  const closePanel = () => { sheet.current?.hidePopover(); trigger.current?.querySelector('button')?.focus(); };
  const open = () => {
    if (expanded) { closePanel(); return; }
    onOpen();
    sheet.current?.showPopover();
    place();
    sheet.current?.querySelector<HTMLElement>('input:not([disabled]), select')?.focus();
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (onSubmit() !== false) closePanel();
  };
  return <>
    <span ref={trigger} className="relative shrink-0">
      <Button size="lg" variant="muted" aria-haspopup="dialog" aria-expanded={expanded} aria-controls={panelId} onClick={open} aria-label={label} title={label}><Funnel aria-hidden /></Button>
      {active && <span aria-hidden className="pointer-events-none absolute end-2 top-2 size-2 rounded-full bg-[var(--home-accent)]" />}
    </span>
    <div ref={sheet} id={panelId} popover="auto" role="dialog" aria-hidden={!expanded} aria-label={label} dir={ar ? 'rtl' : 'ltr'} onKeyDown={event => { event.stopPropagation(); if (event.key === 'Escape') { event.preventDefault(); closePanel(); } }} onToggle={event => setExpanded((event.nativeEvent as ToggleEvent).newState === 'open')}
      className="fixed m-0 w-[min(26rem,calc(100vw-1rem))] rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] p-0 text-[var(--home-ink)] shadow-lg overflow-hidden" style={{ inset: 'auto' }}>
      <form aria-label={label} onSubmit={submit} className="flex max-h-[inherit] flex-col">
        <div className="flex min-h-0 flex-col gap-3 overflow-y-auto p-4">
          <div className="flex items-center justify-between gap-3">
            {top ?? <span />}
            <Button size="lg" variant="muted" onClick={closePanel} aria-label={close} title={close}><X aria-hidden /></Button>
          </div>
          {children}
        </div>
        <div className="flex shrink-0 gap-2 border-t border-[var(--home-rule)] p-4">
          <Button className="flex-1" type="submit" variant="primary" disabled={submitDisabled}><Check size={16} aria-hidden />{ar ? 'تطبيق' : 'Apply'}</Button>
          <Button variant="neutral" onClick={onReset}><RotateCcw size={16} aria-hidden />{ar ? 'إعادة ضبط' : 'Reset'}</Button>
        </div>
      </form>
    </div>
  </>;
}
