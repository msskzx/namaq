'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bookmark, BookOpenText, ChevronLeft, ChevronRight, List, Search, X } from 'lucide-react';
import type { ReaderBookId, Spot } from '@shared/bookReader';
import { num } from '@shared/quran/arabicNumber';
import { pageName } from '@shared/readerBooks';
import { readFasilas, readSavedParagraphs, serverFasilas, serverSavedParagraphs, setBookFasila, setLastBookSpot, subscribeFasilas, subscribeSavedParagraphs, toggleSavedParagraph } from '@shared/readingMarks';
import Button from '@/components/common/Button';
import { NavActions, NavButtons } from '@/components/common/NavBar';
import ExternalLink from '@/components/common/ExternalLink';
import FasilaIcon from '@/components/quran/FasilaIcon';
import { useSwipe } from '@/components/common/useSwipe';
import type { ViewSlice } from '@/lib/books/bookView';
import styles from './Books.module.css';

type Sheet = 'contents' | 'saved' | 'search';
type Hit = { page: number; name: string; entry: number; at: number; before: string; match: string; after: string };

/**
 * The website's book reader, as the app's (mobile/src/screens/book.tsx; docs/plans/book-reader.md): one printed page at a
 * time. A paragraph's buttons save it (as many as one likes) or put the reader's «فاصلة» there, where they stopped; turning
 * to other pages never moves it. The last page open is kept apart, so the book opens where it was left.
 */
export default function BookReader({ id, title, page, total, name, printed, source, slices, contents }: {
  id: ReaderBookId; title: string; page: number; total: number; name: string; printed: { part: number; page: number }; source: string;
  slices: ViewSlice[]; contents: { surah: number; name: string; page: number }[];
}) {
  const router = useRouter();
  // ?lit=entry:at (a فاصلة or saved paragraph opened from elsewhere), read after load so the page itself stays static.
  const [lit, setLit] = useState<string | null>(null);
  const fasila = useSyncExternalStore(subscribeFasilas, readFasilas, serverFasilas)[id];
  const savedAll = useSyncExternalStore(subscribeSavedParagraphs, readSavedParagraphs, serverSavedParagraphs);
  const saved = useMemo(() => savedAll.filter(item => item.book === id), [savedAll, id]);
  const savedKeys = useMemo(() => new Set(saved.map(item => `${item.entry}:${item.at}`)), [saved]);
  const [picked, setPicked] = useState<Spot | null>(null);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const stage = useRef<HTMLElement>(null);
  const href = (at: number) => `/quran/books/${id}/${at}`;
  const go = (step: number) => { const at = page + step; if (at >= 1 && at <= total) router.push(href(at)); };

  const first = slices.flatMap(slice => slice.paragraphs)[0];
  useEffect(() => { if (first) setLastBookSpot(id, { entry: first.entry, at: first.at }); }, [id, first]);
  useEffect(() => {
    const spot = new URLSearchParams(window.location.search).get('lit');
    setLit(spot);
    if (spot) document.querySelector(`[data-spot="${spot}"]`)?.scrollIntoView({ block: 'center' });
  }, [page]);
  const toolbar = useRef<HTMLDivElement>(null);
  useEffect(() => { if (picked) toolbar.current?.querySelector('button')?.focus({ preventScroll: true }); }, [picked]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (sheet || event.defaultPrevented || event.altKey || event.metaKey || event.ctrlKey || event.shiftKey || (event.target as HTMLElement).closest('input, textarea')) return;
      if (event.key === 'ArrowLeft') go(1);
      if (event.key === 'ArrowRight') go(-1);
      if (event.key === 'Escape') setPicked(null);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });
  const { justSwiped } = useSwipe(stage, true, { forward: dx => dx > 0, canStep: forward => (forward ? page < total : page > 1), drag: () => {}, step: forward => go(forward ? 1 : -1), cancel: () => {} });

  const onPage = (spot?: Spot) => !!spot && slices.some(slice => slice.paragraphs.some(p => p.entry === spot.entry && p.at === spot.at));
  const pickedText = (spot: Spot) => slices.flatMap(slice => slice.paragraphs).find(p => p.entry === spot.entry && p.at === spot.at)?.runs.map(run => run.text).join('') ?? '';
  const pickedAyah = picked ? slices.find(slice => slice.paragraphs.some(p => p.entry === picked.entry && p.at === picked.at))?.ayah : undefined;
  // The فاصلة is a page (owner, 2026-11-17): the ribbon in the top bar fills on its page, and a tap puts it on the page open or takes it off.
  const onFasila = onPage(fasila);
  const markPage = () => setBookFasila(id, onFasila || !first ? null : { entry: first.entry, at: first.at, ...printed });
  const isSaved = !!picked && savedKeys.has(`${picked.entry}:${picked.at}`);

  return (
    <div dir="rtl" lang="ar" className={styles.reader}>
      <NavActions><h1 className={styles.title}>{title}</h1></NavActions>
      <NavButtons>
        <Button size="lg" variant="ghost" aria-pressed={onFasila} aria-label={onFasila ? 'أزل الفاصلة من هذه الصفحة' : 'ضع الفاصلة في هذه الصفحة: هنا توقفت'}
          title={onFasila ? 'أزل الفاصلة من هذه الصفحة' : 'ضع الفاصلة في هذه الصفحة: هنا توقفت'} className="text-[var(--home-accent)]" onClick={markPage}>
          <FasilaIcon aria-hidden filled={onFasila} />
        </Button>
        <Button size="lg" variant="muted" aria-label="ابحث في الكتاب" title="ابحث في الكتاب" onClick={() => setSheet('search')}><Search aria-hidden /></Button>
        <Button size="lg" variant="muted" aria-label="فهرس الكتاب ومحفوظاته" title="فهرس الكتاب ومحفوظاته" onClick={() => setSheet('contents')}><List aria-hidden /></Button>
      </NavButtons>
      <article ref={stage} className={styles.page}>
        {slices.map(slice => (
          <section key={slice.key}>
            {slice.head && <Link href={slice.head.href} className={styles.pill} aria-label={`افتح ${slice.head.label} في المصحف`}><BookOpenText size={14} aria-hidden />{slice.head.label}</Link>}
            {slice.paragraphs.map(p => {
              const key = `${p.entry}:${p.at}`;
              const on = picked?.entry === p.entry && picked.at === p.at;
              return (
                <p key={key} data-spot={key} data-lit={on || lit === key || undefined} className={styles.paragraph} role="button" tabIndex={0} aria-pressed={on}
                  onClick={() => { if (!justSwiped()) setPicked(on ? null : { entry: p.entry, at: p.at }); }}
                  onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setPicked(on ? null : { entry: p.entry, at: p.at }); } }}>
                  {savedKeys.has(key) && <span className={styles.saved} aria-label="فقرة محفوظة" role="img" />}
                  {p.runs.map((run, i) => (run.quran ? <span key={i} className="font-quran text-[var(--home-accent)]">{run.text}</span> : run.text))}
                </p>
              );
            })}
          </section>
        ))}
        <footer className={styles.footer}>
          <Button size="icon" variant="ghost" aria-label="الصفحة السابقة" title="الصفحة السابقة" disabled={page <= 1} onClick={() => go(-1)}><ChevronRight aria-hidden /></Button>
          <ExternalLink href={source} className={styles.name}>{name}</ExternalLink>
          <Button size="icon" variant="ghost" aria-label="الصفحة التالية" title="الصفحة التالية" disabled={page >= total} onClick={() => go(1)}><ChevronLeft aria-hidden /></Button>
        </footer>
      </article>
      {picked && (
        <div ref={toolbar} role="toolbar" aria-label="أزرار الفقرة" className={styles.actions}>
          <Button size="lg" variant="muted" style={isSaved ? { color: 'var(--home-root)' } : undefined} aria-pressed={isSaved} aria-label={isSaved ? 'أزلها من المحفوظات' : 'احفظ الفقرة'} title={isSaved ? 'أزلها من المحفوظات' : 'احفظ الفقرة'}
            onClick={() => { toggleSavedParagraph({ book: id, ...picked, ...printed, text: pickedText(picked).slice(0, 160) }); setPicked(null); }}><Bookmark aria-hidden fill={isSaved ? 'currentColor' : 'none'} /></Button>
          {pickedAyah && <Button size="lg" variant="muted" href={`/quran/read/ayah/${pickedAyah.replace(':', '/')}`} aria-label="افتح الآية في المصحف" title="افتح الآية في المصحف"><BookOpenText aria-hidden /></Button>}
          <Button size="lg" variant="ghost" aria-label="إغلاق" title="إغلاق" onClick={() => setPicked(null)}><X aria-hidden /></Button>
        </div>
      )}
      {fasila && !picked && !onPage(fasila) && (
        <div className={styles.pillBar}>
          <Button size="md" variant="muted" href={`/quran/books/${id}?at=${fasila.entry}:${fasila.at}`} className={styles.backPill} aria-label={`عد إلى فاصلتك، ${pageName(id, fasila.part, fasila.page)}`}>
            <FasilaIcon aria-hidden width={18} height={18} className="text-[var(--home-accent)]" />
            عُد إلى فاصلتك · {pageName(id, fasila.part, fasila.page)}
          </Button>
        </div>
      )}
      {sheet && <BookSheet id={id} tab={sheet} onTab={setSheet} onClose={() => setSheet(null)} contents={contents} page={page} saved={saved} />}
    </div>
  );
}

const TABS: { tab: Sheet; label: string }[] = [{ tab: 'contents', label: 'الفهرس' }, { tab: 'saved', label: 'المحفوظات' }, { tab: 'search', label: 'البحث في الكتاب' }];

/** One sheet for moving about the book: its surahs, the paragraphs saved from it, and a search through it. */
function BookSheet({ id, tab, onTab, onClose, contents, page, saved }: {
  id: ReaderBookId; tab: Sheet; onTab: (tab: Sheet) => void; onClose: () => void;
  contents: { surah: number; name: string; page: number }[]; page: number;
  saved: { entry: number; at: number; part: number; page: number; text: string }[];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { dialog.current?.showModal(); }, []);
  const here = contents.findLast(item => item.page <= page)?.surah;
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<{ hits: Hit[]; more: boolean; query: string }>({ hits: [], more: false, query: '' });
  useEffect(() => {
    if (query.trim().length < 2) return;
    const control = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/books/${id}/search?q=${encodeURIComponent(query)}`, { signal: control.signal })
        .then(response => response.json()).then(data => setFound({ ...data, query })).catch(() => {});
    }, 250);
    return () => { clearTimeout(timer); control.abort(); };
  }, [id, query]);
  const hits = query.trim().length < 2 ? [] : found.hits;
  return (
    <dialog ref={dialog} className={styles.sheet} onClose={onClose} onClick={event => { if (event.target === dialog.current) onClose(); }} aria-label={TABS.find(item => item.tab === tab)?.label}>
      <div className={styles.sheetHead}>
        <div role="tablist" className="flex gap-1">
          {TABS.map(item => (
            <button key={item.tab} id={`book-tab-${item.tab}`} role="tab" aria-selected={tab === item.tab} aria-controls="book-sheet-panel" className={styles.tab} onClick={() => onTab(item.tab)}>{item.label}</button>
          ))}
        </div>
        <Button size="icon" variant="ghost" aria-label="إغلاق" onClick={onClose}><X aria-hidden /></Button>
      </div>
      <div id="book-sheet-panel" role="tabpanel" aria-labelledby={`book-tab-${tab}`} className={styles.sheetBody}>
        {tab === 'contents' && contents.map(item => (
          <Link key={item.surah} href={`/quran/books/${id}/${item.page}`} onClick={onClose} aria-label={`${item.name}، الصفحة ${num(item.page)}`} data-here={item.surah === here || undefined} className={styles.row}>
            <span className="w-8 text-sm text-[var(--home-accent)]">{num(item.surah)}</span>
            <span className="flex-1">{item.name}</span>
          </Link>
        ))}
        {tab === 'saved' && (saved.length ? saved.map(item => (
          <Link key={`${item.entry}:${item.at}`} href={`/quran/books/${id}?spot=${item.entry}:${item.at}`} onClick={onClose} className={styles.row}>
            <span className="flex-1 line-clamp-2">{item.text}</span>
            <span className="text-sm text-[var(--home-muted)]">{pageName(id, item.part, item.page)}</span>
          </Link>
        )) : <p className="p-6 text-center text-[var(--home-muted)]">لم تحفظ فقرة من هذا الكتاب بعد. اضغط على فقرة لتحفظها.</p>)}
        {tab === 'search' && (
          <>
            <input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="كلمة أو عبارة في الكتاب" aria-label="ابحث في الكتاب" className={styles.search} />
            {hits.map(hit => (
              <Link key={`${hit.entry}:${hit.at}`} href={`/quran/books/${id}/${hit.page}`} onClick={onClose} className={styles.row}>
                <span className="flex-1">{hit.before}<mark className={styles.match}>{hit.match}</mark>{hit.after}</span>
                <span className="shrink-0 text-sm text-[var(--home-muted)]">{hit.name}</span>
              </Link>
            ))}
            {found.more && hits.length > 0 && <p className="p-4 text-center text-sm text-[var(--home-muted)]">أول {num(hits.length)} موضعًا؛ زد في العبارة لتضيّقها.</p>}
          </>
        )}
      </div>
    </dialog>
  );
}
