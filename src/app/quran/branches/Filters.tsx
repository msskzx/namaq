'use client';

import React, { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Bookmark, BookmarkCheck, Check, Clapperboard, Funnel, Link2, RotateCcw, Send, X } from 'lucide-react';
import { readBookmarks, serverBookmarks, subscribeBookmarks, toggleBookmark } from '@/lib/bookmarks';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { branchesHref, type BranchesView } from '@/lib/quran/branches';
import Toggle from '@/components/common/Toggle';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';
import type { JuzRange } from '@/lib/quran/juz';
import { RangeFields, rangeFromDraft, type RangeDraft } from '@/components/quran/RangeFilter';
import { num } from '@/lib/quran/arabicNumber';
import ScopePicker, { type ScopeOption } from './ScopePicker';
import GroupFilterControls from './GroupFilters';
import { hasGroupFilters, type GroupFilters } from '@/lib/quran/mutashabih/browse';
import { GrowControls, GrowProgress, useGrowth } from './Grow';
import GrowVideo, { canRecord, openVideo } from './GrowVideo';

type FilterUnit = 'juz' | 'surah' | 'page' | 'surahs' | 'juzs';
const RANGE_MAX = { juz: 30, surah: 114, page: 604 };
type FilterDraft = { unit: FilterUnit; values: RangeDraft; filters: GroupFilters; saved: boolean };

export function FilterButton({ range, view, allSurahs = [] }: { range: JuzRange | null; view: BranchesView; allSurahs?: ScopeOption[] }) {
  const ar = useLanguage().language === 'ar';
  const router = useNavigatingRouter();
  const sheet = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLSpanElement>(null);
  const panelId = useId();
  const [expanded, setExpanded] = useState(false);
  const label = ar ? 'تصفية' : 'Filter';
  const close = ar ? 'إغلاق' : 'Close';
  const initial = (): FilterDraft => {
    const filters = view.filters ?? {};
    const unit: FilterUnit = filters.surahFrom || filters.surahTo ? 'surah' : filters.pageFrom || filters.pageTo ? 'page' : filters.surahs ? 'surahs' : filters.juz ? 'juzs' : view.surah ? 'surah' : 'juz';
    const values: RangeDraft = unit === 'surah' ? [filters.surahFrom ?? String(view.surah ?? 1), filters.surahTo ?? String(view.surah ?? 114)]
      : unit === 'page' ? [filters.pageFrom ?? '1', filters.pageTo ?? '604'] : [String(range?.from ?? 1), String(range?.to ?? 30)];
    return { unit, values, filters, saved: !!view.saved?.length };
  };
  const [draft, setDraft] = useState<FilterDraft>(initial);
  const ranged = draft.unit === 'juz' || draft.unit === 'surah' || draft.unit === 'page';
  const max = ranged ? RANGE_MAX[draft.unit as keyof typeof RANGE_MAX] : 30;
  const next = rangeFromDraft(draft.values, max);
  const units: { value: FilterUnit; label: string }[] = [
    { value: 'juz', label: ar ? 'من الجزء' : 'From juz' },
    { value: 'surah', label: ar ? 'من السورة' : 'From chapter' },
    { value: 'page', label: ar ? 'من الصفحة' : 'From page' },
    { value: 'surahs', label: ar ? 'سور محددة' : 'Specific chapters' },
    { value: 'juzs', label: ar ? 'أجزاء محددة' : 'Specific juz' },
  ];
  const place = () => {
    const panel = sheet.current;
    const button = trigger.current;
    if (!panel || !button) return;
    const bounds = button.getBoundingClientRect();
    const top = bounds.bottom + 8;
    panel.style.top = `${top}px`;
    const buttonCenter = bounds.left + bounds.width / 2;
    const center = buttonCenter + (window.innerWidth / 2 - buttonCenter) / 3;
    panel.style.left = `${Math.max(8, Math.min(center - panel.offsetWidth / 2, window.innerWidth - panel.offsetWidth - 8))}px`;
    panel.style.maxHeight = `${Math.max(0, window.innerHeight - top - 8)}px`;
  };
  useEffect(() => {
    if (!expanded) return;
    const onScroll = (event: Event) => { if (!sheet.current?.contains(event.target as Node)) place(); };
    window.addEventListener('resize', place);
    window.addEventListener('scroll', onScroll, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', onScroll, true); };
  }, [expanded]);
  const closePanel = () => { sheet.current?.hidePopover(); trigger.current?.querySelector('button')?.focus(); };
  const open = () => {
    if (expanded) { closePanel(); return; }
    setDraft(initial());
    sheet.current?.showPopover();
    place();
    sheet.current?.querySelector<HTMLElement>('input:not([disabled]), select')?.focus();
  };
  const apply = (event: React.FormEvent) => {
    event.preventDefault();
    if (ranged && !next) return;
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
      saved: draft.saved ? view.saved?.length ? view.saved : readBookmarks().map(item => item.id) : undefined }), { scroll: false });
    closePanel();
  };
  const fromLabel = draft.unit === 'surah' ? (ar ? 'من السورة' : 'From chapter') : draft.unit === 'page' ? (ar ? 'من الصفحة' : 'From page') : (ar ? 'من الجزء' : 'From juz');
  const toLabel = draft.unit === 'surah' ? (ar ? 'إلى السورة' : 'To chapter') : draft.unit === 'page' ? (ar ? 'إلى الصفحة' : 'To page') : (ar ? 'إلى الجزء' : 'To juz');
  return <>
    <span ref={trigger} className="relative shrink-0">
      <Button size="lg" variant="muted" aria-haspopup="dialog" aria-expanded={expanded} aria-controls={panelId} onClick={open} aria-label={label} title={label}><Funnel aria-hidden /></Button>
      {(range || !!view.saved?.length || hasGroupFilters(view.filters ?? {}) || view.filters?.sort) && <span aria-hidden className="pointer-events-none absolute end-2 top-2 size-2 rounded-full bg-[var(--home-accent)]" />}
    </span>
    <div ref={sheet} id={panelId} popover="auto" role="dialog" aria-hidden={!expanded} aria-label={label} dir={ar ? 'rtl' : 'ltr'} onKeyDown={event => { event.stopPropagation(); if (event.key === 'Escape') { event.preventDefault(); closePanel(); } }} onToggle={event => setExpanded((event.nativeEvent as ToggleEvent).newState === 'open')}
      className="fixed m-0 w-[min(26rem,calc(100vw-1rem))] rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] p-0 text-[var(--home-ink)] shadow-lg overflow-hidden" style={{ inset: 'auto' }}>
      <form aria-label={label} onSubmit={apply} className="flex max-h-[inherit] flex-col">
        <div className="flex min-h-0 flex-col gap-3 overflow-y-auto p-4">
        <div className="flex items-center justify-between gap-3">
          <SavedOnly checked={draft.saved} onChange={saved => setDraft({ ...draft, saved })} />
          <Button size="lg" variant="muted" onClick={closePanel} aria-label={close} title={close}><X aria-hidden /></Button>
        </div>
        <div className="flex items-start gap-2">
          <select aria-label={ar ? 'التصفية حسب' : 'Filter by'} value={draft.unit} onChange={event => { const unit = event.target.value as FilterUnit; setDraft({ ...draft, unit, values: ['1', String(unit in RANGE_MAX ? RANGE_MAX[unit as keyof typeof RANGE_MAX] : 30)] }); }}
            className="h-10 max-w-[45%] shrink-0 rounded border border-[var(--home-rule)] bg-[var(--home-paper)] px-2 py-1.5 text-base">
            {units.map(unit => <option key={unit.value} value={unit.value}>{unit.label}</option>)}
          </select>
        {ranged ? <RangeFields range={draft.unit === 'juz' ? range : null} max={max} names={[`${draft.unit}From`, `${draft.unit}To`]} draft={draft.values} onChange={values => setDraft({ ...draft, values })} iconOnly arabicDigits hideFromLabel
          labels={{ from: fromLabel, to: toLabel, toText: ar ? 'إلى' : 'to', form: label, all: ar ? 'الكل' : 'All', invalid: () => ar ? `أدخل رقمين من ١ إلى ${num(max)}، على أن تكون البداية قبل النهاية أو مساوية لها.` : `Enter whole numbers from 1 to ${max}, with From no greater than To.` }} />
          : <ScopePicker key={draft.unit} name={draft.unit === 'surahs' ? (ar ? 'ابحث عن سورة' : 'Find a chapter') : (ar ? 'ابحث عن جزء' : 'Find a juz')}
            value={draft.unit === 'surahs' ? draft.filters.surahs : draft.filters.juz} onChange={value => setDraft({ ...draft, filters: { ...draft.filters, [draft.unit === 'surahs' ? 'surahs' : 'juz']: value } })}
            options={draft.unit === 'surahs' ? allSurahs : Array.from({ length: 30 }, (_, index) => ({ number: index + 1, name: ar ? `الجزء ${num(index + 1)}` : `Juz ${index + 1}` }))} />}
        </div>
        <GroupFilterControls filters={draft.filters} onChange={filters => setDraft({ ...draft, filters })} />
        </div>
        <div className="flex shrink-0 gap-2 border-t border-[var(--home-rule)] p-4">
        <Button className="flex-1" type="submit" variant="primary" disabled={ranged && !next}><Check size={16} aria-hidden />{ar ? 'تطبيق' : 'Apply'}</Button>
        <Button variant="neutral" onClick={() => setDraft({ unit: 'juz', values: ['1', '30'], filters: {}, saved: false })}><RotateCcw size={16} aria-hidden />{ar ? 'إعادة ضبط' : 'Reset'}</Button>
        </div>
      </form>
    </div>
  </>;
}

const useBookmarks = () => useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);

function SavedOnly({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  const ar = useLanguage().language === 'ar';
  const saved = useBookmarks();
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
    if ((event.target as Element).closest('button, a, input, summary, [role="button"]')) { last.current = null; return; }
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
export function CardActions({ id, text, href, aliases = [], details }: { id: string; text: string; href?: string; aliases?: string[]; details?: React.ReactNode }) {
  const ar = useLanguage().language === 'ar';
  const saved = useBookmarks().some(item => item.id === id || aliases.includes(item.id));
  const label = saved ? (ar ? 'إزالة من المحفوظة' : 'Remove from saved') : (ar ? 'حفظ' : 'Save');
  const save = () => toggleBookmark(bookmarkOf(id, text, href), aliases);
  // In the growth studio its controls take the row; save and share come back when it closes.
  const studio = useGrowth().studio;
  const videoLabel = ar ? 'مشاركة كفيديو' : 'Share as video';
  return <div className="flex flex-col gap-1">
    <GrowProgress />
    <div className="flex flex-wrap items-center gap-1">
    {!studio && <>
      <span className="flex-1" />
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
