'use client';

import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { BookOpen, RotateCcw } from 'lucide-react';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useLanguage } from '@/components/language/LanguageContext';
import PageSpread, { MatchLegend } from '@/components/quran/PageSpread';
import { num } from '@/lib/quran/arabicNumber';
import type { AyahContext, Surrounding } from '@/lib/quran/ayahContext';
import { loadContext, MAX_KEYS, sharedMarks } from './AyahContext';
import TreeSteps, { type Steps } from './TreeSteps';
import styles from './AyahCards.module.css';

const COLUMNS = ['before', 'ayah', 'after'] as const;
type Column = typeof COLUMNS[number];

export default function AyahCards({ ayahKeys, names, steps }: { ayahKeys: string[]; names: Record<number, string>; steps?: Steps }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const shown = ayahKeys.slice(0, MAX_KEYS);
  const [column, setColumn] = useState(1);
  const { data, error, isLoading, mutate } = useSWR<AyahContext[]>(`/api/quran/context?${new URLSearchParams({ q: shown.join(',') })}`, loadContext, { revalidateOnFocus: false });
  const { data: around, error: aroundError, mutate: retryAround } = useSWR<Surrounding>(`/api/quran/surrounding?${new URLSearchParams({ before: shown.join(','), after: shown.join(',') })}`, async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Could not load surrounding ayat');
    return response.json();
  }, { revalidateOnFocus: false });
  const exactLabel = ar ? 'الكلمة نفسها' : 'Same word';
  const rootLabel = ar ? 'الجذر نفسه' : 'Same root';
  const headings: Record<Column, string> = ar ? { before: 'الآية السابقة', ayah: 'آيات الشجرة', after: 'الآية التالية' } : { before: 'Previous ayah', ayah: 'Tree ayat', after: 'Next ayah' };
  const read = ar ? 'قراءة الآية' : 'Read ayah';

  const track = useRef<HTMLDivElement>(null);
  const head = (i: number) => track.current?.querySelector<HTMLElement>(`[data-head="${i}"]`);
  const goTo = (i: number, behavior: ScrollBehavior = 'smooth') => {
    setColumn(i);
    head(i)?.scrollIntoView?.({ behavior, inline: 'center', block: 'nearest' });
  };
  const centred = () => {
    const box = track.current?.getBoundingClientRect();
    if (!box) return;
    const middle = box.left + box.width / 2;
    let best = column;
    let distance = Infinity;
    COLUMNS.forEach((_, i) => {
      const rect = head(i)?.getBoundingClientRect();
      if (!rect) return;
      const gap = Math.abs(rect.left + rect.width / 2 - middle);
      if (gap < distance) { distance = gap; best = i; }
    });
    if (best !== column) setColumn(best);
  };
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onScroll = () => {
    clearTimeout(settle.current);
    settle.current = setTimeout(centred, 80);
  };
  const ready = !!data && !!around;
  useEffect(() => {
    if (ready) head(1)?.scrollIntoView?.({ behavior: 'instant', inline: 'center', block: 'nearest' });
  }, [ready]);

  const stepRef = useRef<(forward: boolean) => void>(() => {});
  stepRef.current = forward => {
    const i = column + (forward ? 1 : -1);
    if (i >= 0 && i < COLUMNS.length) goTo(i);
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || document.querySelector('dialog[open]')) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]')) return;
      stepRef.current(event.key === 'ArrowLeft');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const contexts = data && shown.map(key => data.find(item => item.ayah.key === key));
  const missing = contexts?.some(context => !context);

  const cell = (context: AyahContext, at: Column, row: number, i: number) => {
    const ayah = at === 'ayah' ? context.ayah : around![at === 'before' ? 'before' : 'after'][context.ayah.key];
    const current = i === column;
    const key = `${row}:${at}`;
    const props = { 'data-col': i, 'data-current': current || undefined, className: styles.cell, onClick: current ? undefined : () => goTo(i) };
    if (!ayah) return <div key={key} {...props} />;
    const [surah, number] = ayah.key.split(':').map(Number);
    const name = names[surah] ?? (ar ? `سورة ${num(surah)}` : `Surah ${surah}`);
    return <div key={key} {...props}>
      <PageSpread pages={[{
        title: name,
        subtitle: ar ? `الآية ${num(number)}` : `Ayah ${number}`,
        label: `${name} ${ar ? num(number) : number}`,
        rows: [
          ...(at === 'after' && 'basmala' in ayah && ayah.basmala ? [[{ number: 0, words: ayah.basmala, bare: true }]] : []),
          [{ number, words: ayah.words, current: at === 'ayah', marks: at === 'ayah' ? sharedMarks(context, exactLabel, rootLabel) : undefined }],
        ],
        action: current ? <Button size="icon" variant="muted" href={`/quran/read/${ayah.page}?a=${ayah.key}`} aria-label={read} title={read}><BookOpen size={16} aria-hidden /></Button> : undefined,
      }]} />
    </div>;
  };

  return (
    <section aria-label={ar ? 'آيات الشجرة في سياقها' : 'Tree ayat in context'} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {steps && <TreeSteps steps={steps} />}
        {shown.length > 1 && <MatchLegend exact={exactLabel} root={rootLabel} />}
      </div>
      {isLoading && <LoadingSpinner />}
      {(error || aroundError || missing) && <div role="alert"><p>{ar ? 'تعذّر تحميل الآيات.' : 'Could not load the ayat.'}</p><Button size="lg" onClick={() => { void mutate(); void retryAround(); }} aria-label={ar ? 'إعادة المحاولة' : 'Try again'} title={ar ? 'إعادة المحاولة' : 'Try again'}><RotateCcw aria-hidden /></Button></div>}
      {contexts && around && !missing && <div ref={track} dir="rtl" className={styles.track} onScroll={onScroll}>
        {COLUMNS.map((at, i) => <button key={at} type="button" data-head={i} data-current={i === column || undefined} aria-pressed={i === column} className={styles.head} onClick={() => goTo(i)}>{headings[at]}</button>)}
        {contexts.map((context, row) => COLUMNS.map((at, i) => cell(context!, at, row, i)))}
      </div>}
    </section>
  );
}
