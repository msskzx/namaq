'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowDown01, ArrowDownWideNarrow, ArrowLeftRight, ChevronDown, Search, X } from 'lucide-react';
import Button from '@/components/common/Button';
import Segmented from '@/components/common/Segmented';
import TreeIcon from '@/components/common/TreeIcon';
import { NavActions } from '@/components/common/NavBar';
import { useLanguage } from '@/components/language/LanguageContext';
import PageSpread, { type SpreadPage } from '@/components/quran/PageSpread';
import { num } from '@/lib/quran/arabicNumber';
import { branchesHref } from '@/lib/quran/branches';
import { curatedComparisons, curatedFor, surahPairHref } from '@/lib/quran/curatedComparisons';
import type { SurahPair } from '@/lib/quran/mutashabih/pairs';
import { normalizeWord, plainName } from '@/lib/quran/normalize';
import { matchesSurah } from '@/lib/quran/surahSearch';
import { FIELD, NOTE } from '../panel';
import type { CardSide, PairCard } from './pairCards';

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
function PairList({ pairs, names, a, b, autoFocus = false, onPick }: { pairs: SurahPair[]; names: Names; a: number; b: number; autoFocus?: boolean; onPick?: () => void }) {
  const ar = useLanguage().language === 'ar';
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
  const stories = curatedComparisons.filter(matches);
  const all = (byCount ? [...pairs].sort((p, q) => q.count - p.count || p.a - q.a || p.b - q.b) : pairs).filter(matches);
  const sides = (pair: { a: number; b: number }) => `${plain(pair.a)} · ${plain(pair.b)}`;
  const row = (pair: { a: number; b: number }, label: React.ReactNode) => (
    <li key={`${pair.a}:${pair.b}`}>
      <Link href={surahPairHref(pair.a, pair.b)} scroll onClick={onPick} aria-current={pair.a === a && pair.b === b ? 'page' : undefined}
        className="flex items-center gap-3 rounded-md border-s-2 border-transparent px-3 py-2 hover:bg-[var(--home-paper-deep)] focus-visible:outline-2 focus-visible:outline-[var(--home-accent)] aria-[current=page]:border-[var(--home-accent)] aria-[current=page]:bg-[var(--home-paper-deep)]">
        <span className="min-w-0 flex-1">{label}</span>
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
      <div ref={list} className="min-h-0 flex-1 overflow-y-auto">
        {stories.length > 0 && <>
          <h3 className={heading}>{ar ? 'مختارة' : 'Selected stories'}</h3>
          <ul>{stories.map(pair => row(pair, <><span className="block">{ar ? pair.name.voweled : pair.name.en}</span><span className="block text-xs text-[var(--home-muted)]">{sides(pair)}</span></>))}</ul>
        </>}
        <h3 className={heading}>{ar ? 'كل السور المتشابهة' : 'All similar surahs'}</h3>
        {all.length ? <ul data-all>{all.map(pair => row(pair, sides(pair)))}</ul>
          : <p role="status" className={`${NOTE} px-3`}>{ar ? 'لا سورة بهذا البحث.' : 'No surah matches this search.'}</p>}
      </div>
    </div>
  );
}

function sidePage(side: CardSide, names: Names, ar: boolean, lit: string | null): SpreadPage {
  const name = ar ? plainName(names[side.surah]?.ar ?? '') : names[side.surah]?.en ?? String(side.surah);
  const range = side.from === side.to ? (ar ? num(side.from) : String(side.from)) : ar ? `${num(side.from)}–${num(side.to)}` : `${side.from}–${side.to}`;
  return {
    title: `${name} ${range}`,
    rows: [side.ayat.map(ayah => ({ ...ayah, marks: Object.fromEntries(Object.entries(ayah.marks ?? {}).map(([index, mark]) => [index, { ...mark, lit: mark.link === lit }])) }))],
  };
}

/** One similar ayah pair. Tapping a coloured word lights the word it matches on the other side. */
function Card({ card, names, ar }: { card: PairCard; names: Names; ar: boolean }) {
  const [lit, setLit] = useState<string | null>(null);
  const pick = (target: EventTarget) => {
    const id = (target as HTMLElement).closest?.('mark[data-link]')?.getAttribute('data-link');
    if (id) setLit(current => (current === id ? null : id));
  };
  const family = ar ? 'افتح في متشابهات القرآن' : 'Open in the phrase trees';
  return (
    <li className="relative">
      <div onClick={event => pick(event.target)} onKeyDown={event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        if ((event.target as HTMLElement).closest('mark[data-link]')) event.preventDefault();
        pick(event.target);
      }}>
        <PageSpread compact stackOnMobile pages={card.sides.map(side => sidePage(side, names, ar, lit))} />
      </div>
      <Link href={branchesHref(card.group)} aria-label={family} title={family}
        className="absolute end-1 top-1 flex size-8 items-center justify-center rounded-full text-[var(--home-muted)] hover:text-[var(--home-accent)] focus-visible:outline-2 focus-visible:outline-[var(--home-accent)]">
        <TreeIcon size={16} aria-hidden />
      </Link>
    </li>
  );
}

export default function PairCompare({ a, b, cards, pairs, names }: { a: number; b: number; cards: PairCard[]; pairs: SurahPair[]; names: Names }) {
  const ar = useLanguage().language === 'ar';
  const { title } = useNames(names, ar);
  const sheet = useRef<HTMLDialogElement>(null);
  const pane = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const label = ar ? 'اختر سورتين' : 'Choose two surahs';
  const story = curatedFor(a, b);
  const index = pairs.findIndex(pair => pair.a === a && pair.b === b);
  const next = index >= 0 ? pairs[index + 1] : undefined;
  const choose = () => {
    if (window.matchMedia?.('(min-width: 1024px)').matches) pane.current?.querySelector('input')?.focus();
    else { sheet.current?.showModal(); setOpen(true); }
  };
  const close = () => sheet.current?.close();
  return (
    <div dir={ar ? 'rtl' : 'ltr'} className="mx-auto w-full max-w-7xl p-4 text-[var(--home-ink)]">
      <NavActions>
        <span className="flex min-w-0 max-w-[calc(100%-8rem)] justify-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2">
          <Button variant="neutral" onClick={choose} aria-haspopup="dialog" aria-expanded={open} aria-label={`${label}: ${title(a, b)}`} className="min-w-0 max-w-full">
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
          {cards.length === 0 ? <p role="status" className={NOTE}>{ar ? 'لا آيات متشابهة بين السورتين. اختر سورتين من القائمة.' : 'No similar ayat between these surahs. Choose two surahs from the list.'}</p>
            : <ol className="flex flex-col gap-4">{cards.map(card => <Card key={card.id} card={card} names={names} ar={ar} />)}</ol>}
          {next && <Link href={surahPairHref(next.a, next.b)} className="self-center rounded-lg border border-[var(--home-rule)] px-4 py-2 text-[var(--home-accent)] hover:bg-[var(--home-paper-deep)]">
            {ar ? `التالي: ${title(next.a, next.b)}` : `Next: ${title(next.a, next.b)}`}
          </Link>}
        </div>
        <aside ref={pane} aria-label={label} className="sticky top-4 hidden max-h-[calc(100dvh-2rem)] flex-col rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] p-3 lg:flex">
          <PairList pairs={pairs} names={names} a={a} b={b} />
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
          {open && <PairList pairs={pairs} names={names} a={a} b={b} onPick={close} />}
        </div>
      </dialog>
    </div>
  );
}
