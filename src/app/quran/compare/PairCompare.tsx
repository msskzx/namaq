'use client';

import React, { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowDown01, ArrowDownWideNarrow, ArrowLeftRight, Bookmark, BookmarkCheck, BookOpen, Check, ChevronDown, CircleHelp, Search, X } from 'lucide-react';
import Button from '@/components/common/Button';
import Segmented from '@/components/common/Segmented';
import Toggle from '@/components/common/Toggle';
import TreeIcon from '@/components/common/TreeIcon';
import { NavActions } from '@/components/common/NavBar';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language/LanguageContext';
import PageSpread, { type SpreadAyah, type SpreadPage } from '@/components/quran/PageSpread';
import { readBookmarks, serverBookmarks, subscribeBookmarks, toggleBookmark } from '@/lib/bookmarks';
import { compareAnchor, compareBookmarkId, savedAs, savedSurahPairs } from '@/lib/compareBookmarks';
import { num } from '@/lib/quran/arabicNumber';
import { branchesHref } from '@/lib/quran/branches';
import { curatedComparisons, curatedFor, surahPairHref } from '@/lib/quran/curatedComparisons';
import type { SurahPair } from '@/lib/quran/mutashabih/pairs';
import { normalizeWord, plainName } from '@/lib/quran/normalize';
import { matchesSurah } from '@/lib/quran/surahSearch';
import { DoubleTapSave } from '../branches/Filters';
import { FIELD, NOTE } from '../panel';
import ReviewButtons from './ReviewButtons';
import type { CardSide, PairCard, ReviewState } from './pairCards';

export type SurahName = { ar: string; en?: string };
type Names = Record<number, SurahName>;

const SORT_KEY = 'compare-pairs-sort';
const readSort = () => { try { return localStorage.getItem(SORT_KEY) === 'count'; } catch { return false; } };
const writeSort = (count: boolean) => { try { localStorage.setItem(SORT_KEY, count ? 'count' : 'mushaf'); } catch {} };

function useNames(names: Names, ar: boolean) {
  const plain = (n: number) => (ar ? plainName(names[n]?.ar ?? '') : names[n]?.en ?? String(n));
  const title = (a: number, b: number) => ar ? `سُورَةُ ${names[a]?.ar} وَسُورَةُ ${names[b]?.ar}` : `${plain(a)} and ${plain(b)}`;
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

function TodoOnly({ a, b, todo }: { a: number; b: number; todo: boolean }) {
  const ar = useLanguage().language === 'ar';
  const router = useRouter();
  const id = useId();
  const label = ar ? 'غير المراجَعة فقط' : 'Unreviewed only';
  return <span title={label} className="inline-flex items-center gap-2 px-1 text-sm"><Toggle id={id} checked={todo} label={label} onIcon={<CircleHelp className="size-3" aria-hidden />} onChange={checked => router.push(pairHref(a, b, true, checked))} /><label htmlFor={id}>{label}</label></span>;
}

const unreviewed = (states: Record<string, ReviewState>, pair: { a: number; b: number }) => {
  const state = states[`${pair.a}:${pair.b}`];
  return state !== 'checked' && state !== 'dropped';
};

function PairList({ pairs: listed, names, a, b, autoFocus = false, onPick, review = false, states = {}, savedOnly = false, onSavedOnly, todo = false }: { pairs: SurahPair[]; names: Names; a: number; b: number; autoFocus?: boolean; onPick?: () => void; review?: boolean; states?: Record<string, ReviewState>; savedOnly?: boolean; onSavedOnly?: (checked: boolean) => void; todo?: boolean }) {
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
  const stories = savedOnly ? [] : curatedComparisons.filter(pair => matches(pair) && (!todo || unreviewed(states, pair)));
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
      <Link href={pairHref(pair.a, pair.b, review, todo)} scroll onClick={onPick} aria-current={pair.a === a && pair.b === b ? 'page' : undefined}
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
      <Segmented label={ar ? 'ترتيب القائمة' : 'Sort the list'} className="w-full [&>*]:flex-1" options={[
        { key: 'mushaf', label: ar ? 'ترتيب المصحف' : 'Mushaf order', icon: <ArrowDown01 size={16} aria-hidden />, current: !byCount, onClick: () => { setByCount(false); writeSort(false); } },
        { key: 'count', label: ar ? 'الأكثر تشابهًا' : 'Most similar', icon: <ArrowDownWideNarrow size={16} aria-hidden />, current: byCount, onClick: () => { setByCount(true); writeSort(true); } },
      ]} />
      {onSavedOnly && <SavedOnly checked={savedOnly} onChange={onSavedOnly} saved={saved.size} />}
      {review && <TodoOnly a={a} b={b} todo={todo} />}
      <div ref={list} className="min-h-0 flex-1 overflow-y-auto">
        {stories.length > 0 && <>
          <h3 className={heading}>{ar ? 'مختارة' : 'Selected stories'}</h3>
          <ul>{stories.map(pair => row(pair, <><span className="block">{ar ? pair.name.voweled : pair.name.en}</span><span className="block text-xs text-[var(--home-muted)]">{sides(pair)}</span></>))}</ul>
        </>}
        <h3 className={heading}>{ar ? 'كل السور المتشابهة' : 'All similar surahs'}</h3>
        {grouped ? <ul data-all>{surahs.map(n => (
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
const pairHref = (a: number, b: number, review: boolean, todo = false) => `${surahPairHref(a, b)}${review ? '&review=1' : ''}${review && todo ? '&todo=1' : ''}`;

const ICON = 'flex size-8 items-center justify-center rounded-full text-[var(--home-muted)] hover:text-[var(--home-accent)] focus-visible:outline-2 focus-visible:outline-[var(--home-accent)]';

const lightMarks = (lit: string | null) => (ayah: SpreadAyah) => ({ ...ayah, marks: Object.fromEntries(Object.entries(ayah.marks ?? {}).map(([index, mark]) => [index, { ...mark, lit: mark.link === lit }])) });

function sidePage(side: CardSide, names: Names, ar: boolean, lit: string | null, extra?: React.ReactNode, partners?: Pick<SpreadPage, 'pick'> & { numbers: number[]; ayat: SpreadAyah[][] }): SpreadPage {
  const name = ar ? plainName(names[side.surah]?.ar ?? '') : names[side.surah]?.en ?? String(side.surah);
  const read = ar ? `اقرأ ${name} ${num(side.ayah)} في المصحف` : `Read ${name} ${side.ayah} in the mushaf`;
  const show = (n: number) => (ar ? num(n) : n);
  const last = side.ayat[side.ayat.length - 1]?.number ?? side.ayah;
  return {
    title: partners ? `${name} ${partners.numbers.map(show).join(' · ')}` : `${name} ${show(side.ayah)}${last > side.ayah ? `–${show(last)}` : ''}`,
    action: <span className="flex">
      {extra}
      <Link href={`/quran/read/ayah/${side.surah}/${side.ayah}`} aria-label={read} title={read} className={ICON}>
        <BookOpen size={16} aria-hidden />
      </Link>
    </span>,
    rows: partners?.ayat ?? [side.ayat.map(lightMarks(lit))],
    ...(partners ? { pick: partners.pick } : {}),
  };
}

/** One similar ayah pair. Tapping a coloured word lights the word it matches on the other side. */
const anchorOf = (card: PairCard) => compareAnchor(card.sides[0], card.sides[1]);

function Card({ card, names, ar, savedIds }: { card: PairCard; names: Names; ar: boolean; savedIds: string[] }) {
  const [lit, setLit] = useState<string | null>(null);
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
  const [selected, setSelected] = useState(0);
  const option = card.many?.options[selected];
  const shownSides = card.sides.map((side, i) => !option ? side : i === card.many!.side ? { ...side, ayah: option.ayah.number, ayat: [option.ayah] } : { ...side, ayat: [option.shared] });
  const partners = (side: CardSide) => {
    const name = ar ? plainName(names[side.surah]?.ar ?? '') : names[side.surah]?.en ?? String(side.surah);
    const options = card.many!.options;
    return {
      numbers: options.map(item => item.ayah.number),
      ayat: options.map((item, i) => [i === selected ? lightMarks(lit)(item.ayah) : { ...item.ayah, marks: undefined }]),
      pick: { selected, labels: options.map(item => `${name} ${ar ? num(item.ayah.number) : item.ayah.number}`), onPick: (row: number) => { if (row !== selected) { setSelected(row); setLit(null); } } },
    };
  };
  return (
    <li id={anchor} className={`scroll-mt-20 ${card.verdict?.keep === false && !card.verdict.ask ? 'opacity-60' : ''}`}>
      <DoubleTapSave id={id} text={bookmark.text} href={bookmark.href} aliases={savedIds}>
        <div onClick={event => pick(event.target)}>
          <PageSpread compact stackOnMobile pages={shownSides.map((side, i) => sidePage(side, names, ar, lit, i === 0 && card.group ? (
            <Link href={branchesHref(card.group)} aria-label={family} title={family} className={ICON}><TreeIcon size={16} aria-hidden /></Link>
          ) : undefined, card.many?.side === i ? partners(side) : undefined))} />
        </div>
      </DoubleTapSave>
      <div className="flex justify-end">
        <Button size="icon" variant="muted" aria-pressed={saved} onClick={() => toggleBookmark(bookmark, savedIds)} aria-label={saveLabel} title={saveLabel} className={saved ? 'text-[var(--home-accent)]' : undefined}>
          {saved ? <BookmarkCheck size={18} aria-hidden /> : <Bookmark size={18} aria-hidden />}
        </Button>
      </div>
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

export default function PairCompare({ a, b, cards, pairs, names, review = false, states, editable = false, todo = false }: { a: number; b: number; cards: PairCard[]; pairs: SurahPair[]; names: Names; review?: boolean; states?: Record<string, ReviewState>; editable?: boolean; todo?: boolean }) {
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
  const next = index >= 0 ? pairs[index + 1] : undefined;
  const nextTodo = states && [...pairs.slice(index + 1), ...pairs.slice(0, Math.max(index, 0))].find(pair => unreviewed(states, pair));
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
          {editable && <ReviewButtons a={a} b={b} cards={cards} nextHref={nextTodo && pairHref(nextTodo.a, nextTodo.b, true, todo)} />}
          {shown.length === 0 ? <p role="status" className={NOTE}>{savedOnly ? (ar ? 'لا بطاقات محفوظة بين السورتين.' : 'No saved cards between these surahs.') : ar ? 'لا آيات متشابهة بين السورتين. اختر سورتين من القائمة.' : 'No similar ayat between these surahs. Choose two surahs from the list.'}</p>
            : <ol className="flex flex-col gap-4">{shown.map(card => <Card key={card.id} card={card} names={names} ar={ar} savedIds={savedAs(card.id, bookmarks)} />)}</ol>}
          {next && <Link href={pairHref(next.a, next.b, review, todo)} className="self-center rounded-lg border border-[var(--home-rule)] px-4 py-2 text-[var(--home-accent)] hover:bg-[var(--home-paper-deep)]">
            {ar ? `التالي: ${title(next.a, next.b)}` : `Next: ${title(next.a, next.b)}`}
          </Link>}
        </div>
        <aside ref={pane} aria-label={label} className="sticky top-4 hidden max-h-[calc(100dvh-2rem)] flex-col rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] p-3 lg:flex">
          <PairList pairs={pairs} names={names} a={a} b={b} review={review} states={states} savedOnly={savedOnly} onSavedOnly={setSavedOnly} todo={todo} />
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
          {open && <PairList pairs={pairs} names={names} a={a} b={b} onPick={close} review={review} states={states} savedOnly={savedOnly} onSavedOnly={setSavedOnly} todo={todo} />}
        </div>
      </dialog>
    </div>
  );
}
