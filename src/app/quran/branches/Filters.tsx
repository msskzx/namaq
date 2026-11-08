'use client';

import React, { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowLeftRight, Bookmark, BookmarkCheck, Check, Clapperboard, Link2, Send, X } from 'lucide-react';
import { readBookmarks, serverBookmarks, subscribeBookmarks, toggleBookmark } from '@/lib/bookmarks';
import { isCompareBookmark } from '@/lib/compareBookmarks';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { branchesHref, type BranchesView } from '@/lib/quran/branches';
import Toggle from '@/components/common/Toggle';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';
import type { JuzRange } from '@/lib/quran/juz';
import type { RangeDraft } from '@/components/quran/RangeFilter';
import type { ScopeOption } from '@/components/quran/ScopePicker';
import { FilterSheet, isRangeUnit, ScopeFields, scopeRange, type FilterUnit } from '@/components/quran/ScopeFilter';
import GroupFilterControls from './GroupFilters';
import { hasGroupFilters, type GroupFilters } from '@/lib/quran/mutashabih/browse';
import { GrowControls, GrowProgress, useGrowth } from './Grow';
import GrowVideo, { canRecord, openVideo } from './GrowVideo';

type FilterDraft = { unit: FilterUnit; values: RangeDraft; filters: GroupFilters; saved: boolean };

export function FilterButton({ range, view, allSurahs = [] }: { range: JuzRange | null; view: BranchesView; allSurahs?: ScopeOption[] }) {
  const router = useNavigatingRouter();
  const initial = (): FilterDraft => {
    const filters = view.filters ?? {};
    const unit: FilterUnit = filters.surahFrom || filters.surahTo ? 'surah' : filters.pageFrom || filters.pageTo ? 'page' : filters.surahs ? 'surahs' : filters.juz ? 'juzs' : view.surah ? 'surah' : 'juz';
    const values: RangeDraft = unit === 'surah' ? [filters.surahFrom ?? String(view.surah ?? 1), filters.surahTo ?? String(view.surah ?? 114)]
      : unit === 'page' ? [filters.pageFrom ?? '1', filters.pageTo ?? '604'] : [String(range?.from ?? 1), String(range?.to ?? 30)];
    return { unit, values, filters, saved: !!view.saved?.length };
  };
  const [draft, setDraft] = useState<FilterDraft>(initial);
  const ranged = isRangeUnit(draft.unit);
  const next = scopeRange(draft.unit, draft.values);
  const apply = () => {
    if (ranged && !next) return false;
    const filters = { ...draft.filters };
    for (const key of ['surahs', 'juz', 'surahFrom', 'surahTo', 'pageFrom', 'pageTo'] as const) delete filters[key];
    if (draft.unit === 'surahs') filters.surahs = draft.filters.surahs ?? '';
    else if (draft.unit === 'juzs') filters.juz = draft.filters.juz ?? '';
    else if (draft.unit !== 'juz' && next) {
      filters[draft.unit === 'surah' ? 'surahFrom' : 'pageFrom'] = String(next.from);
      filters[draft.unit === 'surah' ? 'surahTo' : 'pageTo'] = String(next.to);
    }
    const juz = draft.unit === 'juz' && next && (next.from !== 1 || next.to !== 30) ? next : undefined;
    router.replace(branchesHref('', juz, { ...view, surah: undefined, occurrences: undefined, page: undefined, card: undefined, filters,
      saved: draft.saved ? view.saved?.length ? view.saved : readBookmarks().filter(item => !isCompareBookmark(item)).map(item => item.id) : undefined }), { scroll: false });
  };
  return <FilterSheet active={!!(range || view.saved?.length || hasGroupFilters(view.filters ?? {}) || view.filters?.sort)} onOpen={() => setDraft(initial())} onSubmit={apply}
    onReset={() => setDraft({ unit: 'juz', values: ['1', '30'], filters: {}, saved: false })} submitDisabled={ranged && !next}
    top={<SavedOnly checked={draft.saved} onChange={saved => setDraft({ ...draft, saved })} />}>
    <ScopeFields range={range} allSurahs={allSurahs} draft={{ unit: draft.unit, values: draft.values, surahs: draft.filters.surahs, juz: draft.filters.juz }}
      onChange={({ unit, values, surahs, juz }) => setDraft({ ...draft, unit, values, filters: { ...draft.filters, ...(surahs !== undefined ? { surahs } : {}), ...(juz !== undefined ? { juz } : {}) } })} />
    <GroupFilterControls filters={draft.filters} onChange={filters => setDraft({ ...draft, filters })} />
  </FilterSheet>;
}

const useBookmarks = () => useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);

function SavedOnly({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  const ar = useLanguage().language === 'ar';
  const saved = useBookmarks().filter(item => !isCompareBookmark(item));
  const id = useId();
  const label = ar ? 'المحفوظة فقط' : 'Saved only';
  const hint = !checked && saved.length === 0 ? (ar ? 'احفظ شجرة بزر الحفظ تحتها أولًا' : 'Save a tree with the bookmark under it first') : label;
  return <span title={hint} className="inline-flex items-center gap-2 text-sm"><Toggle id={id} size="lg" checked={checked} label={label} disabled={!checked && saved.length === 0} onIcon={<Bookmark className="size-4" aria-hidden />} onChange={onChange} /><label htmlFor={id}>{label}</label></span>;
}

function bookmarkOf(id: string, text: string, href?: string) {
  const url = new URL(href ?? window.location.href, window.location.origin);
  ['q', 's', 'n', 'b'].forEach(key => url.searchParams.delete(key));
  url.searchParams.set('o', id);
  return { id, text, href: `${url.pathname}${url.search}` };
}

const TAP_GAP = 300;
const TAP_SLOP = 24;

/** As on a post: a double tap on the tree or matrix saves it (never unsaves), with a bookmark popping up in the middle. */
export function DoubleTapSave({ id, text, href, aliases = [], children }: { id: string; text: string; href?: string; aliases?: string[]; children: React.ReactNode }) {
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
    if ((event.target as Element).closest('button:not([data-tap-through]), a, input, summary, [role="button"]')) { last.current = null; return; }
    const tap = { x: event.clientX, y: event.clientY, at: Date.now() };
    const previous = last.current;
    if (previous && tap.at - previous.at < TAP_GAP && Math.hypot(tap.x - previous.x, tap.y - previous.y) < TAP_SLOP * 2) {
      last.current = null;
      if (!readBookmarks().some(item => item.id === id || aliases.includes(item.id))) toggleBookmark(href ? { id, text, href } : bookmarkOf(id, text));
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
export function CardActions({ id, text, href, aliases = [], details, compareHref }: { id: string; text: string; href?: string; aliases?: string[]; details?: React.ReactNode; compareHref?: string }) {
  const ar = useLanguage().language === 'ar';
  const saved = useBookmarks().some(item => item.id === id || aliases.includes(item.id));
  const label = saved ? (ar ? 'إزالة من المحفوظة' : 'Remove from saved') : (ar ? 'حفظ' : 'Save');
  const save = () => toggleBookmark(bookmarkOf(id, text, href), aliases);
  // In the growth studio its controls take the row; save and share come back when it closes.
  const studio = useGrowth().studio;
  const videoLabel = ar ? 'مشاركة كفيديو' : 'Share as video';
  const compareLabel = ar ? 'في المقارنة' : 'Also in compare';
  return <div className="flex flex-col gap-1">
    <GrowProgress />
    <div className="flex flex-wrap items-center gap-1">
    {!studio && <>
      <span className="flex-1" />
      {compareHref && <Button size="lg" variant="muted" href={compareHref} aria-label={compareLabel} title={compareLabel}><ArrowLeftRight aria-hidden /></Button>}
      <ShareButton video href={href} />
      <Button size="lg" variant="muted" aria-pressed={saved} onClick={save} aria-label={label} title={label} className={saved ? 'text-[var(--home-accent)]' : undefined}>
        {saved ? <BookmarkCheck aria-hidden /> : <Bookmark aria-hidden />}
      </Button>
    </>}
    <GrowControls share={studio && canRecord() && <Button data-share-tree size="lg" variant="muted" onClick={openVideo} aria-label={videoLabel} title={videoLabel}><Send aria-hidden /></Button>} />
    </div>
    {details}
    <GrowVideo />
  </div>;
}

/** Shares the page's address, which holds the tree, the view and the filters: the phone's share sheet, or a copied link. */
export function ShareButton({ video = false, href }: { video?: boolean; href?: string }) {
  const ar = useLanguage().language === 'ar';
  const [copied, setCopied] = useState(false);
  const [menu, setMenu] = useState(false);
  const growing = useGrowth().total > 0;
  const holder = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menu) return;
    const away = (event: Event) => { if (!holder.current?.contains(event.target as Node)) setMenu(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenu(false); };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', escape); };
  }, [menu]);
  const label = copied ? (ar ? 'نُسخ الرابط' : 'Link copied') : (ar ? 'مشاركة' : 'Share');
  const share = async () => {
    const url = href ? new URL(href, window.location.origin).href : window.location.href;
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
  const button = (onClick: () => void) => <Button data-share-tree={video || undefined} size="lg" variant="muted" onClick={onClick} aria-label={label} title={label} aria-expanded={video && growing ? menu : undefined}>
    {copied ? <Check aria-hidden /> : <Send aria-hidden />}
  </Button>;
  // A tree can also go out as a video of it growing: the button then asks which.
  if (!video || !growing || !canRecord()) return button(() => void share());
  const item = 'flex w-full items-center gap-3 whitespace-nowrap px-4 py-3 text-start text-sm hover:bg-[var(--home-paper-deep)]';
  return <div ref={holder} className="relative">
    {button(() => setMenu(open => !open))}
    {menu && <div className="absolute bottom-full end-0 z-30 mb-2 overflow-hidden rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] shadow-lg">
      <button type="button" className={item} onClick={() => { setMenu(false); void share(); }}><Link2 size={18} aria-hidden />{ar ? 'مشاركة الرابط' : 'Share link'}</button>
      <button type="button" className={item} onClick={() => { setMenu(false); openVideo(); }}><Clapperboard size={18} aria-hidden />{ar ? 'مشاركة كفيديو' : 'Share as video'}</button>
    </div>}
  </div>;
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

export function NoTrees({ query, grouped = false }: { query: string; grouped?: boolean }) {
  const ar = useLanguage().language === 'ar';
  return <p role="status" className="text-sm text-[var(--home-muted)]">{grouped ? (ar ? 'لا مواضع متشابهة تطابق التصفية.' : 'No parallel passages match these filters.') : query
    ? (ar ? `لا شجرة تطابق «${query}».` : `No tree matches «${query}».`)
    : (ar ? 'لا شجرة في هذا النطاق.' : 'No tree in this range.')}</p>;
}
