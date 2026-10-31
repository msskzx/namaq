'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faList } from '@fortawesome/free-solid-svg-icons';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Button from '@/components/common/Button';
import Segmented from '@/components/common/Segmented';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';
import { useSearchParams } from 'next/navigation';
import { pageGroups, spreadOf, turn, type MushafPage as MushafPageData } from '@/lib/quran/readerPage';
import { useLanguage } from '@/components/language/LanguageContext';
import styles from '@/components/homepage/Home.module.css';
import mushaf from './Mushaf.module.css';
import MushafPage from './MushafPage';
import JumpForm from './JumpForm';

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
  mark,
  fontClass,
}: {
  page: number;
  pages: ReaderPage[];
  names: Record<number, string>;
  mark?: { surah: number; ayah: number };
  fontClass?: string;
}) {
  const { language, languageLoaded } = useLanguage();
  const ar = !languageLoaded || language === 'ar';
  const router = useNavigatingRouter();
  const frame = useRef<HTMLDivElement>(null);
  const [spread, setSpread] = useState(false);
  const [phone, setPhone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const two = spread && !phone;
  const shown = two ? pages.filter(entry => spreadOf(page).includes(entry.page)) : pages.filter(entry => entry.page === page);
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
      element.style.height = `calc(100dvh - ${Math.max(0, element.getBoundingClientRect().top + window.scrollY)}px)`;
    };
    size();
    window.addEventListener('resize', size);
    return () => window.removeEventListener('resize', size);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing || event.defaultPrevented) return;
      if (event.shiftKey && event.key.startsWith('Arrow')) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
      if (event.key === 'ArrowLeft') go(1);
      else if (event.key === 'ArrowRight') go(-1);
      else if (event.key.toLowerCase() === 'd' && !phone) chooseSpread(!spread);
      else if (event.key.toLowerCase() === 'g') {
        setHidden(false);
        requestAnimationFrame(() => {
          const input = frame.current?.querySelector<HTMLInputElement>('input[name="page"]');
          input?.focus();
          input?.select();
        });
      } else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, chooseSpread, spread, phone]);

  const kbd = 'rounded border border-b-2 border-[var(--home-rule)] px-1.5 text-[0.7rem]';
  return (
    <div ref={frame} dir={ar ? 'rtl' : 'ltr'} lang={ar ? 'ar' : 'en'} className={`${styles.page} ${fontClass ?? ''} flex flex-col`}>
      {hidden ? (
        <div className="flex justify-end px-3 pt-1">
          <Button size="sm" variant="ghost" onClick={() => hide(false)} aria-expanded={false}>
            <ChevronDown size={16} aria-hidden />
            {ar ? 'إظهار الأدوات' : 'Show tools'}
          </Button>
        </div>
      ) : (
        <nav aria-label={ar ? 'أدوات القراءة' : 'Reading tools'} className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--home-rule)] px-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => go(-1)} disabled={(two ? spreadOf(page)[0] : page) === 1}>
              <FontAwesomeIcon icon={ar ? faArrowRight : faArrowLeft} aria-hidden />
              <span className="max-sm:sr-only">{ar ? 'الصفحة السابقة' : 'Previous page'}</span>
            </Button>
            <Button size="sm" onClick={() => go(1)} disabled={(two ? spreadOf(page)[1] : page) === 604}>
              <span className="max-sm:sr-only">{ar ? 'الصفحة التالية' : 'Next page'}</span>
              <FontAwesomeIcon icon={ar ? faArrowLeft : faArrowRight} aria-hidden />
            </Button>
            <JumpForm page={page} />
            <Button size="sm" href="/quran/read">
              <FontAwesomeIcon icon={faList} aria-hidden />
              <span className="max-sm:sr-only">{ar ? 'فهرس السور' : 'Index of surahs'}</span>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!phone && (
              <Segmented
                label={ar ? 'عدد الصفحات' : 'Pages shown'}
                options={[
                  { key: 'one', label: ar ? 'صفحة' : 'One page', current: !spread, onClick: () => chooseSpread(false) },
                  { key: 'two', label: ar ? 'صفحتان' : 'Two pages', current: spread, onClick: () => chooseSpread(true) },
                ]}
              />
            )}
            <p className="hidden items-center gap-1.5 text-xs text-[var(--home-muted)] lg:flex">
              <kbd className={kbd}>←</kbd>
              <kbd className={kbd}>→</kbd>
              {ar ? 'للتقليب' : 'turn'} · <kbd className={kbd}>D</kbd> {ar ? 'صفحة/صفحتان' : 'one/two'} · <kbd className={kbd}>G</kbd> {ar ? 'انتقال' : 'go to'}
            </p>
            <Button size="sm" variant="ghost" onClick={() => hide(true)} aria-expanded>
              <ChevronUp size={16} aria-hidden />
              <span className="max-sm:sr-only">{ar ? 'إخفاء الأدوات' : 'Hide tools'}</span>
            </Button>
          </div>
        </nav>
      )}
      <article dir="rtl" lang="ar" className={`${mushaf.stage} ${two ? mushaf.spread : ''}`}>
        {shown.map(entry => (
          <MushafPage key={entry.page} page={entry.page} data={entry.data} names={names} top={entry.top} mark={mark} />
        ))}
      </article>
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
  return <ReaderView {...props} mark={holds ? { surah, ayah } : undefined} />;
}
