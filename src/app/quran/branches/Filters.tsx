'use client';

import React, { useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Bookmark, BookmarkCheck, Check, Funnel, Send, X } from 'lucide-react';
import { readBookmarks, serverBookmarks, subscribeBookmarks, toggleBookmark } from '@/lib/bookmarks';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { branchesHref, type BranchesView } from '@/lib/quran/branches';
import Toggle from '@/components/common/Toggle';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';
import type { JuzRange } from '@/lib/quran/juz';
import JuzFilter from './JuzFilter';

/** The funnel beside the search box: a sheet with the juz range, and a dot while the range is narrowed. */
export function FilterButton({ range, view }: { range: JuzRange | null; view: BranchesView }) {
  const ar = useLanguage().language === 'ar';
  const sheet = useRef<HTMLDialogElement>(null);
  const label = ar ? 'تصفية' : 'Filter';
  const close = ar ? 'إغلاق' : 'Close';
  // The sheet opens on its first field (the dialog would otherwise focus the close button).
  const open = () => {
    sheet.current?.showModal();
    sheet.current?.querySelector<HTMLInputElement>('input:not([type="hidden"]):not([disabled])')?.focus();
  };
  return <>
    <span className="relative shrink-0">
      <Button size="lg" variant="muted" aria-haspopup="dialog" onClick={open} aria-label={label} title={label}><Funnel aria-hidden /></Button>
      {(range || !!view.saved?.length) && <span aria-hidden className="pointer-events-none absolute end-2 top-2 size-2 rounded-full bg-[var(--home-accent)]" />}
    </span>
    <dialog ref={sheet} aria-label={label} dir={ar ? 'rtl' : 'ltr'} onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] p-0 text-[var(--home-ink)] shadow-lg backdrop:bg-black/40 max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg">{label}</h2>
          <Button size="lg" variant="muted" onClick={() => sheet.current?.close()} aria-label={close} title={close}><X aria-hidden /></Button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <JuzFilter range={range} view={view} />
          <SavedOnly range={range} view={view} onDone={() => sheet.current?.close()} />
        </div>
      </div>
    </dialog>
  </>;
}

const useBookmarks = () => useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);

/** Narrows the trees to the ones saved in this browser; their ids travel in the address, so the server can step through them. */
function SavedOnly({ range, view, onDone }: { range: JuzRange | null; view: BranchesView; onDone: () => void }) {
  const ar = useLanguage().language === 'ar';
  const saved = useBookmarks();
  const router = useNavigatingRouter();
  const on = !!view.saved?.length;
  const label = ar ? 'المحفوظة فقط' : 'Saved only';
  const hint = !on && saved.length === 0 ? (ar ? 'احفظ شجرة بزر الحفظ تحتها أولًا' : 'Save a tree with the bookmark under it first') : label;
  return <span title={hint} className="inline-flex shrink-0">
    <Toggle size="lg" checked={on} label={label} disabled={!on && saved.length === 0} onIcon={<Bookmark className="size-4" aria-hidden />} onChange={checked => {
      onDone();
      router.push(branchesHref('', range ?? undefined, { query: view.query, surah: view.surah, mode: view.mode, saved: checked ? saved.map(item => item.id) : undefined }));
    }} />
  </span>;
}

// The saved address keeps the tree, the view and the juz range, not the search or the surah narrowing.
function bookmarkOf(id: string, text: string) {
  const url = new URL(window.location.href);
  ['q', 's', 'n', 'b'].forEach(key => url.searchParams.delete(key));
  return { id, text, href: `${url.pathname}${url.search}` };
}

const TAP_GAP = 300;
const TAP_SLOP = 24;

/** As on a post: a double tap on the tree or matrix saves it (never unsaves), with a bookmark popping up in the middle. */
export function DoubleTapSave({ id, text, children }: { id: string; text: string; children: React.ReactNode }) {
  const [pop, setPop] = useState(0);
  const down = useRef<{ x: number; y: number } | null>(null);
  const last = useRef<{ x: number; y: number; at: number } | null>(null);
  const onPointerDown = (event: React.PointerEvent) => { down.current = event.isPrimary ? { x: event.clientX, y: event.clientY } : null; };
  const onPointerUp = (event: React.PointerEvent) => {
    const start = down.current;
    down.current = null;
    if (!id) return;
    // Taps only: not a drag or a swipe, and not on a button, link or field.
    if (!start || Math.hypot(event.clientX - start.x, event.clientY - start.y) > TAP_SLOP) return;
    if ((event.target as Element).closest('button, a, input, summary, [role="button"]')) { last.current = null; return; }
    const tap = { x: event.clientX, y: event.clientY, at: Date.now() };
    const previous = last.current;
    if (previous && tap.at - previous.at < TAP_GAP && Math.hypot(tap.x - previous.x, tap.y - previous.y) < TAP_SLOP * 2) {
      last.current = null;
      if (!readBookmarks().some(item => item.id === id)) toggleBookmark(bookmarkOf(id, text));
      setPop(count => count + 1);
      return;
    }
    last.current = tap;
  };
  return <div data-double-tap className="relative" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
    {children}
    {pop > 0 && <span key={pop} aria-hidden data-saved-pop className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center text-[var(--home-accent)] motion-safe:animate-[saved-pop_700ms_ease-out_forwards] opacity-0">
      <BookmarkCheck className="size-20 drop-shadow" strokeWidth={1.5} />
    </span>}
  </div>;
}

/** Under the tree or matrix, as on a post: save, with share right beside it. */
export function CardActions({ id, text }: { id: string; text: string }) {
  const ar = useLanguage().language === 'ar';
  const saved = useBookmarks().some(item => item.id === id);
  const label = saved ? (ar ? 'إزالة من المحفوظة' : 'Remove from saved') : (ar ? 'حفظ' : 'Save');
  const save = () => toggleBookmark(bookmarkOf(id, text));
  return <div className="flex items-center justify-end gap-1">
    <ShareButton />
    <Button size="lg" variant="muted" aria-pressed={saved} onClick={save} aria-label={label} title={label} className={saved ? 'text-[var(--home-accent)]' : undefined}>
      {saved ? <BookmarkCheck aria-hidden /> : <Bookmark aria-hidden />}
    </Button>
  </div>;
}

/** Shares the page's address, which holds the tree, the view and the filters: the phone's share sheet, or a copied link. */
export function ShareButton() {
  const ar = useLanguage().language === 'ar';
  const [copied, setCopied] = useState(false);
  const label = copied ? (ar ? 'نُسخ الرابط' : 'Link copied') : (ar ? 'مشاركة' : 'Share');
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: document.title, url }); } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return <Button size="lg" variant="muted" onClick={() => void share()} aria-label={label} title={label}>
    {copied ? <Check aria-hidden /> : <Send aria-hidden />}
  </Button>;
}

/** Above the tree while a surah narrows the trees: its chip, which removes the filter. */
export function SurahChip({ surah, clear }: { surah: string; clear: string }) {
  const ar = useLanguage().language === 'ar';
  const remove = ar ? 'إزالة السورة' : 'Remove surah';
  return <span className="inline-flex items-center gap-1 self-start rounded-full border border-[var(--home-rule)] ps-3 pe-1 py-0.5 text-sm text-[var(--home-ink)]">
    {ar ? `سورة ${surah}` : `Surah ${surah}`}
    <Link href={clear} scroll={false} aria-label={remove} title={remove} className="grid size-6 place-items-center rounded-full text-[var(--home-muted)] hover:bg-[var(--home-paper-deep)] hover:text-[var(--home-ink)]"><X size={14} aria-hidden /></Link>
  </span>;
}

export function NoTrees({ query }: { query: string }) {
  const ar = useLanguage().language === 'ar';
  return <p role="status" className="text-sm text-[var(--home-muted)]">{query
    ? (ar ? `لا شجرة تطابق «${query}».` : `No tree matches «${query}».`)
    : (ar ? 'لا شجرة في هذا النطاق.' : 'No tree in this range.')}</p>;
}
