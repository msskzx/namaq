'use client';

import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { ArrowLeft, ArrowRight, BookOpen, GitBranch, Highlighter, RotateCcw } from 'lucide-react';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';
import { useLanguage } from '@/components/language/LanguageContext';
import PageSpread, { MatchLegend } from '@/components/quran/PageSpread';
import { num } from '@/lib/quran/arabicNumber';
import type { AyahContext, Surrounding } from '@/lib/quran/ayahContext';
import { loadContext, MAX_KEYS, sharedMarks } from './AyahContext';
import TreeSteps, { type Steps } from './TreeSteps';
import styles from './AyahCards.module.css';

const COLUMNS = ['before', 'ayah', 'after'] as const;
const SWIPE = 50;
const SETTLE = 600;
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
  const sideKeys = (side: 'before' | 'after') => around && [...new Set(Object.values(around[side]).flatMap(ayah => ayah ? [ayah.key] : []))];
  const sideUrl = (keys?: string[]) => keys && keys.length > 1 ? `/api/quran/context?${new URLSearchParams({ q: keys.slice(0, MAX_KEYS).join(',') })}` : null;
  const { data: beforeMatch } = useSWR<AyahContext[]>(sideUrl(sideKeys('before')), loadContext, { revalidateOnFocus: false });
  const { data: afterMatch } = useSWR<AyahContext[]>(sideUrl(sideKeys('after')), loadContext, { revalidateOnFocus: false });
  const exactLabel = ar ? 'نفس الكلمة' : 'Same word';
  const rootLabel = ar ? 'نفس الجذر' : 'Same root';
  const read = ar ? 'قراءة الآية' : 'Read ayah';
  const legend = ar ? 'دليل الألوان' : 'Colour key';

  const track = useRef<HTMLDivElement>(null);
  const head = (i: number) => track.current?.querySelector<HTMLElement>(`[data-col="${i}"]`);
  const goTo = (i: number, behavior: ScrollBehavior = 'smooth') => {
    const box = track.current?.getBoundingClientRect();
    const rect = head(i)?.getBoundingClientRect();
    const left = box && rect ? rect.left + rect.width / 2 - (box.left + box.width / 2) : 0;
    if (Math.abs(left) > 1 && track.current?.scrollBy) track.current.scrollBy({ left, behavior });
    else setColumn(i);
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
    const element = track.current;
    if (!ready || !element) return;
    const place = () => element.clientWidth > 0 && (goTo(1, 'instant'), true);
    void document.fonts?.ready.then(() => { if (element.isConnected) place(); });
    if (place() || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => { if (place()) observer.disconnect(); });
    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const router = useNavigatingRouter();
  const arrived = useRef(0);
  useEffect(() => { arrived.current = Date.now(); }, [column]);
  const leave = (forward: boolean) => {
    const href = forward ? steps?.next : steps?.previous;
    if (!href || column !== (forward ? COLUMNS.length - 1 : 0)) return false;
    router.push(href, { scroll: false });
    return true;
  };
  const stepRef = useRef<(forward: boolean) => void>(() => {});
  stepRef.current = forward => {
    const i = column + (forward ? 1 : -1);
    if (i >= 0 && i < COLUMNS.length) goTo(i);
    else leave(forward);
  };
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (event: React.TouchEvent) => {
    swipe.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    const start = swipe.current;
    const end = event.changedTouches[0];
    swipe.current = null;
    if (!start || event.touches.length || !end || Date.now() - arrived.current < SETTLE) return;
    const dx = end.clientX - start.x;
    if (Math.abs(dx) >= SWIPE && Math.abs(dx) > 2 * Math.abs(end.clientY - start.y)) leave(dx > 0);
  };
  const onWheel = (event: React.WheelEvent) => {
    if (Math.abs(event.deltaX) < SWIPE || Math.abs(event.deltaX) < 2 * Math.abs(event.deltaY) || Date.now() - arrived.current < SETTLE) return;
    if (leave(event.deltaX < 0)) arrived.current = Date.now();
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || document.querySelector('dialog[open]')) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]')) return;
      event.preventDefault();
      stepRef.current(event.key === 'ArrowLeft');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const contexts = data && shown.map(key => data.find(item => item.ayah.key === key));
  const missing = contexts?.some(context => !context);

  const marksFor = (at: Column, context: AyahContext, key: string) => {
    const match = at === 'ayah' ? context : (at === 'before' ? beforeMatch : afterMatch)?.find(item => item.ayah.key === key);
    return match && sharedMarks(match, exactLabel, rootLabel);
  };
  const cell = (context: AyahContext, at: Column, row: number, i: number) => {
    const ayah = at === 'ayah' ? context.ayah : around![at === 'before' ? 'before' : 'after'][context.ayah.key];
    const current = i === column;
    const key = `${row}:${at}`;
    const props = { 'data-col': i, 'data-first': row === 0 || undefined, 'data-current': current || undefined, className: styles.cell, onClick: current ? undefined : () => goTo(i) };
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
          [{ number, words: ayah.words, current: at === 'ayah', marks: marksFor(at, context, ayah.key) }],
        ],
        action: current ? <Button size="icon" variant="muted" href={`/quran/read/${ayah.page}?a=${ayah.key}`} aria-label={read} title={read}><BookOpen size={16} aria-hidden /></Button> : undefined,
      }]} />
    </div>;
  };

  const edge = (forward: boolean) => {
    const href = forward ? steps?.next : steps?.previous;
    if (!href) return null;
    const label = forward ? (ar ? 'الشجرة التالية' : 'Next tree') : (ar ? 'الشجرة السابقة' : 'Previous tree');
    const Arrow = forward ? ArrowLeft : ArrowRight;
    return <div className={styles.edge} data-edge={forward ? 'next' : 'previous'} style={{ gridColumn: forward ? 5 : 1, gridRow: `1 / span ${shown.length}` }}>
      <Button size="icon" variant="muted" className={styles.edgeButton} href={href} scroll={false} aria-label={label} title={label}><Arrow size={16} aria-hidden /><GitBranch size={16} aria-hidden /></Button>
    </div>;
  };

  return (
    <section aria-label={ar ? 'آيات الشجرة في سياقها' : 'Tree ayat in context'} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {steps && <TreeSteps steps={steps} />}
        {shown.length > 1 && <details className="group relative shrink-0">
          <summary title={legend} className="flex size-8 cursor-pointer list-none items-center justify-center rounded-sm text-[var(--home-muted)] hover:bg-[var(--home-paper-deep)] hover:text-[var(--home-ink)] group-open:text-[var(--home-ink)] [&::-webkit-details-marker]:hidden">
            <Highlighter size={16} aria-hidden /><span className="sr-only">{legend}</span>
          </summary>
          <div className="absolute end-0 top-full z-20 mt-1 whitespace-nowrap rounded-sm border border-[var(--home-rule)] bg-[var(--home-paper)] px-3 shadow-md"><MatchLegend exact={exactLabel} root={rootLabel} /></div>
        </details>}
      </div>
      {isLoading && <LoadingSpinner />}
      {(error || aroundError || missing) && <div role="alert"><p>{ar ? 'تعذّر تحميل الآيات.' : 'Could not load the ayat.'}</p><Button size="lg" onClick={() => { void mutate(); void retryAround(); }} aria-label={ar ? 'إعادة المحاولة' : 'Try again'} title={ar ? 'إعادة المحاولة' : 'Try again'}><RotateCcw aria-hidden /></Button></div>}
      {contexts && around && !missing && <div ref={track} dir="rtl" className={styles.track} onScroll={onScroll} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onWheel={onWheel}>
        {edge(false)}
        {edge(true)}
        {contexts.map((context, row) => COLUMNS.map((at, i) => cell(context!, at, row, i)))}
      </div>}
    </section>
  );
}
