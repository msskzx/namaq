'use client';

import React, { useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Bookmark, BookmarkCheck, Check, Funnel, Share2, X } from 'lucide-react';
import { readBookmarks, serverBookmarks, subscribeBookmarks, toggleBookmark } from '@/lib/bookmarks';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import type { BranchesView } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';
import JuzFilter from './JuzFilter';

/** The funnel beside the search box: a sheet with the juz range, and a dot while the range is narrowed. */
export function FilterButton({ range, view }: { range: JuzRange | null; view: BranchesView }) {
  const ar = useLanguage().language === 'ar';
  const sheet = useRef<HTMLDialogElement>(null);
  const label = ar ? 'تصفية' : 'Filter';
  const close = ar ? 'إغلاق' : 'Close';
  return <>
    <span className="relative shrink-0">
      <Button size="lg" variant="muted" aria-haspopup="dialog" onClick={() => sheet.current?.showModal()} aria-label={label} title={label}><Funnel aria-hidden /></Button>
      {range && <span aria-hidden className="pointer-events-none absolute end-2 top-2 size-2 rounded-full bg-[var(--home-accent)]" />}
    </span>
    <dialog ref={sheet} aria-label={label} dir={ar ? 'rtl' : 'ltr'} onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] p-0 text-[var(--home-ink)] shadow-lg backdrop:bg-black/40 max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg">{label}</h2>
          <Button size="lg" variant="muted" onClick={() => sheet.current?.close()} aria-label={close} title={close}><X aria-hidden /></Button>
        </div>
        <JuzFilter range={range} view={view} />
        <Saved onOpen={() => sheet.current?.close()} />
      </div>
    </dialog>
  </>;
}

const useBookmarks = () => useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);

function Saved({ onOpen }: { onOpen: () => void }) {
  const ar = useLanguage().language === 'ar';
  const saved = useBookmarks();
  return <section aria-label={ar ? 'المحفوظة' : 'Saved'} className="flex flex-col gap-1 border-t border-[var(--home-rule)] pt-3">
    <h3 className="text-sm text-[var(--home-muted)]">{ar ? 'المحفوظة' : 'Saved'}</h3>
    {saved.length === 0
      ? <p className="text-sm text-[var(--home-muted)]">{ar ? 'احفظ شجرة بزر الحفظ تحتها لتجدها هنا.' : 'Save a tree with the bookmark under it to find it here.'}</p>
      : <ul className="flex max-h-60 flex-col overflow-y-auto">{saved.map(item => <li key={item.id}>
        <Link href={item.href} onClick={onOpen} className="block rounded px-2 py-1.5 font-arabic text-lg hover:bg-[var(--home-paper-deep)]" dir="rtl">{item.text}</Link>
      </li>)}</ul>}
  </section>;
}

/** Under the tree or matrix, as on a post: share on one side, save on the other. */
export function CardActions({ id, text }: { id: string; text: string }) {
  const ar = useLanguage().language === 'ar';
  const saved = useBookmarks().some(item => item.id === id);
  const label = saved ? (ar ? 'إزالة من المحفوظة' : 'Remove from saved') : (ar ? 'حفظ' : 'Save');
  const save = () => {
    const url = new URL(window.location.href);
    ['q', 's', 'n'].forEach(key => url.searchParams.delete(key));
    toggleBookmark({ id, text, href: `${url.pathname}${url.search}` });
  };
  return <div className="flex items-center justify-between gap-2">
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
    {copied ? <Check aria-hidden /> : <Share2 aria-hidden />}
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
