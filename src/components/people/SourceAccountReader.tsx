'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCompress, faExpand, faList, faGear, faXmark, faFont, faSun, faMoon, faPalette, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';
import LanguageSwitcher from '@/components/language/LanguageSwitcher';
import ThemeSwitcher from '@/components/theme/ThemeSwitcher';
import { useLanguage } from '@/components/language/LanguageContext';
import { fetcher } from '@/lib/swr';
import { getAllNavLinks } from '@/lib/siteLinks';
import { pageParagraphs } from '@/lib/history/sectionHeadings';
import type { AccountPage, AccountSection, AccountSummary } from '@/types/provenance';

interface AccountsResponse {
  accounts: AccountSummary[];
  account: AccountSummary | null;
  page: AccountPage | null;
  pages?: AccountPage[];
  pageNumbers?: { sequence: number; printedPage: string | null; volume: { number: number } | null }[];
}

interface SectionsResponse {
  sections: AccountSection[];
}

interface SourceAccountReaderProps {
  basePath: string;
  labelAccount?: (account: AccountSummary) => string;
  selectorLabel?: { ar: string; en: string };
  defaultFullscreen?: boolean;
}
const PREFETCH_AHEAD = 2;
const WINDOW = 5;

type ReaderFont = 'amiri' | 'sans';
type ReaderSize = 's' | 'm' | 'l' | 'xl';
type ReaderBackground = 'light' | 'dark' | 'sepia';

const fontSizes: Record<ReaderSize, string> = { s: '1.125rem', m: '1.375rem', l: '1.625rem', xl: '1.875rem' };
const backgroundStyles: Record<ReaderBackground, React.CSSProperties> = {
  light: { backgroundColor: '#fffdf8', color: '#292524' },
  dark: { backgroundColor: '#000000', color: '#f3f4f6' },
  sepia: { backgroundColor: '#f1e8d5', color: '#43362b' },
};

function accountLabel(account: AccountSummary) {
  return [account.source.title, account.source.edition, account.volume && `ج${account.volume}`]
    .filter(Boolean)
    .join(' — ');
}

function isRtl(language: string) {
  return /^(ar|fa|he|ur|ps|sd|ug|yi)(-|$)/i.test(language);
}

export default function SourceAccountReader({
  basePath,
  labelAccount = accountLabel,
  selectorLabel = { ar: 'الكتاب', en: 'Book' },
  defaultFullscreen = false,
}: SourceAccountReaderProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const book = searchParams.get('book');
  const requestedPage = Number(searchParams.get('page') ?? '1');
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const fullscreenParam = searchParams.get('fullscreen');
  const fullscreen = fullscreenParam === '1' || (defaultFullscreen && fullscreenParam !== '0');
  const [indexOpen, setIndexOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [font, setFont] = useState<ReaderFont>('amiri');
  const [size, setSize] = useState<ReaderSize>('m');
  const [background, setBackground] = useState<ReaderBackground>('light');
  const [headerHidden, setHeaderHidden] = useState(false);
  const section = useRef<HTMLDivElement>(null);
  const contentScrollTop = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [shellPage, setShellPage] = useState(page);
  const [fetched, setFetched] = useState<Record<string, AccountPage>>({});
  const inFlight = useRef(new Set<string>());
  const query = new URLSearchParams({ page: String(shellPage) });
  if (book) query.set('account', book);
  const { data, error, isLoading } = useSWR<AccountsResponse>(
    basePath ? `${basePath}/accounts?${query.toString()}` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );
  const accountId = data?.account?.id;
  const pageCount = data?.account?.pageCount ?? 0;
  const cached = useCallback((sequence: number) => {
    if (!accountId) return undefined;
    return fetched[`${accountId}:${sequence}`] ?? data?.pages?.find((candidate) => candidate.sequence === sequence);
  }, [accountId, data?.pages, fetched]);
  const currentPage = cached(page);

  const fetchRange = useCallback(async (from: number, to: number) => {
    if (!accountId) return;
    const key = `${accountId}:${from}-${to}`;
    if (inFlight.current.has(key)) return;
    inFlight.current.add(key);
    try {
      const body = await fetcher(`${basePath}/accounts?account=${accountId}&from=${from}&to=${to}`) as { pages: AccountPage[] };
      setFetched((previous) => {
        const next = { ...previous };
        body.pages.forEach((item) => { next[`${accountId}:${item.sequence}`] = item; });
        return next;
      });
    } catch {
      inFlight.current.delete(key);
    }
  }, [accountId, basePath]);

  useEffect(() => {
    if (!accountId || !pageCount || page > pageCount) return;
    if (!cached(page)) { fetchRange(Math.max(1, page - PREFETCH_AHEAD), Math.min(pageCount, page + PREFETCH_AHEAD)); return; }
    const last = Math.min(pageCount, page + PREFETCH_AHEAD);
    const first = Math.max(1, page - PREFETCH_AHEAD);
    if (!cached(last)) fetchRange(last, Math.min(pageCount, last + WINDOW - 1));
    if (!cached(first)) fetchRange(Math.max(1, first - WINDOW + 1), first);
  }, [accountId, pageCount, page, cached, fetchRange]);
  const { data: sectionsData } = useSWR<SectionsResponse>(
    basePath && accountId ? `${basePath}/accounts/sections?account=${accountId}` : null,
    fetcher,
  );
  const sections = sectionsData?.sections ?? [];

  useEffect(() => {
    try {
      const stored = localStorage.getItem('namaq-reader-settings');
      if (!stored) return;
      const value = JSON.parse(stored) as Partial<{ font: ReaderFont; size: ReaderSize; background: ReaderBackground }>;
      if (value.font === 'amiri' || value.font === 'sans') setFont(value.font);
      if (value.size && value.size in fontSizes) setSize(value.size);
      if (value.background && value.background in backgroundStyles) setBackground(value.background);
    } catch {
      localStorage.removeItem('namaq-reader-settings');
    }
  }, []);

  useEffect(() => {
    if (!fullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [fullscreen]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const writeSettings = (next: { font?: ReaderFont; size?: ReaderSize; background?: ReaderBackground }) => {
    const value = { font: next.font ?? font, size: next.size ?? size, background: next.background ?? background };
    if (next.font) setFont(next.font);
    if (next.size) setSize(next.size);
    if (next.background) setBackground(next.background);
    localStorage.setItem('namaq-reader-settings', JSON.stringify(value));
  };

  const setSelection = useCallback((nextBook: string | null, nextPage: number) => {
    if (nextBook !== data?.account?.id) { setShellPage(nextPage); setFetched({}); inFlight.current.clear(); }
    const next = new URLSearchParams(searchParams.toString());
    if (nextBook) next.set('book', nextBook);
    else next.delete('book');
    next.set('page', String(nextPage));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    if (!fullscreen) section.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [data?.account?.id, fullscreen, pathname, router, searchParams]);

  const setFullscreen = useCallback((value: boolean) => {
    setHeaderHidden(false);
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set('fullscreen', '1');
    else if (defaultFullscreen) next.set('fullscreen', '0');
    else next.delete('fullscreen');
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }, [defaultFullscreen, pathname, router, searchParams]);

  const turnPage = useCallback((direction: -1 | 1) => {
    if (!data?.account) return;
    const nextPage = page + direction;
    if (nextPage >= 1 && nextPage <= data.account.pageCount) setSelection(data.account.id, nextPage);
  }, [data?.account, page, setSelection]);

  useEffect(() => {
    if (!fullscreen || !data?.account) return;
    const rtl = isRtl(data.account.source.language);
    const onKeyDown = (event: KeyboardEvent) => {
      if (window.matchMedia?.('(max-width: 767px)').matches) return;
      if (event.altKey || event.ctrlKey || event.metaKey || event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) { event.preventDefault(); turnPage(1); }
      if (event.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) { event.preventDefault(); turnPage(-1); }
      if (event.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [fullscreen, data?.account, turnPage, setFullscreen]);

  if (error) return <ErrorMessage title={language === 'ar' ? 'تعذر تحميل نص المصدر' : 'The source text could not be loaded'} description={String(error)} />;
  if (isLoading || !data) return <LoadingSpinner />;
  if (!data.account || !data.page) return null;
  if (!currentPage) return <LoadingSpinner />;

  const { accounts, account } = data;
  const current = currentPage;
  const printed = current.printedPage ?? String(current.sequence);
  const rtl = isRtl(account.source.language);
  let currentSectionIndex = -1;
  sections.forEach((candidate, index) => { if (candidate.sequence <= current.sequence) currentSectionIndex = index; });
  const t = language === 'ar';
  const backIcon = t ? faArrowRight : faArrowLeft;
  const forwardIcon = t ? faArrowLeft : faArrowRight;
  const pageOptions = Array.from({ length: account.pageCount }, (_, index) => {
    const entry = data.pageNumbers?.[index];
    if (!entry) return String(index + 1);
    return [entry.printedPage ?? entry.sequence, entry.volume && (t ? `ج${entry.volume.number}` : `vol. ${entry.volume.number}`)].filter(Boolean).join(' · ');
  });
  const pageContentStyle = {
    ...backgroundStyles[background],
    fontSize: fontSizes[size],
    fontFamily: font === 'amiri' ? 'var(--font-amiri), ui-serif, Georgia, serif' : 'var(--font-reader-sans)',
  };

  return (
    <section
      className={fullscreen ? 'fixed inset-0 z-[60] flex min-h-0 flex-col overflow-hidden bg-white text-gray-900 dark:bg-black dark:text-gray-100' : 'rounded-lg border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-black'}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {(
        <div ref={section} className={`shrink-0 scroll-mt-[88px] overflow-hidden transition-[max-height,opacity] duration-200 ${fullscreen && headerHidden ? 'max-h-0 opacity-0' : 'max-h-[40rem] opacity-100'} ${fullscreen ? '' : 'mb-3 rounded-lg border border-amber-400'}`}>
        <header className="relative z-10 flex shrink-0 items-center gap-2 border-b border-amber-400 bg-gray-50 px-3 py-2 dark:bg-gray-950">
          {fullscreen && (
          <div className="relative" ref={menuRef}>
            <Button size="icon" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? (t ? 'إغلاق القائمة' : 'Close menu') : (t ? 'فتح القائمة' : 'Open menu')} aria-pressed={menuOpen}><FontAwesomeIcon icon={menuOpen ? faXmark : faBars} /></Button>
            {menuOpen && (
              <div className="fixed inset-x-3 top-14 z-[70] max-h-[75dvh] overflow-y-auto rounded-lg border border-amber-400 bg-white p-3 shadow-xl dark:bg-gray-950 lg:inset-x-auto lg:start-3 lg:w-64">
                <ul className="flex flex-col gap-1">
                  {getAllNavLinks(language).map((link) => <li key={link.href}><Link href={link.href} onClick={() => setMenuOpen(false)} className="block rounded px-2 py-2 text-sm hover:bg-amber-50 dark:hover:bg-gray-800">{link.label}</Link></li>)}
                  <li><Link href="/about" onClick={() => setMenuOpen(false)} className="block rounded px-2 py-2 text-sm hover:bg-amber-50 dark:hover:bg-gray-800">{t ? 'عن الموقع' : 'About'}</Link></li>
                </ul>
                <div className="mt-3 flex flex-col gap-3 border-t border-amber-400 pt-3"><LanguageSwitcher /><ThemeSwitcher /></div>
              </div>
            )}
          </div>
          )}
          <p className="min-w-0 flex-1 truncate text-sm text-gray-700 dark:text-gray-200">{labelAccount(account)}</p>
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="outline" size="icon" disabled={current.sequence <= 1} onClick={() => turnPage(-1)} aria-label={t ? 'الصفحة السابقة' : 'Previous page'}><FontAwesomeIcon icon={backIcon} /></Button>
            <select
              aria-label={t ? 'انتقل إلى صفحة' : 'Go to page'}
              className="max-w-[7.5rem] cursor-pointer self-stretch appearance-none rounded border border-amber-400 bg-transparent px-2 text-center text-sm text-gray-800 dark:text-gray-100"
              value={current.sequence}
              onChange={(event) => setSelection(account.id, Number(event.target.value))}
            >
              {pageOptions.map((label, index) => <option key={index + 1} value={index + 1} className="text-gray-900">{label}</option>)}
            </select>
            <Button variant="outline" size="icon" disabled={current.sequence >= account.pageCount} onClick={() => turnPage(1)} aria-label={t ? 'الصفحة التالية' : 'Next page'}><FontAwesomeIcon icon={forwardIcon} /></Button>
          </div>
          <Button size="icon" active={indexOpen} onClick={() => { setIndexOpen((open) => !open); setSettingsOpen(false); }} aria-label={t ? 'فتح الفهرس' : 'Open index'} aria-pressed={indexOpen}><FontAwesomeIcon icon={indexOpen ? faXmark : faList} /></Button>
          <Button size="icon" active={settingsOpen} onClick={() => { setSettingsOpen((open) => !open); setIndexOpen(false); }} aria-label={t ? 'فتح إعدادات القراءة' : 'Open reading settings'} aria-pressed={settingsOpen}><FontAwesomeIcon icon={settingsOpen ? faXmark : faGear} /></Button>
          <Button size="icon" onClick={() => setFullscreen(!fullscreen)} aria-label={fullscreen ? (t ? 'إنهاء وضع القراءة' : 'Exit fullscreen') : (t ? 'قراءة بملء الشاشة' : 'Read fullscreen')}><FontAwesomeIcon icon={fullscreen ? faCompress : faExpand} /></Button>
        </header>
      {(indexOpen || settingsOpen) && (
        <div className="z-[5] shrink-0 border-b border-amber-300 bg-amber-50 p-3 dark:border-amber-800 dark:bg-gray-900">
          {indexOpen && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">{t ? selectorLabel.ar : selectorLabel.en}
                <select className="rounded border border-amber-400 bg-white px-2 py-2 dark:bg-gray-950" value={account.id} onChange={(event) => setSelection(event.target.value, 1)}>
                  {accounts.map((option) => <option key={option.id} value={option.id}>{labelAccount(option)}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">{t ? 'الأبواب' : 'Sections'}
                <select className="max-w-full rounded border border-amber-400 bg-white px-2 py-2 dark:bg-gray-950" dir="rtl" value={currentSectionIndex} onChange={(event) => {
                  const target = sections[Number(event.target.value)];
                  if (target) setSelection(account.id, target.sequence);
                }}>
                  {currentSectionIndex === -1 && <option value={-1} disabled>{t ? 'اختر قسما' : 'Choose a section'}</option>}
                  {sections.map((item, index) => <option key={`${item.sequence}-${index}`} value={index}>{item.heading}</option>)}
                </select>
              </label>
            </div>
          )}
          {settingsOpen && (
            <div className="grid gap-4 sm:grid-cols-3">
              <fieldset className="flex flex-wrap gap-2"><legend className="mb-2 w-full text-sm font-semibold">{t ? 'الخط' : 'Font'}</legend>
                <Button size="sm" active={font === 'amiri'} onClick={() => writeSettings({ font: 'amiri' })}><FontAwesomeIcon icon={faFont} />{t ? 'أميري' : 'Amiri'}</Button><Button size="sm" active={font === 'sans'} onClick={() => writeSettings({ font: 'sans' })}><FontAwesomeIcon icon={faFont} />{t ? 'خط النظام' : 'Sans'}</Button>
              </fieldset>
              <fieldset className="flex flex-wrap gap-2"><legend className="mb-2 w-full text-sm font-semibold">{t ? 'حجم الخط' : 'Text size'}</legend>
                <label className="flex w-full items-center gap-3 text-sm">
                  <span>{t ? 'صغير' : 'Small'}</span>
                  <input
                    aria-label={t ? 'حجم الخط' : 'Text size'}
                    type="range"
                    min="0"
                    max="3"
                    step="1"
                    value={(['s', 'm', 'l', 'xl'] as const).indexOf(size)}
                    onChange={(event) => writeSettings({ size: (['s', 'm', 'l', 'xl'] as const)[Number(event.target.value)] })}
                    className="w-full accent-amber-500"
                  />
                  <span>{t ? 'كبير' : 'Large'}</span>
                </label>
              </fieldset>
              <fieldset className="flex flex-wrap gap-2"><legend className="mb-2 w-full text-sm font-semibold">{t ? 'الخلفية' : 'Background'}</legend>
                {(['light', 'dark', 'sepia'] as const).map((value) => <Button key={value} size="sm" active={background === value} onClick={() => writeSettings({ background: value })}><FontAwesomeIcon icon={({ light: faSun, dark: faMoon, sepia: faPalette } as const)[value]} />{t ? ({ light: 'فاتح', dark: 'داكن', sepia: 'بني' } as const)[value] : ({ light: 'Light', dark: 'Dark', sepia: 'Sepia' } as const)[value]}</Button>)}
              </fieldset>
            </div>
          )}
          <Button className="mt-3" size="sm" onClick={() => { setIndexOpen(false); setSettingsOpen(false); }}><FontAwesomeIcon icon={faXmark} />{t ? 'إغلاق' : 'Close'}</Button>
        </div>
      )}
        </div>
      )}

      <div className={fullscreen ? 'flex min-h-0 flex-1 flex-col px-3 pb-2 pt-3 sm:px-6' : 'flex flex-col'}>
        <div
          className={fullscreen ? 'muted-scrollbar min-h-0 flex-1 overflow-y-auto rounded-lg border border-black/10 px-4 py-3 dark:border-white/10 sm:px-8' : 'muted-scrollbar max-h-[75vh] overflow-y-auto rounded-lg border border-gray-200 px-4 py-3 dark:border-white/10'}
          style={pageContentStyle}
          onScroll={(event) => {
            const top = event.currentTarget.scrollTop;
            if (fullscreen) {
              if (top <= 0) setHeaderHidden(false);
              else if (top > contentScrollTop.current + 4) setHeaderHidden(true);
              else if (top < contentScrollTop.current - 4) setHeaderHidden(false);
            }
            contentScrollTop.current = top;
          }}
          onTouchStart={(event) => { const touch = event.touches[0]; touchStart.current = { x: touch.clientX, y: touch.clientY }; }}
          onTouchEnd={(event) => {
            const start = touchStart.current; touchStart.current = null;
            if (!start) return;
            const touch = event.changedTouches[0]; const dx = touch.clientX - start.x; const dy = touch.clientY - start.y;
            if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
            turnPage((dx > 0) === rtl ? 1 : -1);
          }}
        >
          <article dir={rtl ? 'rtl' : 'ltr'} lang={account.source.language} className="arabic-source space-y-4 text-justify">
            {pageParagraphs(current.bodyMarkdown).map(({ text, heading: isHeading }, index) => isHeading
              ? <h2 key={index} className="my-6 border-b border-amber-400 pb-2 text-center text-[1.5em] font-bold">{text}</h2>
              : <p key={index}>{text}</p>)}
          </article>
          {current.notesMarkdown && (
            <aside className="mt-4 border-t border-gray-400/40 pt-3 text-sm opacity-80">
              <h3 className="mb-2 font-semibold">{t ? 'حواشي المحقق' : "The editor's notes"}</h3>
              <div dir={rtl ? 'rtl' : 'ltr'} lang={account.source.language} className="arabic-source space-y-2 text-justify">{pageParagraphs(current.notesMarkdown).map(({ text }, index) => <p key={index}>{text}</p>)}</div>
            </aside>
          )}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">{t ? `ص ${printed}` : `p. ${printed}`}</p>
        </div>
      </div>
    </section>
  );
}
