'use client';

import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { BookOpen, GitBranch, RotateCcw } from 'lucide-react';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';
import { SLIDE, useSwipe } from '@/components/common/useSwipe';
import { useLanguage } from '@/components/language/LanguageContext';
import PageSpread, { MatchLegend } from '@/components/quran/PageSpread';
import { num } from '@/lib/quran/arabicNumber';
import type { AyahContext, Surrounding } from '@/lib/quran/ayahContext';
import { quranContexts, quranSurrounding } from '@/lib/quran/quranText';
import { MAX_KEYS, sharedMarks } from './AyahContext';
import { usePreload, type Steps } from './TreeSteps';
import styles from './AyahCards.module.css';

const COLUMNS = ['before', 'ayah', 'after'] as const;
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
  const loadContexts = ([, ...keys]: string[]) => quranContexts(keys);
  const { data, error, isLoading, mutate } = useSWR<AyahContext[]>(['quran-context', ...shown], loadContexts, { revalidateOnFocus: false });
  const { data: around, error: aroundError, mutate: retryAround } = useSWR<Surrounding>(['quran-surrounding', shown.join(','), shown.join(',')], () => quranSurrounding(shown, shown), { revalidateOnFocus: false });
  const sideKeys = (side: 'before' | 'after') => around && [...new Set(Object.values(around[side]).flatMap(ayah => ayah ? [ayah.key] : []))];
  const sideKey = (keys?: string[]) => keys && keys.length > 1 ? ['quran-context', ...keys.slice(0, MAX_KEYS)] : null;
  const { data: beforeMatch } = useSWR<AyahContext[]>(sideKey(sideKeys('before')), loadContexts, { revalidateOnFocus: false });
  const { data: afterMatch } = useSWR<AyahContext[]>(sideKey(sideKeys('after')), loadContexts, { revalidateOnFocus: false });
  const { exact: exactLabel, root: rootLabel } = matchLabels(ar);
  const read = ar ? 'قراءة الآية' : 'Read ayah';

  const track = useRef<HTMLDivElement>(null);
  const selectColumn = (i: number) => {
    if (i !== column && document.activeElement?.closest('[data-col]') && track.current?.contains(document.activeElement)) track.current.focus({ preventScroll: true });
    setColumn(i);
  };
  const head = (i: number) => track.current?.querySelector<HTMLElement>(`[data-col="${i}"]`);
  // The whole matrix moves sideways as one layer: `shift` centres the current column, `dragged` follows the finger.
  // Nothing scrolls sideways, so the rows never move up or down while the cards slide.
  const lane = useRef<HTMLDivElement>(null);
  const shift = useRef(0);
  const dragged = useRef(0);
  const sliding = useRef<{ timer: ReturnType<typeof setTimeout>; finish: () => void } | null>(null);
  const paint = (animate = false) => {
    const element = lane.current;
    if (!element) return;
    element.toggleAttribute('data-sliding', animate);
    element.style.transform = `translate3d(${shift.current + dragged.current}px, 0, 0)`;
  };
  const setDrag = (x: number) => { dragged.current = x; paint(); };
  /** The shift that puts column i's centre at the frame's centre (offsets ignore transforms). */
  const shiftOf = (i: number) => {
    const element = lane.current;
    const cell = head(i);
    return element && cell ? element.clientWidth / 2 - (cell.offsetLeft + cell.offsetWidth / 2) : shift.current;
  };
  const flush = () => {
    const slide = sliding.current;
    if (!slide) return;
    clearTimeout(slide.timer);
    sliding.current = null;
    slide.finish();
  };
  const slideTo = (target: number) => {
    flush();
    const animate = Math.abs(target - shift.current - dragged.current) > 1 && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    shift.current = target;
    dragged.current = 0;
    paint(animate);
    if (animate) sliding.current = { timer: setTimeout(flush, SLIDE), finish: () => paint() };
  };
  const goTo = (i: number) => {
    selectColumn(i);
    slideTo(shiftOf(i));
  };
  const settleBack = () => {
    if (dragged.current) slideTo(shift.current);
  };
  /** Centre column i at once, e.g. when the frame changes width as the side pane opens or closes. */
  const place = (i: number) => {
    flush();
    shift.current = shiftOf(i);
    dragged.current = 0;
    paint();
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
  const onScroll = () => {
    const element = track.current;
    // Focus can scroll the frame sideways; the lane's shift alone decides what is centred.
    if (element?.scrollLeft) element.scrollLeft = 0;
    measure();
  };
  const ready = !!data && !!around;
  const columnRef = useRef(column);
  columnRef.current = column;
  useEffect(() => {
    const element = track.current;
    if (!ready || !element) return;
    let width = 0;
    const fit = () => {
      if (!element.clientWidth || element.clientWidth === width) return;
      width = element.clientWidth;
      place(columnRef.current);
    };
    fit();
    void document.fonts?.ready.then(() => { if (element.isConnected) place(columnRef.current); });
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(fit);
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
  usePreload(steps?.next, steps?.previous);
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
  // The shared swipe gesture (also used by the tree view): axis lock, finger-following drag, one step per trackpad swipe.
  const { justSwiped } = useSwipe(track, ready, {
    forward: dx => dx > 0,
    canStep,
    start: flush,
    drag: setDrag,
    step: forward => stepRef.current(forward),
    cancel: settleBack,
  });
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
    return <Button size="icon" variant="muted" className={styles.edge} data-edge={forward ? 'next' : 'previous'} style={{ gridColumn: forward ? 5 : 1, gridRow: `1 / span ${shown.length}` }} href={href} scroll={false} onClick={event => { if (justSwiped()) event.preventDefault(); }} aria-label={label} title={label}>
      <GitBranch size={16} aria-hidden className={styles.edgeIcon} />
    </Button>;
  };

  return (
    <section aria-label={ar ? 'آيات الشجرة في سياقها' : 'Tree ayat in context'} className="flex flex-col gap-2">
      {isLoading && <LoadingSpinner />}
      {(error || aroundError || missing) && <div role="alert"><p>{ar ? 'تعذّر تحميل الآيات.' : 'Could not load the ayat.'}</p><Button size="lg" onClick={() => { void mutate(); void retryAround(); }} aria-label={ar ? 'إعادة المحاولة' : 'Try again'} title={ar ? 'إعادة المحاولة' : 'Try again'}><RotateCcw aria-hidden /></Button></div>}
      {contexts && around && !missing && <div ref={track} tabIndex={0} role="region" aria-label={ar ? 'مصفوفة الآيات' : 'Ayah matrix'} dir="rtl" data-fits={fits || undefined} className={styles.track} onScroll={onScroll}>
        <div ref={lane} className={styles.lane}>
          {edge(false)}
          {edge(true)}
          {contexts.map((context, row) => COLUMNS.map((at, i) => cell(context!, at, row, i)))}
        </div>
      </div>}
    </section>
  );
}
