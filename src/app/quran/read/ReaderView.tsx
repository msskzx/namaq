'use client';

import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ArrowLeft, ArrowRight, Bookmark, BookOpen, ChevronDown, ChevronUp, Eye, EyeOff, File, List, Search, Undo2, X, CircleHelp } from 'lucide-react';
import { markForgotten, readAyahMarks, serverAyahMarks, subscribeAyahMarks, toggleSavedAyah, clearForgotten } from '@/lib/ayahMarks';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Button from '@/components/common/Button';
import { NavActions, useDesktopRail } from '@/components/common/NavBar';
import { useSwipe } from '@/components/common/useSwipe';
import { SettingsHelp } from '@/components/common/SettingsHelp';
import Segmented from '@/components/common/Segmented';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';
import { useSearchParams } from 'next/navigation';
import { num } from '@/lib/quran/arabicNumber';
import { pageGroups, spreadOf, turn, type MushafPage as MushafPageData } from '@/lib/quran/readerPage';
import { useLanguage } from '@/components/language/LanguageContext';
import styles from '@/components/homepage/Home.module.css';
import mushaf from './Mushaf.module.css';
import type { IndexSurah } from '@/lib/quran/juzIndex';
import SurahIndex from './SurahIndex';
import MushafPage from './MushafPage';

export type ReaderPage = { page: number; data: MushafPageData; top?: number };

const SPREAD_KEY = 'quran-reader-spread';
const BAR_KEY = 'quran-reader-bar';
const WIDE = '(min-width: 1024px) and (orientation: landscape)';
const PHONE = '(max-width: 640px)';

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

export default function ReaderView({
  page,
  pages,
  names,
  surahs = [],
  mark,
  fontClass,
  recite: reciteFrom,
}: {
  page: number;
  pages: ReaderPage[];
  names: Record<number, string>;
  surahs?: IndexSurah[];
  mark?: { surah: number; ayah: number };
  fontClass?: string;
  /** Recite mode: start hiding from this ayah ("57:1"). */
  recite?: string;
}) {
  const { language, languageLoaded } = useLanguage();
  const ar = !languageLoaded || language === 'ar';
  const router = useNavigatingRouter();
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLElement>(null);
  const indexId = useId();
  const searchId = useId();
  const searchPanel = useRef<HTMLDivElement>(null);
  const [phoneTools, setPhoneTools] = useState(false);
  const rail = useDesktopRail();
  const [spread, setSpread] = useState(false);
  const [phone, setPhone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const two = spread && !phone;
  const shown = two ? pages.filter(entry => spreadOf(page).includes(entry.page)) : pages.filter(entry => entry.page === page);
  const marks = useSyncExternalStore(subscribeAyahMarks, readAyahMarks, serverAyahMarks);
  const order = useMemo(() => [...new Set(shown.flatMap(entry => pageGroups(entry.data.items, entry.top).flatMap(line => line?.map(group => `${group.surah}:${group.ayah}`) ?? [])))], [shown]);
  const [reciting, setReciting] = useState(!!reciteFrom);
  const [revealed, setRevealed] = useState(0);
  const start = reciting ? Math.max(0, order.indexOf(reciteFrom ?? '')) : 0;
  const hiddenAt = start + revealed;
  const veiled = reciting ? (surah: number, ayah: number) => order.indexOf(`${surah}:${ayah}`) >= hiddenAt : undefined;
  const nextKey = reciting ? order[hiddenAt] : undefined;
  const upcoming = nextKey ? { surah: Number(nextKey.split(':')[0]), ayah: Number(nextKey.split(':')[1]) } : undefined;
  const [actions, setActions] = useState<{ key: string; x: number; y: number } | null>(null);
  const openActions = (surah: number, ayah: number, element: HTMLElement) => {
    const box = element.getBoundingClientRect();
    setActions({ key: `${surah}:${ayah}`, x: box.left + box.width / 2, y: box.top });
  };
  const go = useCallback(
    (step: 1 | -1) => {
      const target = turn(page, two, step);
      if (two ? spreadOf(target)[0] !== spreadOf(page)[0] : target !== page) router.push(`/quran/read/${target}`);
    },
    [page, two, router],
  );
  useEffect(() => {
    for (const step of [1, -1] as const) {
      const target = turn(page, two, step);
      if (target !== page) router.prefetch(`/quran/read/${target}`);
    }
  }, [page, two, router]);
  const chooseSpread = useCallback((next: boolean) => {
    setSpread(next);
    write(SPREAD_KEY, next ? 'two' : 'one');
  }, []);
  const hide = (next: boolean) => {
    setHidden(next);
    write(BAR_KEY, next ? 'hidden' : 'shown');
  };

  useEffect(() => {
    const stored = read(SPREAD_KEY);
    setSpread(stored ? stored === 'two' : !!window.matchMedia?.(WIDE).matches);
    setHidden(read(BAR_KEY) === 'hidden');
    const query = window.matchMedia?.(PHONE);
    if (!query) return;
    const update = () => setPhone(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) return;
    const size = () => {
      element.style.setProperty('--reader-height', `calc(100dvh - var(--app-tabbar, 0px) - ${Math.max(0, element.getBoundingClientRect().top + window.scrollY)}px)`);
    };
    size();
    window.addEventListener('resize', size);
    return () => window.removeEventListener('resize', size);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing || event.defaultPrevented) return;
      if (event.shiftKey && event.key.startsWith('Arrow')) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [popover], [contenteditable]:not([contenteditable="false"])')) return;
      if (event.key === 'ArrowLeft') go(1);
      else if (event.key === 'ArrowRight') go(-1);
      else if (event.key.toLowerCase() === 'd' && !phone) chooseSpread(!spread);
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, chooseSpread, spread, phone]);

  const previous = ar ? 'الصفحة السابقة' : 'Previous page';
  const next = ar ? 'الصفحة التالية' : 'Next page';
  const layout = ar ? (two ? 'اعرض صفحة واحدة' : 'اعرض صفحتين') : (two ? 'Show one page' : 'Show two pages');
  const index = ar ? 'فهرس السور' : 'Index of surahs';
  const search = ar ? 'ابحث عن سورة أو آية' : 'Search surahs or ayat';
  const toggleTools = phoneTools ? (ar ? 'إخفاء الأدوات' : 'Hide tools') : (ar ? 'إظهار الأدوات' : 'Show tools');
  const first = (two ? spreadOf(page)[0] : page) === 1;
  const last = (two ? spreadOf(page)[1] : page) === 604;
  const PreviousIcon = ar ? ArrowRight : ArrowLeft;
  const NextIcon = ar ? ArrowLeft : ArrowRight;
  const LayoutIcon = two ? File : BookOpen;
  const { justSwiped } = useSwipe(stage, phone, {
    forward: dx => dx > 0,
    canStep: forward => !(forward ? last : first),
    drag: () => {},
    step: forward => go(forward ? 1 : -1),
    cancel: () => {},
  });
  const indexAndSearch = <>
    <Button size="lg" variant="muted" popoverTarget={indexId} aria-label={index} title={index}><List aria-hidden /></Button>
    <div id={indexId} popover="auto" dir={ar ? 'rtl' : 'ltr'} className={mushaf.index}>
      <nav aria-label={index}>
        <ol>
          {surahs.map(surah => surah.page && <li key={surah.number}>
            <Link prefetch={false} href={`/quran/read/${surah.page}`} className="flex items-baseline gap-3 border-b border-[var(--home-rule)] px-4 py-2 hover:bg-[var(--home-paper-deep)]" onClick={event => event.currentTarget.closest<HTMLElement>('[popover]')?.hidePopover?.()}>
              <span className="w-8 shrink-0 text-sm text-[var(--home-muted)]">{ar ? num(surah.number) : surah.number}</span>
              <span>{ar ? surah.name : surah.nameTransliterated || surah.name}</span>
            </Link>
          </li>)}
        </ol>
      </nav>
    </div>
    <Button size="lg" variant="muted" popoverTarget={searchId} aria-label={search} title={search}><Search aria-hidden /></Button>
    <div ref={searchPanel} id={searchId} popover="auto" className={mushaf.index} aria-label={search}>
      <SurahIndex surahs={surahs} fontClass={fontClass} onNavigate={() => searchPanel.current?.hidePopover?.()} />
    </div>
  </>;
  return (
    <div ref={frame} data-reader-immersive={!phoneTools} dir={ar ? 'rtl' : 'ltr'} lang={ar ? 'ar' : 'en'} className={`${styles.page} ${fontClass ?? ''} ${mushaf.reader} flex flex-col`}>
      {rail && <SettingsHelp label={ar ? 'اختصارات القراءة' : 'Reading shortcuts'}>
        <ul className="space-y-2">
          <li><kbd>←</kbd> <kbd>→</kbd> {ar ? 'لتقليب الصفحات' : 'Turn pages'}</li>
          <li><kbd>D</kbd> {ar ? 'للتبديل بين صفحة وصفحتين' : 'Switch between one and two pages'}</li>
        </ul>
      </SettingsHelp>}
      {rail && createPortal(<>
        <Button size="lg" variant="muted" onClick={() => go(-1)} disabled={first} aria-label={previous} title={previous}><PreviousIcon aria-hidden /></Button>
        <Button size="lg" variant="muted" onClick={() => go(1)} disabled={last} aria-label={next} title={next}><NextIcon aria-hidden /></Button>
        {indexAndSearch}
        <Button size="lg" variant="muted" onClick={() => chooseSpread(!spread)} aria-label={layout} title={layout}><LayoutIcon aria-hidden /></Button>
        <Button size="lg" variant={reciting ? 'primary' : 'muted'} onClick={() => { setReciting(on => !on); setRevealed(0); }} aria-label="تسميع" title="تسميع: أخفِ الآيات وأظهرها واحدة واحدة"><EyeOff aria-hidden /></Button>
      </>, rail)}
      {phone && phoneTools && <NavActions>
        {indexAndSearch}
      </NavActions>}
      {!rail && !phone && (hidden ? (
        <div className="flex justify-end px-3 pt-1">
          <Button size="sm" variant="ghost" onClick={() => hide(false)} aria-expanded={false}>
            <ChevronDown size={16} aria-hidden />
            {ar ? 'إظهار الأدوات' : 'Show tools'}
          </Button>
        </div>
      ) : (
        <nav aria-label={ar ? 'أدوات القراءة' : 'Reading tools'} className={`${mushaf.tools} flex flex-wrap items-center justify-between gap-2 border-b border-[var(--home-rule)] px-3 py-2`}>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => go(-1)} disabled={first}>
              <FontAwesomeIcon icon={ar ? faArrowRight : faArrowLeft} aria-hidden />
              <span className="max-sm:sr-only">{previous}</span>
            </Button>
            <Button size="sm" onClick={() => go(1)} disabled={last}>
              <span className="max-sm:sr-only">{next}</span>
              <FontAwesomeIcon icon={ar ? faArrowLeft : faArrowRight} aria-hidden />
            </Button>
            {indexAndSearch}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              label={ar ? 'عدد الصفحات' : 'Pages shown'}
              options={[
                { key: 'one', label: ar ? 'صفحة' : 'One page', current: !spread, onClick: () => chooseSpread(false) },
                { key: 'two', label: ar ? 'صفحتان' : 'Two pages', current: spread, onClick: () => chooseSpread(true) },
              ]}
            />
            <Button size="sm" variant="ghost" onClick={() => hide(true)} aria-expanded>
              <ChevronUp size={16} aria-hidden />
              <span className="max-sm:sr-only">{ar ? 'إخفاء الأدوات' : 'Hide tools'}</span>
            </Button>
          </div>
        </nav>
      ))}
      <article ref={stage} dir="rtl" lang="ar" className={`${mushaf.stage} ${two ? mushaf.spread : ''}`} onClick={reciting ? () => { setActions(null); setRevealed(count => Math.min(order.length - start, count + 1)); } : phone ? event => {
        if (!(event.target as Element).closest('button, a') && !justSwiped() && !window.getSelection()?.toString()) {
          setPhoneTools(shown => !shown);
        }
      } : undefined}>
        {phone && <Button size="sm" variant="muted" className="sr-only focus:not-sr-only focus:absolute focus:bottom-16 focus:z-10" aria-expanded={phoneTools} onClick={() => setPhoneTools(shown => !shown)}>
          {phoneTools ? <ChevronUp size={16} aria-hidden /> : <ChevronDown size={16} aria-hidden />}
          {toggleTools}
        </Button>}
        {shown.map(entry => (
          <MushafPage key={entry.page} page={entry.page} data={entry.data} names={names} top={entry.top} mark={mark} hidden={veiled} next={upcoming} flags={marks} onAyah={openActions} />
        ))}
      </article>
      {actions && <div role="dialog" aria-label={`الآية ${actions.key}`} className={mushaf.ayahActions} style={{ left: actions.x, top: actions.y }}>
        <Button size="lg" variant={marks[actions.key]?.forgot ? 'primary' : 'muted'} title={marks[actions.key]?.forgot ? `نسيتها ${num(marks[actions.key].forgot!)} مرات، اضغط لمسحها` : 'نسيتها'} aria-label="نسيتها" onClick={() => { (marks[actions.key]?.forgot ? clearForgotten : markForgotten)(actions.key); setActions(null); }}>
          <CircleHelp aria-hidden />{marks[actions.key]?.forgot ? <span className="text-sm">{num(marks[actions.key].forgot!)}</span> : null}
        </Button>
        <Button size="lg" variant={marks[actions.key]?.saved ? 'primary' : 'muted'} title={marks[actions.key]?.saved ? 'إزالة من المحفوظات' : 'احفظ الآية'} aria-label="احفظ الآية" onClick={() => { toggleSavedAyah(actions.key); setActions(null); }}>
          <Bookmark aria-hidden fill={marks[actions.key]?.saved ? 'currentColor' : 'none'} />
        </Button>
      </div>}
      {reciting && <div className={mushaf.reciteBar} dir="rtl">
        <Button size="lg" variant="muted" title="ارجع آية" aria-label="ارجع آية" disabled={revealed === 0} onClick={() => setRevealed(count => Math.max(0, count - 1))}><Undo2 aria-hidden /></Button>
        <Button size="lg" title="أظهر الآية التالية" aria-label="أظهر الآية التالية" disabled={!upcoming} onClick={() => setRevealed(count => count + 1)}><Eye aria-hidden /></Button>
        <Button size="lg" variant="muted" title="إنهاء التسميع" aria-label="إنهاء التسميع" onClick={() => { setReciting(false); setRevealed(0); }}><X aria-hidden /></Button>
      </div>}
    </div>
  );
}

type ReaderProps = Omit<React.ComponentProps<typeof ReaderView>, 'mark'>;

export function MarkedReaderView(props: ReaderProps) {
  const router = useNavigatingRouter();
  const [surah, ayah] = String(useSearchParams().get('a') ?? '').split(':').map(Number);
  const asked = surah > 0 && ayah > 0;
  const shown = props.pages.find(entry => entry.page === props.page);
  const holds = asked && !!shown && pageGroups(shown.data.items, shown.top).some(line => line?.some(group => group.surah === surah && group.ayah === ayah));
  useEffect(() => {
    if (asked && !holds) router.replace(`/quran/read/ayah/${surah}/${ayah}`);
  }, [asked, holds, surah, ayah, router]);
  const recite = useSearchParams().get('recite') ?? undefined;
  return <ReaderView {...props} mark={holds ? { surah, ayah } : undefined} recite={recite} />;
}
