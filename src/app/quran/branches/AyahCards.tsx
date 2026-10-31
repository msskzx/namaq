'use client';

import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { ArrowLeft, ArrowRight, BookOpen, RotateCcw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';
import { useLanguage } from '@/components/language/LanguageContext';
import PageSpread, { MatchLegend } from '@/components/quran/PageSpread';
import { num } from '@/lib/quran/arabicNumber';
import type { AyahContext } from '@/lib/quran/ayahContext';
import { loadContext, MAX_KEYS, sharedMarks } from './AyahContext';
import type { Steps } from './TreeSteps';
import styles from './AyahCards.module.css';

const SWIPE = 50;
let arriving: 'next' | 'previous' | null = null;

function startAt(value: string | null, count: number) {
  if (value === 'last') return count - 1;
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? Math.min(n, count) - 1 : 0;
}

export default function AyahCards({ ayahKeys, names, steps }: { ayahKeys: string[]; names: Record<number, string>; steps?: Steps }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const router = useNavigatingRouter();
  const params = useSearchParams();
  const shown = ayahKeys.slice(0, MAX_KEYS);
  const [picked, setIndex] = useState(() => startAt(params.get('n'), shown.length));
  const index = Math.min(picked, shown.length - 1);
  const focused = useRef<'next' | 'previous' | null>(null);
  const [motion] = useState(() => { const from = arriving; arriving = null; return from; });
  const { data, error, isLoading, mutate } = useSWR<AyahContext[]>(`/api/quran/context?${new URLSearchParams({ q: shown.join(',') })}`, loadContext, { revalidateOnFocus: false });
  const exactLabel = ar ? 'في كل الآيات بلفظها' : 'In every ayah, same form';
  const rootLabel = ar ? 'في كل الآيات بجذرها أو بضبط مختلف' : 'In every ayah, by root or other marks';
  const labels = ar ? { previous: 'الآية السابقة', next: 'الآية التالية', read: 'قراءة الآية' } : { previous: 'Previous ayah', next: 'Next ayah', read: 'Read ayah' };
  const edge = { previous: index === 0 ? steps?.previous : undefined, next: index === shown.length - 1 ? steps?.next : undefined };
  const can = { previous: index > 0 || !!edge.previous, next: index < shown.length - 1 || !!edge.next };

  const track = useRef<HTMLDivElement>(null);
  const lane = (i: number) => track.current?.querySelector<HTMLElement>(`[data-lane="${i}"]`);
  const goTo = (i: number, behavior: ScrollBehavior = 'smooth') => {
    setIndex(i);
    lane(i)?.scrollIntoView?.({ behavior, inline: 'center', block: 'nearest' });
  };
  const centred = () => {
    const box = track.current?.getBoundingClientRect();
    if (!box) return;
    const middle = box.left + box.width / 2;
    let best = index;
    let distance = Infinity;
    track.current!.querySelectorAll<HTMLElement>('[data-lane]').forEach(item => {
      const rect = item.getBoundingClientRect();
      const gap = Math.abs(rect.left + rect.width / 2 - middle);
      if (gap < distance) { distance = gap; best = Number(item.dataset.lane); }
    });
    if (best !== index) setIndex(best);
  };
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onScroll = () => {
    clearTimeout(settle.current);
    settle.current = setTimeout(centred, 80);
  };
  const ready = !!data;
  useEffect(() => {
    if (ready) lane(index)?.scrollIntoView?.({ behavior: 'instant', inline: 'center', block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const step = (forward: boolean) => {
    const way = forward ? 'next' : 'previous';
    if (!can[way]) return;
    const href = edge[way];
    if (href) {
      arriving = way;
      router.push(href, { scroll: false });
      return;
    }
    goTo(index + (forward ? 1 : -1));
  };
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    const way = focused.current;
    focused.current = null;
    if (way) (document.querySelector<HTMLElement>(`[data-lane][data-current] [data-step="${way}"]:not([disabled])`) ?? document.querySelector<HTMLElement>('[data-lane][data-current] [data-step]:not([disabled])'))?.focus();
  }, [index]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (index === 0) url.searchParams.delete('n');
    else url.searchParams.set('n', `${index + 1}`);
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url);
  }, [index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || document.querySelector('dialog[open]')) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]')) return;
      stepRef.current(event.key === 'ArrowLeft');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ar]);

  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (event: React.TouchEvent) => {
    swipe.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    const start = swipe.current;
    const end = event.changedTouches[0];
    swipe.current = null;
    if (!start || event.touches.length || !end) return;
    const dx = end.clientX - start.x;
    const dy = end.clientY - start.y;
    const way = dx > 0 ? 'next' : 'previous';
    if (edge[way] && Math.abs(dx) >= SWIPE && Math.abs(dx) > 2 * Math.abs(dy)) step(dx > 0);
  };

  const count = (value: number) => ar ? num(value) : `${value}`;
  const nav = (way: 'previous' | 'next') => {
    const Icon = way === 'next' ? ArrowLeft : ArrowRight;
    const common = { size: 'lg' as const, 'data-step': way, 'aria-label': labels[way], title: labels[way] };
    const href = edge[way];
    if (href) return <Button {...common} href={href} scroll={false} onClick={event => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) arriving = way; }}><Icon aria-hidden /></Button>;
    return <Button {...common} disabled={!can[way]} onClick={() => { focused.current = way; step(way === 'next'); }}><Icon aria-hidden /></Button>;
  };
  const contexts = data && shown.map(key => data.find(item => item.ayah.key === key));
  const missing = contexts?.some(context => !context);

  return (
    <section aria-label={ar ? 'آيات الشجرة بطاقة بطاقة' : 'Tree ayat, one card at a time'} className="flex flex-col gap-2">
      {shown.length > 1 && <MatchLegend exact={exactLabel} root={rootLabel} />}
      {isLoading && <LoadingSpinner />}
      {(error || missing) && <div role="alert"><p>{ar ? 'تعذّر تحميل الآيات.' : 'Could not load the ayat.'}</p><Button size="lg" onClick={() => void mutate()} aria-label={ar ? 'إعادة المحاولة' : 'Try again'} title={ar ? 'إعادة المحاولة' : 'Try again'}><RotateCcw aria-hidden /></Button></div>}
      {contexts && !missing && <div ref={track} dir="rtl" className={`${styles.track} ${motion ? styles[motion === 'next' ? 'fromLeft' : 'fromRight'] : ''}`} onScroll={onScroll} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {contexts.map((context, i) => {
          const [surah, number] = context!.ayah.key.split(':').map(Number);
          const name = names[surah] ?? (ar ? `سورة ${num(surah)}` : `Surah ${surah}`);
          const current = i === index;
          return <div key={context!.ayah.key} data-lane={i} data-card data-current={current || undefined} inert={!current} className={styles.lane} onClick={current ? undefined : () => goTo(i)}>
            <PageSpread pages={[{
              title: name,
              subtitle: ar ? `الآية ${num(number)}` : `Ayah ${number}`,
              label: `${name} ${count(number)}`,
              rows: [[{ number, words: context!.ayah.words, current: true, marks: sharedMarks(context!, exactLabel, rootLabel) }]],
              footer: <nav aria-label={ar ? 'التنقل بين الآيات' : 'Ayah navigation'} className={styles.footer}>
                {nav('previous')}
                <span className="text-sm tabular-nums text-[var(--home-muted)]" aria-live={current ? 'polite' : undefined}>{count(i + 1)} / {count(shown.length)}</span>
                {nav('next')}
                <Button size="lg" className="ms-auto" href={`/quran/read/${context!.ayah.page}?a=${context!.ayah.key}`} aria-label={labels.read} title={labels.read}><BookOpen aria-hidden /></Button>
              </nav>,
            }]} />
          </div>;
        })}
      </div>}
    </section>
  );
}
