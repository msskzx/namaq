'use client';

import React, { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowDown01, ArrowDownWideNarrow, ArrowLeftRight, Bookmark, BookmarkCheck, BookOpen, Check, ChevronDown, CircleHelp, Clapperboard, Pause, Play, RotateCcw, Search, Send, X } from 'lucide-react';
import Button from '@/components/common/Button';
import Segmented from '@/components/common/Segmented';
import Toggle from '@/components/common/Toggle';
import TreeIcon from '@/components/common/TreeIcon';
import { NavActions } from '@/components/common/NavBar';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language/LanguageContext';
import PageSpread, { type SpreadAyah, type SpreadPage } from '@/components/quran/PageSpread';
import { readBookmarks, serverBookmarks, subscribeBookmarks, toggleBookmark } from '@/lib/bookmarks';
import { pageInScope, scopeParam, SCOPE_MAX, type CompareScope, type SurahSpans } from '@/lib/quran/compareScope';
import { isRangeUnit, ScopeFields, scopeRange, type ScopeDraft } from '@/components/quran/ScopeFilter';
import { compareAnchor, compareBookmarkId, savedAs, savedSurahPairs } from '@/lib/compareBookmarks';
import { num } from '@/lib/quran/arabicNumber';
import { branchesHref } from '@/lib/quran/branches';
import { curatedComparisons, curatedFor, surahPairHref } from '@/lib/quran/curatedComparisons';
import type { SurahPair } from '@/lib/quran/mutashabih/pairs';
import { normalizeWord, plainName } from '@/lib/quran/normalize';
import { matchesSurah } from '@/lib/quran/surahSearch';
import { DoubleTapSave } from '../branches/Filters';
import { FIELD, NOTE } from '../panel';
import ReviewButtons, { CardReview } from './ReviewButtons';
import type { CardSide, ManyOption, PairCard, ReviewState } from './pairCards';
import ReadVideo, { canRecord } from './ReadVideo';
import { ayahStarts, READ_SPEEDS, setReadSpeed, useReadAlong, type ReadStep } from './readAlong';

export type SurahName = { ar: string; en?: string };
type Names = Record<number, SurahName>;

const SORT_KEY = 'compare-pairs-sort';
const readSort = () => { try { return localStorage.getItem(SORT_KEY) === 'count'; } catch { return false; } };
const writeSort = (count: boolean) => { try { localStorage.setItem(SORT_KEY, count ? 'count' : 'mushaf'); } catch {} };

function useNames(names: Names, ar: boolean) {
  const plain = (n: number) => (ar ? plainName(names[n]?.ar ?? '') : names[n]?.en ?? String(n));
  // Names from the database already start with «سُورَةُ»; say it once either way.
  const surah = (n: number) => { const name = names[n]?.ar ?? ''; return plainName(name).startsWith('سورة ') ? name : `سُورَةُ ${name}`; };
  const title = (a: number, b: number) => ar ? `${surah(a)} وَ${surah(b)}` : `${plain(a)} and ${plain(b)}`;
  return { plain, title };
}

/** The surah pairs: hand-picked stories first, then every pair the engine links, in mushaf order or by how many ayat they share. */
/** In review, a check marks a surah pair whose verdicts the owner all checked; a question mark, one with a question for the owner. */
function StateMark({ state, ar }: { state?: ReviewState; ar: boolean }) {
  if (state === 'checked') return <Check size={16} role="img" aria-label={ar ? 'راجعتها' : 'Reviewed'} className="shrink-0 text-[var(--home-green)]" />;
  if (state === 'dropped') return <span title={ar ? 'حُذفت' : 'Dropped'} className="shrink-0"><X size={16} role="img" aria-label={ar ? 'حُذفت' : 'Dropped'} className="text-[var(--home-accent)]" /></span>;
  if (state === 'ask') return <CircleHelp size={16} role="img" aria-label={ar ? 'فيها سؤال لك' : 'Has a question for you'} className="shrink-0 text-[var(--home-accent)]" />;
  return null;
}

const useBookmarks = () => useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);

function SavedOnly({ checked, onChange, saved }: { checked: boolean; onChange: (checked: boolean) => void; saved: number }) {
  const ar = useLanguage().language === 'ar';
  const id = useId();
  const label = ar ? 'المحفوظة فقط' : 'Saved only';
  const hint = !checked && saved === 0 ? (ar ? 'احفظ بطاقة بزر الحفظ تحتها أولًا' : 'Save a card with the bookmark under it first') : label;
  return <span title={hint} className="inline-flex items-center gap-2 px-1 text-sm"><Toggle id={id} checked={checked} label={label} disabled={!checked && saved === 0} onIcon={<Bookmark className="size-3" aria-hidden />} onChange={onChange} /><label htmlFor={id}>{label}</label></span>;
}

const draftOf = (scope?: CompareScope): ScopeDraft => {
  if (!scope) return { unit: 'juz', values: ['1', '30'] };
  if ('list' in scope) return { unit: scope.unit, values: ['1', '30'], [scope.unit === 'surahs' ? 'surahs' : 'juz']: scope.list.join(',') };
  return { unit: scope.unit, values: [String(scope.from), String(scope.to)] };
};

function scopeOf(draft: ScopeDraft): CompareScope | undefined {
  if (isRangeUnit(draft.unit)) {
    const range = scopeRange(draft.unit, draft.values);
    const unit = draft.unit as 'juz' | 'surah' | 'page';
    return range && (range.from !== 1 || range.to !== SCOPE_MAX[unit]) ? { unit, ...range } : undefined;
  }
  const unit = draft.unit as 'surahs' | 'juzs';
  const list = ((unit === 'surahs' ? draft.surahs : draft.juz) ?? '').split(',').filter(Boolean).map(Number);
  return list.length ? { unit, list } : undefined;
}

/** The phrase trees' filter fields, narrowing the surah pairs in the list. */
function CompareFilter({ a, b, review, todo, scope, names, savedOnly, onSavedOnly, children }: { a: number; b: number; review: boolean; todo: boolean; scope?: CompareScope; names: Names; savedOnly: boolean; onSavedOnly?: (checked: boolean) => void; children: React.ReactNode }) {
  const ar = useLanguage().language === 'ar';
  const router = useRouter();
  const [draft, setDraft] = useState(() => draftOf(scope));
  useEffect(() => setDraft(draftOf(scope)), [scope]);
  const invalid = isRangeUnit(draft.unit) && !scopeRange(draft.unit, draft.values);
  const allSurahs = Object.entries(names).map(([number, name]) => ({ number: Number(number), name: plainName(name.ar), nameEn: name.en }));
  const clear = () => { onSavedOnly?.(false); setDraft(draftOf()); router.push(pairHref(a, b, review)); };
  const apply = ar ? 'تطبيق' : 'Apply';
  const reset = ar ? 'إعادة ضبط' : 'Reset';
  return <form aria-label={ar ? 'تصفية' : 'Filter'} className="flex flex-col gap-2" onSubmit={event => { event.preventDefault(); if (!invalid) router.push(pairHref(a, b, review, todo, scopeOf(draft))); }}>
    <ScopeFields draft={draft} onChange={setDraft} range={scope?.unit === 'juz' ? scope : null} allSurahs={allSurahs} />
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">{children}</div>
    <div className="flex gap-2">
      <Button type="submit" size="sm" variant="primary" className="flex-1" disabled={invalid}><Check size={16} aria-hidden />{apply}</Button>
      {(scope || todo || savedOnly) && <Button size="sm" variant="neutral" onClick={clear}><RotateCcw size={16} aria-hidden />{reset}</Button>}
    </div>
  </form>;
}

function TodoOnly({ a, b, todo, juz }: { a: number; b: number; todo: boolean; juz?: CompareScope }) {
  const ar = useLanguage().language === 'ar';
  const router = useRouter();
  const id = useId();
  const label = ar ? 'غير المراجَعة فقط' : 'Unreviewed only';
  return <span title={label} className="inline-flex items-center gap-2 px-1 text-sm"><Toggle id={id} checked={todo} label={label} onIcon={<CircleHelp className="size-3" aria-hidden />} onChange={checked => router.push(pairHref(a, b, true, checked, juz))} /><label htmlFor={id}>{label}</label></span>;
}

const unreviewed = (states: Record<string, ReviewState>, pair: { a: number; b: number }) => {
  const state = states[`${pair.a}:${pair.b}`];
  return state !== 'checked' && state !== 'dropped';
};

function PairList({ pairs: listed, names, a, b, autoFocus = false, onPick, review = false, states = {}, savedOnly = false, onSavedOnly, todo = false, juz }: { pairs: SurahPair[]; names: Names; a: number; b: number; autoFocus?: boolean; onPick?: () => void; review?: boolean; states?: Record<string, ReviewState>; savedOnly?: boolean; onSavedOnly?: (checked: boolean) => void; todo?: boolean; juz?: CompareScope }) {
  const ar = useLanguage().language === 'ar';
  const saved = savedSurahPairs(useBookmarks());
  const pairs = (savedOnly ? listed.filter(pair => saved.has(`${pair.a}:${pair.b}`)) : listed).filter(pair => !todo || unreviewed(states, pair));
  const { plain } = useNames(names, ar);
  const [byCount, setByCount] = useState(false);
  const [query, setQuery] = useState('');
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => setByCount(readSort()), []);
  useEffect(() => {
    const box = list.current;
    const row = box?.querySelector<HTMLElement>('[data-all] [aria-current="page"]');
    if (box && row && !query) box.scrollTop = row.offsetTop - box.offsetTop - box.clientHeight / 3;
  }, [a, b, byCount, query]);
  const count = new Map(pairs.map(pair => [`${pair.a}:${pair.b}`, pair.count]));
  const terms = query.trim().split(/\s+/).filter(Boolean);
  const story = (pair: { a: number; b: number }) => curatedFor(pair.a, pair.b);
  const matches = (pair: { a: number; b: number }) => terms.every(term =>
    [pair.a, pair.b].some(n => matchesSurah({ number: n, name: names[n]?.ar ?? '', nameTransliterated: names[n]?.en }, term))
    || normalizeWord(`${story(pair)?.name.ar ?? ''} ${story(pair)?.name.en ?? ''}`.toLowerCase()).includes(normalizeWord(term.toLowerCase())));
  const inList = new Set(listed.map(pair => `${pair.a}:${pair.b}`));
  const stories = savedOnly ? [] : curatedComparisons.filter(pair => matches(pair) && inList.has(`${pair.a}:${pair.b}`) && (!todo || unreviewed(states, pair)));
  const all = (byCount ? [...pairs].sort((p, q) => q.count - p.count || p.a - q.a || p.b - q.b) : pairs).filter(matches);
  const sides = (pair: { a: number; b: number }) => `${plain(pair.a)} · ${plain(pair.b)}`;
  // In mushaf order without a search, pairs sit under each of their two surahs, collapsed except the current surah's.
  const grouped = !byCount && !terms.length;
  const [open, setOpen] = useState(() => new Set([a]));
  useEffect(() => setOpen(current => (current.has(a) ? current : new Set([...current, a]))), [a]);
  const groups = new Map<number, SurahPair[]>();
  if (grouped) for (const pair of pairs) for (const n of [pair.a, pair.b]) groups.set(n, [...(groups.get(n) ?? []), pair]);
  const surahs = [...groups.keys()].sort((x, y) => x - y);
  const other = (pair: SurahPair, n: number) => (pair.a === n ? pair.b : pair.a);
  const row = (pair: { a: number; b: number }, label: React.ReactNode) => (
    <li key={`${pair.a}:${pair.b}`}>
      <Link href={pairHref(pair.a, pair.b, review, todo, juz)} scroll onClick={onPick} aria-current={pair.a === a && pair.b === b ? 'page' : undefined}
        className="flex items-center gap-3 rounded-md border-s-2 border-transparent px-3 py-2 hover:bg-[var(--home-paper-deep)] focus-visible:outline-2 focus-visible:outline-[var(--home-accent)] aria-[current=page]:border-[var(--home-accent)] aria-[current=page]:bg-[var(--home-paper-deep)]">
        <span className="min-w-0 flex-1">{label}</span>
        {review && <StateMark state={states[`${pair.a}:${pair.b}`]} ar={ar} />}
        <span className="text-sm tabular-nums text-[var(--home-accent)]">{ar ? num(count.get(`${pair.a}:${pair.b}`) ?? 0) : count.get(`${pair.a}:${pair.b}`) ?? 0}</span>
      </Link>
    </li>
  );
  const heading = 'px-3 pb-1 pt-3 text-sm text-[var(--home-muted)]';
  const search = ar ? 'ابحث عن سورة: الطور، ٥٢…' : 'Search a surah: At-Tur, 52…';
  return (
    <div className="flex min-h-0 flex-col gap-2">
      <label className="relative">
        <Search size={16} aria-hidden className="pointer-events-none absolute start-2.5 top-1/2 -translate-y-1/2 text-[var(--home-muted)]" />
        <input type="search" autoFocus={autoFocus} aria-label={ar ? 'ابحث عن سورة' : 'Search a surah'} placeholder={search} value={query} onChange={event => setQuery(event.target.value)}
          className={`${FIELD} w-full ps-8 text-base`} />
      </label>
      <CompareFilter a={a} b={b} review={review} todo={todo} scope={juz} names={names} savedOnly={savedOnly} onSavedOnly={onSavedOnly}>
        {onSavedOnly && <SavedOnly checked={savedOnly} onChange={onSavedOnly} saved={saved.size} />}
        {review && <TodoOnly a={a} b={b} todo={todo} juz={juz} />}
      </CompareFilter>
      <Segmented label={ar ? 'ترتيب القائمة' : 'Sort the list'} className="w-full [&>*]:flex-1" options={[
        { key: 'mushaf', label: ar ? 'ترتيب المصحف' : 'Mushaf order', icon: <ArrowDown01 size={16} aria-hidden />, current: !byCount, onClick: () => { setByCount(false); writeSort(false); } },
        { key: 'count', label: ar ? 'الأكثر تشابهًا' : 'Most similar', icon: <ArrowDownWideNarrow size={16} aria-hidden />, current: byCount, onClick: () => { setByCount(true); writeSort(true); } },
      ]} />
      <div ref={list} className="min-h-0 flex-1 overflow-y-auto">
        {stories.length > 0 && <>
          <h3 className={heading}>{ar ? 'مختارة' : 'Selected stories'}</h3>
          <ul>{stories.map(pair => row(pair, <><span className="block">{ar ? pair.name.voweled : pair.name.en}</span><span className="block text-xs text-[var(--home-muted)]">{sides(pair)}</span></>))}</ul>
        </>}
        <h3 className={heading}>{ar ? 'كل السور المتشابهة' : 'All similar surahs'}</h3>
        {(todo || juz) && !savedOnly && pairs.length === 0 ? <p role="status" className={`${NOTE} px-3`}>{todo ? (ar ? 'راجعت كل الصفحات هنا.' : 'Every page here is reviewed.') : ar ? 'لا صفحات بهذه التصفية.' : 'No pages match this filter.'}</p> : grouped ? <ul data-all>{surahs.map(n => (
          <li key={n}>
            <details open={open.has(n)} onToggle={event => {
              const shown = (event.currentTarget as HTMLDetailsElement).open;
              setOpen(current => (shown === current.has(n) ? current : new Set(shown ? [...current, n] : [...current].filter(x => x !== n))));
            }}>
              <summary className="flex cursor-pointer list-none items-center gap-3 rounded-md px-3 py-2 hover:bg-[var(--home-paper-deep)] focus-visible:outline-2 focus-visible:outline-[var(--home-accent)] [&::-webkit-details-marker]:hidden">
                <ChevronDown size={16} aria-hidden className={`shrink-0 text-[var(--home-muted)] transition-transform ${open.has(n) ? '' : 'ltr:-rotate-90 rtl:rotate-90'}`} />
                <span className={`min-w-0 flex-1 ${n === a || n === b ? 'text-[var(--home-accent)]' : ''}`}>{plain(n)}</span>
                {review && <StateMark state={groups.get(n)!.some(pair => states[`${pair.a}:${pair.b}`] === 'ask') ? 'ask'
                  : groups.get(n)!.every(pair => states[`${pair.a}:${pair.b}`] === 'dropped') ? 'dropped'
                  : groups.get(n)!.every(pair => ['checked', 'dropped'].includes(states[`${pair.a}:${pair.b}`])) ? 'checked' : undefined} ar={ar} />}
                <span className="text-xs tabular-nums text-[var(--home-muted)]">{ar ? num(groups.get(n)!.length) : groups.get(n)!.length}</span>
              </summary>
              <ul className="ms-5 border-s border-[var(--home-rule)]">{groups.get(n)!.map(pair => row(pair, plain(other(pair, n))))}</ul>
            </details>
          </li>
        ))}</ul>
          : all.length ? <ul data-all>{all.map(pair => row(pair, sides(pair)))}</ul>
          : <p role="status" className={`${NOTE} px-3`}>{ar ? 'لا سورة بهذا البحث.' : 'No surah matches this search.'}</p>}
      </div>
    </div>
  );
}

/** Review mode (verdicts on the cards) stays on while moving between pairs. */
const pairHref = (a: number, b: number, review: boolean, todo = false, scope?: CompareScope) => `${surahPairHref(a, b)}${review ? '&review=1' : ''}${review && todo ? '&todo=1' : ''}${scopeParam(scope)}`;

const ICON = 'flex size-8 items-center justify-center rounded-full text-[var(--home-muted)] hover:text-[var(--home-accent)] focus-visible:outline-2 focus-visible:outline-[var(--home-accent)]';

/** `reading` is the read-along's word when it is on this side. */
const lightMarks = (lit: string | null, reading?: ReadStep) => (ayah: SpreadAyah): SpreadAyah => ({
  ...ayah,
  marks: Object.fromEntries(Object.entries(ayah.marks ?? {}).map(([index, mark]) => [index, { ...mark, lit: !!lit && mark.link === lit }])),
  ...(reading && reading.ayah === ayah.number ? { reading: reading.word } : {}),
});

function sidePage(side: CardSide, names: Names, ar: boolean, lit: string | null, extra?: React.ReactNode, partners?: Pick<SpreadPage, 'pick' | 'footer'> & { numbers: number[]; ayat: SpreadAyah[][] }, reading?: ReadStep): SpreadPage {
  const name = ar ? plainName(names[side.surah]?.ar ?? '') : names[side.surah]?.en ?? String(side.surah);
  const read = ar ? `اقرأ ${name} ${num(side.ayah)} في المصحف` : `Read ${name} ${side.ayah} in the mushaf`;
  const show = (n: number) => (ar ? num(n) : n);
  const last = side.ayat[side.ayat.length - 1]?.number ?? side.ayah;
  return {
    title: partners ? `${name} ${partners.numbers.map(show).join(' · ')}`.trim() : `${name} ${show(side.ayah)}${last > side.ayah ? `–${show(last)}` : ''}`,
    action: <span className="flex">
      {extra}
      <Link href={`/quran/read/ayah/${side.surah}/${side.ayah}`} aria-label={read} title={read} className={ICON}>
        <BookOpen size={16} aria-hidden />
      </Link>
    </span>,
    rows: partners?.ayat ?? [side.ayat.map(lightMarks(lit, reading))],
    ...(partners ? { pick: partners.pick, footer: partners.footer } : {}),
  };
}

/** One similar ayah pair. Tapping a coloured word lights the word it matches on the other side. */
const anchorOf = (card: PairCard) => compareAnchor(card.sides[0], card.sides[1]);

function Card({ card, names, ar, savedIds, review }: { card: PairCard; names: Names; ar: boolean; savedIds: string[]; review?: { a: number; b: number } }) {
  const [tapped, setLit] = useState<string | null>(null);
  const read = useReadAlong(card);
  const step = read.step;
  // While reading, the word read lights its partner; a tap lights one otherwise.
  const lit = step ? step.link ?? null : tapped;
  const id = compareBookmarkId(card.id);
  const anchor = anchorOf(card);
  const saved = savedIds.length > 0;
  const verdicts = card.pairs?.flatMap(pair => (pair.verdict ? [{ id: pair.id, verdict: pair.verdict }] : [])) ?? (card.verdict ? [{ id: card.id, verdict: card.verdict }] : []);
  const [a, b] = card.sides;
  const bookmark = { id, text: `${a.ayat[0]?.words.slice(0, 6).join(' ') ?? ''} …`, href: `${surahPairHref(a.surah, b.surah)}#${anchor}` };
  const saveLabel = saved ? (ar ? 'إزالة من المحفوظة' : 'Remove from saved') : (ar ? 'حفظ' : 'Save');
  const pick = (target: EventTarget) => {
    const id = (target as HTMLElement).closest?.('mark[data-link]')?.getAttribute('data-link');
    if (id) setLit(current => (current === id ? null : id));
  };
  const family = ar ? 'افتح في متشابهات القرآن' : 'Open in the phrase trees';
  const studioLabel = ar ? 'استوديو القراءة' : 'Read-along studio';
  const [picked, setSelected] = useState(0);
  const selected = step?.option ?? picked;
  const option = card.many?.options[selected];
  const shownSides = card.sides.map((side, i) => !option ? side : i === card.many!.side ? { ...side, ayah: option.ayah.number, ayat: [option.ayah] } : { ...side, ayat: [option.shared] });
  const partners = (side: CardSide) => {
    const name = ar ? plainName(names[side.surah]?.ar ?? '') : names[side.surah]?.en ?? String(side.surah);
    const options = card.many!.options;
    const text = (item: ManyOption) => item.ayah.words.map(normalizeWord).join(' ');
    // The same words every time (a refrain): one ayah and the list of where it recurs says it all.
    if (options.every(item => text(item) === text(options[0]))) return {
      numbers: [],
      ayat: [[lightMarks(lit, step?.side === card.many!.side ? step : undefined)(options[0].ayah)]],
      footer: <p className="mt-1 text-center text-sm text-[var(--home-muted)]">{name} {options.map((item, i) => <React.Fragment key={item.id}>{i > 0 && ' · '}<Link href={`/quran/read/ayah/${side.surah}/${item.ayah.number}`} className="underline-offset-2 hover:text-[var(--home-accent)] hover:underline">{ar ? num(item.ayah.number) : item.ayah.number}</Link></React.Fragment>)}</p>,
    };
    return {
      numbers: options.map(item => item.ayah.number),
      ayat: options.map((item, i) => [i === selected ? lightMarks(lit, step?.side === card.many!.side ? step : undefined)(item.ayah) : { ...item.ayah, marks: undefined }]),
      pick: { selected, labels: options.map(item => `${name} ${ar ? num(item.ayah.number) : item.ayah.number}`), onPick: (row: number) => { if (step) return; if (row !== selected) { setSelected(row); setLit(null); } } },
    };
  };
  return (
    <li id={anchor} className={`scroll-mt-20 ${card.verdict?.keep === false && !card.verdict.ask ? 'opacity-60' : ''}`}>
      <DoubleTapSave id={id} text={bookmark.text} href={bookmark.href} aliases={savedIds}>
        <div onClick={event => pick(event.target)}>
          <PageSpread compact stackOnMobile pages={shownSides.map((side, i) => sidePage(side, names, ar, lit, i === 0 && card.group ? (
            <Link href={branchesHref(card.group)} aria-label={family} title={family} className={ICON}><TreeIcon size={16} aria-hidden /></Link>
          ) : undefined, card.many?.side === i ? partners(side) : undefined, step?.side === i ? step : undefined))} />
        </div>
      </DoubleTapSave>
      {read.studio ? <ReadStudio read={read} ar={ar} card={card} names={names} /> : <div className="flex justify-end">
        {review && <CardReview a={review.a} b={review.b} card={card} />}
        <Button size="icon" variant="muted" onClick={read.open} aria-label={studioLabel} title={studioLabel}><Clapperboard size={18} aria-hidden /></Button>
        <Button size="icon" variant="muted" aria-pressed={saved} onClick={() => toggleBookmark(bookmark, savedIds)} aria-label={saveLabel} title={saveLabel} className={saved ? 'text-[var(--home-accent)]' : undefined}>
          {saved ? <BookmarkCheck size={18} aria-hidden /> : <Bookmark size={18} aria-hidden />}
        </Button>
      </div>}
      {verdicts.map(({ id: pair, verdict }) => <div key={pair} dir="ltr" className="mt-1 text-sm">
        {verdict.ask && <p data-ask className="mb-1 rounded-md border border-[var(--home-accent)] bg-[var(--home-paper-deep)] px-2 py-1 font-semibold text-[var(--home-accent)]">? Needs your feedback: {verdict.ask}</p>}
        <p className={verdict.keep ? 'text-[var(--home-green)]' : 'text-[var(--home-accent)]'}>
          {verdict.keep ? '✓ Kept' : '✗ Left out'} · {pair.replace('|', ' ~ ')} · {verdict.why}
          <span className="text-[var(--home-muted)]"> · {verdict.checked ? 'checked by you' : 'drafted by Claude'}</span>
        </p>
      </div>)}
    </li>
  );
}

/** In place of save under a card: close, a bar per ayah read (a tap reads from there), speed, play or pause, and reset. */
function ReadStudio({ read, ar, card, names }: { read: ReturnType<typeof useReadAlong>; ar: boolean; card: PairCard; names: Names }) {
  const [video, setVideo] = useState(false);
  const { plain, title } = useNames(names, ar);
  const sideLabel = (side: CardSide) => {
    const last = side.ayat[side.ayat.length - 1]?.number ?? side.ayah;
    const show = (n: number) => (ar ? num(n) : n);
    return `${plain(side.surah)} ${show(side.ayah)}${last > side.ayah ? `–${show(last)}` : ''}`;
  };
  const videoLabel = ar ? 'مشاركة كفيديو' : 'Share as video';
  const starts = ayahStarts(read.plan);
  const playing = read.status === 'playing';
  const active = playing || read.status === 'paused';
  const reached = read.status === 'done' ? starts.length : active ? starts.filter(start => start <= read.at).length : 0;
  const label = playing ? (ar ? 'إيقاف مؤقت' : 'Pause') : read.status === 'paused' ? (ar ? 'متابعة' : 'Resume') : read.status === 'done' ? (ar ? 'إعادة' : 'Replay') : (ar ? 'اقرأ مع التظليل' : 'Read along');
  const close = ar ? 'إغلاق الاستوديو' : 'Close the studio';
  const resetLabel = ar ? 'إعادة ضبط' : 'Reset';
  const next = READ_SPEEDS[(READ_SPEEDS.indexOf(read.speed) + 1) % READ_SPEEDS.length];
  return <div className="flex flex-col gap-1">
    {starts.length > 1 && <div role="group" aria-label={ar ? 'تقدّم القراءة' : 'Reading progress'} className="flex gap-1">
      {starts.map((start, i) => {
        const from = ar ? `من الآية ${num(i + 1)}` : `From ayah ${i + 1}`;
        return <button key={start} type="button" onClick={() => read.play(start)} aria-label={from} title={from} aria-current={(active && i === reached - 1) || undefined} className="group flex h-6 flex-1 items-center">
          <span className={`block h-1 w-full rounded-full transition-colors ${i < reached ? 'bg-[var(--home-green)]' : 'bg-[var(--home-rule)] group-hover:bg-[var(--home-muted)]'}`} />
        </button>;
      })}
    </div>}
    <div className="flex items-center">
      <Button size="icon" variant="muted" onClick={read.close} aria-label={close} title={close}><X size={18} aria-hidden /></Button>
      <span className="flex-1" />
      <Button size="sm" variant="muted" className="min-w-9 tabular-nums" onClick={() => setReadSpeed(next)} aria-label={`${ar ? 'السرعة' : 'Speed'} ${read.speed}×`} title={ar ? 'السرعة' : 'Speed'}><span dir="ltr">{read.speed}×</span></Button>
      {canRecord() && <Button size="icon" variant="muted" onClick={() => { read.reset(); setVideo(true); }} aria-label={videoLabel} title={videoLabel}><Send size={18} aria-hidden /></Button>}
      <Button size="icon" variant="muted" onClick={() => (playing ? read.pause() : read.play())} aria-label={label} title={label} className={active ? 'text-[var(--home-accent)]' : undefined}>
        {playing ? <Pause size={18} aria-hidden /> : <Play size={18} aria-hidden />}
      </Button>
      <Button size="icon" variant="muted" onClick={read.reset} aria-label={resetLabel} title={resetLabel}><RotateCcw size={18} aria-hidden /></Button>
    </div>
    {video && <ReadVideo card={card} plan={read.plan} speed={read.speed} title={title(card.sides[0].surah, card.sides[1].surah)} label={sideLabel} ar={ar} onClose={() => setVideo(false)} />}
  </div>;
}

export default function PairCompare({ a, b, cards, pairs: allPairs, names, review = false, states, editable = false, todo = false, scope: juz, spans = { juz: {}, page: {} } }: { a: number; b: number; cards: PairCard[]; pairs: SurahPair[]; names: Names; review?: boolean; states?: Record<string, ReviewState>; editable?: boolean; todo?: boolean; scope?: CompareScope; spans?: SurahSpans }) {
  const pairs = juz ? allPairs.filter(pair => pageInScope(pair, spans, juz)) : allPairs;
  const ar = useLanguage().language === 'ar';
  const { title } = useNames(names, ar);
  const sheet = useRef<HTMLDialogElement>(null);
  const pane = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const bookmarks = useBookmarks();
  const shown = savedOnly ? cards.filter(card => savedAs(card.id, bookmarks).length > 0) : cards;
  // A saved link names the card's first ayat when it was saved; verdicts or merging may have moved that ayah inside another card.
  useEffect(() => {
    const [surahA, ayahA, surahB, ayahB] = window.location.hash.match(/^#c-(\d+)-(\d+)-(\d+)-(\d+)$/)?.slice(1).map(Number) ?? [];
    if (!surahA || document.getElementById(window.location.hash.slice(1))) return;
    const holds = (side: CardSide, surah: number, ayah: number) => side.surah === surah && side.ayat.some(item => item.number === ayah);
    const found = cards.find(card => card.pairs?.some(pair => pair.id === `${surahA}:${ayahA}|${surahB}:${ayahB}`) || (holds(card.sides[0], surahA, ayahA) && holds(card.sides[1], surahB, ayahB)))
      ?? cards.find(card => card.many && (card.many.side === 1 ? holds(card.sides[0], surahA, ayahA) : holds(card.sides[1], surahB, ayahB)));
    if (found) document.getElementById(anchorOf(found))?.scrollIntoView?.();
  }, [cards]);
  const label = ar ? 'اختر سورتين' : 'Choose two surahs';
  const story = curatedFor(a, b);
  const index = pairs.findIndex(pair => pair.a === a && pair.b === b);
  const after = index >= 0 ? pairs[index + 1] : undefined;
  const nextTodo = states && [...pairs.slice(index + 1), ...pairs.slice(0, Math.max(index, 0))].find(pair => unreviewed(states, pair));
  const next = todo ? nextTodo : after;
  const choose = () => {
    if (window.matchMedia?.('(min-width: 1024px)').matches) pane.current?.querySelector('input')?.focus();
    else { sheet.current?.showModal(); setOpen(true); }
  };
  const close = () => sheet.current?.close();
  useEffect(() => {
    const wide = window.matchMedia?.('(min-width: 1024px)');
    const change = () => { if (wide?.matches) sheet.current?.close(); };
    wide?.addEventListener?.('change', change);
    return () => wide?.removeEventListener?.('change', change);
  }, []);
  return (
    <div dir={ar ? 'rtl' : 'ltr'} className="mx-auto w-full max-w-7xl p-4 text-[var(--home-ink)]">
      <NavActions>
        <span className="flex min-w-0 max-w-[calc(100%-8rem)] justify-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2">
          <Button variant="neutral" onClick={choose} aria-expanded={open} aria-label={`${label}: ${title(a, b)}`} className="min-w-0 max-w-full">
            <ArrowLeftRight size={16} aria-hidden className="shrink-0" />
            <span className="truncate">{title(a, b)}</span>
            <span className="shrink-0 text-sm tabular-nums text-[var(--home-accent)]">{ar ? num(cards.length) : cards.length}</span>
            <ChevronDown size={14} aria-hidden className="shrink-0" />
          </Button>
        </span>
      </NavActions>
      <h1 className="sr-only">{story ? `${title(a, b)} - ${ar ? story.name.voweled : story.name.en}` : title(a, b)}</h1>
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          {editable && <ReviewButtons a={a} b={b} cards={cards} nextHref={nextTodo && pairHref(nextTodo.a, nextTodo.b, true, todo, juz)} />}
          {shown.length === 0 ? <p role="status" className={NOTE}>{savedOnly ? (ar ? 'لا بطاقات محفوظة بين السورتين.' : 'No saved cards between these surahs.') : ar ? 'لا آيات متشابهة بين السورتين. اختر سورتين من القائمة.' : 'No similar ayat between these surahs. Choose two surahs from the list.'}</p>
            : <ol className="flex flex-col gap-4">{shown.map(card => <Card key={card.id} card={card} names={names} ar={ar} savedIds={savedAs(card.id, bookmarks)} review={editable ? { a, b } : undefined} />)}</ol>}
          {next && <Link href={pairHref(next.a, next.b, review, todo, juz)} className="self-center rounded-lg border border-[var(--home-rule)] px-4 py-2 text-[var(--home-accent)] hover:bg-[var(--home-paper-deep)]">
            {ar ? `التالي: ${title(next.a, next.b)}` : `Next: ${title(next.a, next.b)}`}
          </Link>}
        </div>
        <aside ref={pane} aria-label={label} className="sticky top-4 hidden max-h-[calc(100dvh-2rem)] flex-col rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] p-3 lg:flex">
          <PairList pairs={pairs} names={names} a={a} b={b} review={review} states={states} savedOnly={savedOnly} onSavedOnly={setSavedOnly} todo={todo} juz={juz} />
        </aside>
      </div>
      <dialog ref={sheet} aria-label={label} onClose={() => setOpen(false)} onClick={event => { if (event.target === sheet.current) close(); }}
        className="m-0 mt-auto max-h-[85dvh] w-full max-w-none rounded-t-2xl border-t border-[var(--home-rule)] bg-[var(--home-paper)] p-3 text-[var(--home-ink)] backdrop:bg-black/40 lg:hidden"
        dir={ar ? 'rtl' : 'ltr'}>
        <div className="flex max-h-[calc(85dvh-1.5rem)] flex-col gap-2">
          <div className="flex items-center justify-between">
            <span aria-hidden className="mx-auto h-1 w-10 rounded-full bg-[var(--home-rule)]" />
            <button type="button" onClick={close} aria-label={ar ? 'إغلاق' : 'Close'} className="flex size-9 items-center justify-center rounded-full text-[var(--home-muted)]"><X size={18} aria-hidden /></button>
          </div>
          {open && <PairList pairs={pairs} names={names} a={a} b={b} onPick={close} review={review} states={states} savedOnly={savedOnly} onSavedOnly={setSavedOnly} todo={todo} juz={juz} />}
        </div>
      </dialog>
    </div>
  );
}
