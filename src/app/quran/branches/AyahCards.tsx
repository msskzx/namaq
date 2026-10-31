'use client';

import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { BookOpen, GitBranch, RotateCcw } from 'lucide-react';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';
import { useLanguage } from '@/components/language/LanguageContext';
import PageSpread, { MatchLegend } from '@/components/quran/PageSpread';
import { num } from '@/lib/quran/arabicNumber';
import type { AyahContext, Surrounding } from '@/lib/quran/ayahContext';
import { loadContext, MAX_KEYS, sharedMarks } from './AyahContext';
import type { Steps } from './TreeSteps';
import styles from './AyahCards.module.css';

const COLUMNS = ['before', 'ayah', 'after'] as const;
const SWIPE = 50;
const SLIDE = 250;
const LOCK = 8;
const WHEEL_GAP = 250;
type Column = typeof COLUMNS[number];

const matchLabels = (ar: boolean) => ar ? { exact: 'نفس الكلمة', root: 'نفس الجذر' } : { exact: 'Same word', root: 'Same root' };

export function CardsLegend() {
  const { exact, root } = matchLabels(useLanguage().language === 'ar');
  return <MatchLegend exact={exact} root={root} />;
}

export default function AyahCards({ ayahKeys, names, steps }: { ayahKeys: string[]; names: Record<number, string>; steps?: Steps }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const shown = ayahKeys.slice(0, MAX_KEYS);
  const [column, setColumn] = useState(1);
  const [lit, setLit] = useState<number[] | null>(null);
  const [fits, setFits] = useState(false);
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
  const { exact: exactLabel, root: rootLabel } = matchLabels(ar);
  const read = ar ? 'قراءة الآية' : 'Read ayah';

  const track = useRef<HTMLDivElement>(null);
  const selectColumn = (i: number) => {
    if (i !== column && document.activeElement?.closest('[data-col]') && track.current?.contains(document.activeElement)) track.current.focus({ preventScroll: true });
    setColumn(i);
  };
  const head = (i: number) => track.current?.querySelector<HTMLElement>(`[data-col="${i}"]`);
  const dragged = useRef(0);
  const sliding = useRef<{ timer: ReturnType<typeof setTimeout>; finish: () => void } | null>(null);
  const setDrag = (x: number, animate = false) => {
    const element = track.current;
    if (!element) return;
    dragged.current = x;
    element.toggleAttribute('data-sliding', animate);
    element.style.setProperty('--drag', `${x}px`);
  };
  /** How far column i's centre sits from the frame's centre, without the finger's drag. */
  const offsetOf = (i: number) => {
    const box = track.current?.getBoundingClientRect();
    const rect = head(i)?.getBoundingClientRect();
    return box && rect ? rect.left + rect.width / 2 - (box.left + box.width / 2) - dragged.current : 0;
  };
  const scrollAcross = (by: number) => {
    const element = track.current;
    if (!element || Math.abs(by) < 1) return;
    element.style.scrollBehavior = 'auto';
    element.scrollLeft += by;
    element.style.scrollBehavior = '';
  };
  const flush = () => {
    const slide = sliding.current;
    if (!slide) return;
    clearTimeout(slide.timer);
    sliding.current = null;
    slide.finish();
  };
  // Every column change slides the cards with a transform and only then moves the scroll position in one jump,
  // so the rows never scroll sideways and up or down at once, and quick repeated steps never overshoot.
  const goTo = (i: number) => {
    flush();
    const offset = offsetOf(i);
    if (Math.abs(offset) <= 1) { setDrag(0); selectColumn(i); return; }
    selectColumn(i);
    const finish = () => { setDrag(0); scrollAcross(offset); };
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    setDrag(-offset, true);
    sliding.current = { timer: setTimeout(flush, SLIDE), finish };
  };
  const settleBack = () => {
    flush();
    if (!dragged.current) return;
    setDrag(0, true);
    sliding.current = { timer: setTimeout(flush, SLIDE), finish: () => setDrag(0) };
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
    if (best !== column) selectColumn(best);
  };
  const rows = () => [...(track.current?.querySelectorAll<HTMLElement>('[data-col="1"]') ?? [])];
  const measure = () => {
    const element = track.current;
    const cells = rows();
    if (!element || !cells.length) return;
    const top = element.getBoundingClientRect().top;
    const bottom = top + element.clientHeight;
    const shown = cells.flatMap((cell, row) => {
      const rect = cell.getBoundingClientRect();
      return rect.top >= top - 1 && rect.bottom <= bottom + 1 ? [row] : [];
    });
    const focused = document.activeElement?.closest<HTMLElement>('[data-row]');
    if (focused && element.contains(focused) && !shown.includes(Number(focused.dataset.row))) element.focus({ preventScroll: true });
    setLit(previous => previous?.join() === shown.join() ? previous : shown);
    setFits(cells[cells.length - 1].getBoundingClientRect().bottom - cells[0].getBoundingClientRect().top <= element.clientHeight);
  };
  const reveal = (r: number) => {
    const element = track.current;
    const rect = rows()[r]?.getBoundingClientRect();
    if (!element || !rect) return;
    const top = element.getBoundingClientRect().top;
    const bottom = top + element.clientHeight;
    const by = rect.top < top ? rect.top - top - parseFloat(getComputedStyle(element).scrollPaddingTop || '0') : rect.bottom > bottom ? rect.bottom - bottom : 0;
    if (by) element.scrollBy?.({ top: by, behavior: 'smooth' });
  };
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onScroll = () => {
    measure();
    clearTimeout(settle.current);
    settle.current = setTimeout(centred, 80);
  };
  const ready = !!data && !!around;
  useEffect(() => {
    const element = track.current;
    if (!ready || !element) return;
    const place = () => element.clientWidth > 0 && (flush(), setDrag(0), scrollAcross(offsetOf(1)), selectColumn(1), true);
    void document.fonts?.ready.then(() => { if (element.isConnected) place(); });
    if (place() || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => { if (place()) observer.disconnect(); });
    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    const element = track.current;
    if (!ready || !element) return;
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(element);
    rows().forEach(cell => observer.observe(cell));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const router = useNavigatingRouter();
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
    else if (!leave(forward)) settleBack();
  };
  const canStep = (forward: boolean) => (forward ? column < COLUMNS.length - 1 || !!steps?.next : column > 0 || !!steps?.previous);
  const touchRef = useRef<{ start: (event: TouchEvent) => void; move: (event: TouchEvent) => void; end: () => void }>(null!);
  const swipe = useRef<{ x: number; y: number; axis?: 'x' | 'y' } | null>(null);
  touchRef.current = {
    start: event => {
      flush();
      swipe.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    },
    move: event => {
      const start = swipe.current;
      if (!start || event.touches.length !== 1) { swipe.current = null; if (dragged.current) settleBack(); return; }
      const dx = event.touches[0].clientX - start.x;
      const dy = event.touches[0].clientY - start.y;
      if (!start.axis) {
        if (Math.abs(dx) < LOCK && Math.abs(dy) < LOCK) return;
        start.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
      if (start.axis !== 'x') return;
      if (event.cancelable) event.preventDefault();
      setDrag(canStep(dx > 0) ? dx : dx / 4);
    },
    end: () => {
      const start = swipe.current;
      swipe.current = null;
      if (start?.axis !== 'x') return;
      const dx = dragged.current;
      if (Math.abs(dx) >= SWIPE && canStep(dx > 0)) stepRef.current(dx > 0);
      else settleBack();
    },
  };
  const wheel = useRef({ sum: 0, done: false, timer: undefined as ReturnType<typeof setTimeout> | undefined });
  const onWheel = (event: React.WheelEvent) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    const gesture = wheel.current;
    clearTimeout(gesture.timer);
    gesture.timer = setTimeout(() => { gesture.sum = 0; gesture.done = false; }, WHEEL_GAP);
    if (gesture.done) return;
    gesture.sum += event.deltaX;
    if (Math.abs(gesture.sum) < SWIPE) return;
    gesture.done = true;
    stepRef.current(gesture.sum < 0);
  };
  useEffect(() => {
    const element = track.current;
    if (!ready || !element) return;
    const start = (event: TouchEvent) => touchRef.current.start(event);
    const move = (event: TouchEvent) => touchRef.current.move(event);
    const end = () => touchRef.current.end();
    element.addEventListener('touchstart', start, { passive: true });
    element.addEventListener('touchmove', move, { passive: false });
    element.addEventListener('touchend', end);
    element.addEventListener('touchcancel', end);
    return () => {
      element.removeEventListener('touchstart', start);
      element.removeEventListener('touchmove', move);
      element.removeEventListener('touchend', end);
      element.removeEventListener('touchcancel', end);
    };
  }, [ready]);
  useEffect(() => () => { const slide = sliding.current; if (slide) clearTimeout(slide.timer); }, []);
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
    const shownRow = !lit || lit.includes(row);
    const key = `${row}:${at}`;
    const props = { 'data-col': i, 'data-row': row, 'data-first': row === 0 || undefined, 'data-current': current || undefined, 'data-reading': shownRow || undefined, 'aria-hidden': !current || !shownRow, className: styles.cell, style: { gridColumn: i + 2, gridRow: row + 1 }, onClick: current && shownRow ? undefined : () => { if (!current) goTo(i); if (!shownRow) reveal(row); } };
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
          ...(at === 'before' && 'basmala' in ayah && ayah.basmala ? [[{ number: 0, words: ayah.basmala, bare: true }]] : []),
        ],
        action: current && shownRow ? <Button size="icon" variant="muted" href={`/quran/read/${ayah.page}?a=${ayah.key}`} aria-label={read} title={read}><BookOpen size={16} aria-hidden /></Button> : undefined,
      }]} />
    </div>;
  };

  const edge = (forward: boolean) => {
    const href = forward ? steps?.next : steps?.previous;
    if (!href) return null;
    const label = forward ? (ar ? 'الشجرة التالية' : 'Next tree') : (ar ? 'الشجرة السابقة' : 'Previous tree');
    return <Button size="icon" variant="muted" className={styles.edge} data-edge={forward ? 'next' : 'previous'} style={{ gridColumn: forward ? 5 : 1, gridRow: `1 / span ${shown.length}` }} href={href} scroll={false} aria-label={label} title={label}>
      <GitBranch size={16} aria-hidden className={styles.edgeIcon} />
    </Button>;
  };

  return (
    <section aria-label={ar ? 'آيات الشجرة في سياقها' : 'Tree ayat in context'} className="flex flex-col gap-2">
      {isLoading && <LoadingSpinner />}
      {(error || aroundError || missing) && <div role="alert"><p>{ar ? 'تعذّر تحميل الآيات.' : 'Could not load the ayat.'}</p><Button size="lg" onClick={() => { void mutate(); void retryAround(); }} aria-label={ar ? 'إعادة المحاولة' : 'Try again'} title={ar ? 'إعادة المحاولة' : 'Try again'}><RotateCcw aria-hidden /></Button></div>}
      {contexts && around && !missing && <div ref={track} tabIndex={0} role="region" aria-label={ar ? 'مصفوفة الآيات' : 'Ayah matrix'} dir="rtl" data-fits={fits || undefined} className={styles.track} onScroll={onScroll} onWheel={onWheel}>
        {edge(false)}
        {edge(true)}
        {contexts.map((context, row) => COLUMNS.map((at, i) => cell(context!, at, row, i)))}
      </div>}
    </section>
  );
}
