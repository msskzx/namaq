'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { lastLink, sahihName, searchSahih, splitRoute, type SahihBook, type SahihHadith, type SahihIndex, type SahihRoute } from '@shared/sahih';
import { num } from '@shared/quran/arabicNumber';
import Card from '@/components/common/Card';
import CardWithRow from '@/components/common/CardWithRow';
import type { Source } from '@/components/common/sourceSlot';
import Folded from '@/components/common/Folded';
import Reference from '@/components/common/Reference';
import Segmented from '@/components/common/Segmented';
import TapRow from '@/components/common/TapRow';
import Empty from '@/components/common/Empty';
import { SearchField } from '@/components/common/Field';

/**
 * A Sahih's hadith on the website (the app's mobile/src/components/Sahih.tsx): the chain drawn, a route drawn or read, a
 * hadith whole with Muslim's other routes folded, and a kitab's hadith card. The hadith page, the feed card and the quiz's
 * look-up all draw them.
 */
type Mode = 'drawing' | 'text';
// The owner's names (2026-11-18): the drawing, and the whole text with its isnad.
const MODES: { key: Mode; label: string }[] = [{ key: 'drawing', label: 'الرسم' }, { key: 'text', label: 'النص كاملًا' }];
const pagesName = (pages: number[]) => (pages.length > 1 ? `ص ${num(pages[0])}–${num(pages[pages.length - 1])}` : `ص ${num(pages[0])}`);

/** A page of a Sahih on Shamela, by the page's id there. */
export const sahihPage = (book: Pick<SahihBook, 'shamela'>, shamela: number) => `https://shamela.ws/book/${book.shamela}/${shamela}`;

/** A chain drawn top to bottom: the collector, then each narrator under the one who narrated from him, the word on the line. */
export function SahihChain({ book, route }: { book: Pick<SahihBook, 'slug'>; route: SahihRoute }) {
  const chain = route.chain ?? [];
  const collector = book.slug === 'bukhari' ? 'البخاري' : 'مسلم';
  return (
    <ol aria-label={`الإسناد: ${[collector, ...chain.map(link => link.name)].join('، ')}`} className="flex flex-col items-center text-center">
      <li className="text-[1.0625rem] text-[var(--home-accent)]">{collector}</li>
      {chain.map((link, i) => (
        <li key={`${link.name}-${i}`} className="flex flex-col items-center">
          <span className="flex min-h-[30px] items-center gap-2">
            <span aria-hidden className="w-px self-stretch bg-[var(--home-rule)]" />
            <span className="text-[0.8125rem] text-[var(--home-amber)]">{link.mode}</span>
          </span>
          <span className={i === chain.length - 1 ? '' : 'text-[var(--home-muted)]'}>{link.name}</span>
        </li>
      ))}
    </ol>
  );
}

/** One printed text: its chain drawn and its words under it, or the whole text with the chain muted; its page folded. */
export function SahihRouteView({ book, n, route, mode, big = false }: { book: SahihBook; n: number; route: SahihRoute; mode: Mode; big?: boolean }) {
  const { chain, words } = splitRoute(route);
  const body = big ? 'text-[1.3125rem] leading-[1.9]' : 'text-[1.1875rem] leading-[1.9]';
  return (
    <div className="flex flex-col gap-2.5">
      {mode === 'drawing' && route.chain
        ? <><SahihChain book={book} route={route} /><p className={body}>{words}</p></>
        : <p className={body}><span className="text-[var(--home-muted)]">{chain}</span>{words}</p>}
      {/* In a card with a row, the book joins its line and the page (linked to al-Shamela) its sheet (owner 2026-11-20). */}
      <Reference title={book.title}
        quotes={[{ text: '', cite: `${sahihName(book, n, num, route.route)}، ج ${num(route.volume)}، ${pagesName(route.pages)}`, url: sahihPage(book, route.shamela) }, { text: `${book.title}، ${book.edition}` }]} />
    </div>
  );
}

/** A hadith whole: the narrator it comes from, «الرسم» or «النص كاملًا», its first route large, the others folded. */
export function SahihHadithView({ book, hadith }: { book: SahihBook; hadith: SahihHadith }) {
  const [mode, setMode] = useState<Mode>('drawing');
  const [first, ...rest] = hadith.routes;
  const from = lastLink(first);
  return (
    <div dir="rtl" lang="ar" className="flex flex-col gap-3">
      {from && <p className="text-[var(--home-muted)]">{from}</p>}
      {hadith.routes.some(route => route.chain) && <Segmented tabs label="طريقة العرض" className="self-start" options={MODES.map(item => ({ ...item, current: mode === item.key, onClick: () => setMode(item.key) }))} />}
      <SahihRouteView book={book} n={hadith.n} route={first} mode={mode} big />
      {rest.length > 0 && (
        <Folded bare credit={`طرق أخرى عند ${book.slug === 'muslim' ? 'مسلم' : 'البخاري'} (${num(rest.length)})`}>
          {rest.map((route, i) => <SahihRouteView key={`${route.route}-${i}`} book={book} n={hadith.n} route={route} mode={mode} />)}
        </Folded>
      )}
    </div>
  );
}

/** A hadith in a kitab's list (the app's SahihHadithCard): its numbers, the narrator, the opening of its words. */
export function SahihHadithCard({ n, also, from, start, routes, href }: { n: number; also?: number[]; from?: string; start: string; routes: number; href: string }) {
  const numbers = [n, ...(also ?? [])].map(each => num(each)).join(' - ');
  return (
    <Card href={href} aria-label={`الحديث ${numbers}`} className="flex flex-col gap-1 px-3.5 py-2.5">
      <span className="flex justify-between gap-2">
        <span className="text-[0.9375rem] text-[var(--home-accent)]">{numbers}</span>
        {from && <span className="truncate text-sm text-[var(--home-muted)]">{from}</span>}
      </span>
      <span className="line-clamp-3 text-[1.0625rem] leading-[1.8]">{start}</span>
      {routes > 1 && <span className="text-[0.8125rem] text-[var(--home-muted)]">{`${num(routes)} طرق`}</span>}
    </Card>
  );
}

/**
 * A Sahih's kitabs as rows in one card (the app's SahihKitabList), each its number, name and hadith numbers; `mark` checks
 * one (a quiz's answer). The book's page links each kitab (`kitabHref`, the kitab's number after it); a quiz's look-up opens
 * its bab headings under it.
 */
export function SahihKitabList({ book, kitabHref, mark, source }: { book: SahihIndex; kitabHref?: string; mark?: number;
  /** The book itself, on the line under the list (the book's page). */
  source?: Source[] }) {
  const [open, setOpen] = useState<number>();
  return (
    <CardWithRow source={source} className="flex flex-col px-3.5 py-1">
      {book.kitabs.map((kitab, i) => {
        const inside = <>
          <span className="w-7 shrink-0 text-[0.9375rem] text-[var(--home-accent)]">{num(kitab.n)}</span>
          <span className="flex-1 text-[1.0625rem]">{kitab.title}</span>
          {kitab.n === mark ? <Check size={18} aria-label="الجواب" className="text-[var(--home-green)]" />
            : <span className="text-[0.8125rem] text-[var(--home-muted)]">{kitab.from ? `${num(kitab.from)}–${num(kitab.to)}` : ''}</span>}
        </>;
        return (
          <div key={kitab.n} className={i ? 'border-t border-[var(--home-rule)]' : ''}>
            {kitabHref ? <TapRow href={`${kitabHref}${kitab.n}`} className="gap-2.5 py-2">{inside}</TapRow>
              : <TapRow onClick={() => setOpen(was => (was === kitab.n ? undefined : kitab.n))} className="gap-2.5 py-2">{inside}</TapRow>}
            {open === kitab.n && kitab.babs.filter(bab => bab.title).map((bab, at) => <p key={at} className="pb-1.5 leading-[1.7] text-[var(--home-muted)]">{bab.title}</p>)}
          </div>
        );
      })}
    </CardWithRow>
  );
}

/** A quiz's look-up for «في أيّ كتاب؟» (the app's SahihLook): a search over the book's bab headings, or its kitabs. */
export function SahihLook({ book, mark }: { book: SahihIndex; mark?: number }) {
  const [query, setQuery] = useState('');
  const found = query.trim() ? searchSahih([{ index: book }], query, Infinity).babs : null;
  return (
    <div dir="rtl" lang="ar" className="flex flex-col gap-3">
      <SearchField label={`ابحث في أبواب ${book.title}`} placeholder="ابحث بكلمات من الباب" value={query} onChangeText={setQuery} />
      {found
        ? found.length ? found.map(hit => {
          const kitab = book.kitabs.find(each => each.n === hit.kitab)!;
          return (
            <Card key={`${hit.kitab}-${hit.bab}`} className="flex flex-col gap-1 px-3.5 py-2.5">
              <span className={`text-[0.8125rem] ${hit.kitab === mark ? 'text-[var(--home-green)]' : 'text-[var(--home-muted)]'}`}>{kitab.title}</span>
              <span className="leading-[1.8]">{kitab.babs[hit.bab ?? 0].title}</span>
            </Card>
          );
        }) : <Empty text="لا باب فيه هذه الكلمات." />
        : <SahihKitabList book={book} mark={mark} />}
    </div>
  );
}
