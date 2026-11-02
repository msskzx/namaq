'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Funnel, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { counted, num } from '@/lib/quran/arabicNumber';
import type { BranchesView } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';
import JuzFilter from './JuzFilter';

/** The funnel beside the search box: a sheet with the juz range, and a dot while the range is narrowed. */
export function FilterButton({ range, view }: { range: JuzRange | null; view: BranchesView }) {
  const ar = useLanguage().language === 'ar';
  const sheet = useRef<HTMLDialogElement>(null);
  const label = ar ? 'تصفية' : 'Filter';
  const close = ar ? 'إغلاق' : 'Close';
  return <>
    <span className="relative shrink-0">
      <Button size="lg" variant="muted" aria-haspopup="dialog" onClick={() => sheet.current?.showModal()} aria-label={label} title={label}><Funnel aria-hidden /></Button>
      {range && <span aria-hidden className="pointer-events-none absolute end-2 top-2 size-2 rounded-full bg-[var(--home-accent)]" />}
    </span>
    <dialog ref={sheet} aria-label={label} dir={ar ? 'rtl' : 'ltr'} onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] p-0 text-[var(--home-ink)] shadow-lg backdrop:bg-black/40 max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg">{label}</h2>
          <Button size="lg" variant="muted" onClick={() => sheet.current?.close()} aria-label={close} title={close}><X aria-hidden /></Button>
        </div>
        <JuzFilter range={range} view={view} />
      </div>
    </dialog>
  </>;
}

/** Above the tree while a search or a surah narrows the trees: the surah chip and where this tree sits among the results. */
export function ResultsBar({ surah, clear, position, total }: { surah?: string; clear: string; position?: number; total: number }) {
  const ar = useLanguage().language === 'ar';
  const remove = ar ? 'إزالة السورة' : 'Remove surah';
  return <div className="flex min-h-8 flex-wrap items-center justify-between gap-2 text-sm text-[var(--home-muted)]">
    {surah ? <span className="inline-flex items-center gap-1 rounded-full border border-[var(--home-rule)] ps-3 pe-1 py-0.5 text-[var(--home-ink)]">
      {ar ? `سورة ${surah}` : `Surah ${surah}`}
      <Link href={clear} scroll={false} aria-label={remove} title={remove} className="grid size-6 place-items-center rounded-full text-[var(--home-muted)] hover:bg-[var(--home-paper-deep)] hover:text-[var(--home-ink)]"><X size={14} aria-hidden /></Link>
    </span> : <span />}
    <span role="status" className="tabular-nums">{position
      ? (ar ? `${num(position)} من ${num(total)}` : `${position} of ${total}`)
      : (ar ? counted(total, ['شجرة', 'شجرتان', 'أشجار']) : `${total} trees`)}</span>
  </div>;
}

export function NoTrees({ query }: { query: string }) {
  const ar = useLanguage().language === 'ar';
  return <p role="status" className="text-sm text-[var(--home-muted)]">{query
    ? (ar ? `لا شجرة تطابق «${query}».` : `No tree matches «${query}».`)
    : (ar ? 'لا شجرة في هذا النطاق.' : 'No tree in this range.')}</p>;
}
