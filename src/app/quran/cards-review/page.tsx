import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Segmented from '@/components/common/Segmented';
import Chip from '@/components/common/Chip';
import styles from '@/components/common/PaperPage.module.css';
import { surahName } from '@shared/quran/surahNames';
import { CARD_KINDS, comparePages, pageOf, pressesByCard, pressOf, selectCards, sharedKey, type CardKind } from '@/lib/quran/curation/cardReviewIndex';
import { cardProposals, cardReviewIndex } from '@/lib/quran/curation/cardReviewData';
import { readCardPresses } from '@/lib/quran/curation/cardReviewLog';
import ReviewCard from './ReviewCard';
import Pager from './Pager';
import ReviewKeys from './ReviewKeys';
import { cardsReviewHref, PAGE_SIZES, parseCardsReview } from './query';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'مراجعة البطاقات' };

const names = Object.fromEntries(Array.from({ length: 114 }, (_, i) => [i + 1, surahName(i + 1)]));

/**
 * The owner's review of every card, on their own machine (owner 2026-11-20): pick a kind, a page size and a page; see the card as
 * it is or as the agents propose it; each press only appends a line to the review log.
 */
export default async function CardsReview({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (process.env.NODE_ENV !== 'development') notFound();
  const index = cardReviewIndex();
  const proposals = cardProposals();
  const pressed = pressesByCard(readCardPresses());
  const pairs = comparePages(index.cards);
  const query = parseCardsReview(await searchParams, pairs[0]?.page);
  const list = selectCards(index.cards, proposals, pressed, query);
  const { items, page, pages } = pageOf(list, query.size, query.page);
  const counts = Object.fromEntries(CARD_KINDS.map(kind => [kind.id, index.cards.filter(entry => entry.kind === kind.id).length])) as Record<CardKind, number>;
  const href = (change: Partial<typeof query>) => cardsReviewHref({ ...query, page: 1, ...change });
  const first = (page - 1) * query.size;
  const pairAt = pairs.findIndex(pair => pair.page === query.pair);
  const pairHref = (step: number) => (query.kind === 'compare' && pairs[pairAt + step] ? href({ pair: pairs[pairAt + step].page }) : undefined);
  const pager = <Pager page={page} hrefs={Array.from({ length: pages }, (_, i) => href({ page: i + 1 }))} />;
  return <main className={`${styles.page} mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6`} dir="rtl">
    <h1 className="text-xl">مراجعة البطاقات</h1>
    <Segmented label="نوع البطاقات" options={CARD_KINDS.map(kind => ({ key: kind.id, label: `${kind.ar} (${counts[kind.id]})`, current: query.kind === kind.id, href: href({ kind: kind.id }) }))} />
    {query.kind === 'compare' && <Pager label="السورتان" page={pairAt + 1} hrefs={pairs.map(pair => href({ pair: pair.page }))} labels={pairs.map(pair => `${pair.page.split('/').map(n => names[Number(n)]).join(' و')} (${pair.count})`)} />}
    <div className="flex flex-wrap items-center gap-2">
      <Chip label="ما غيّره الوكلاء فقط" on={query.changed} href={href({ changed: !query.changed })} />
      <Chip label="غير المراجَعة فقط" on={query.todo} href={href({ todo: !query.todo })} />
      <Segmented label="عدد البطاقات في الصفحة" options={PAGE_SIZES.map(size => ({ key: String(size), label: String(size), current: query.size === size, href: href({ size }) }))} />
    </div>
    <p className="text-sm text-[var(--home-muted)]">{list.length} بطاقة</p>
    <ReviewKeys key={items.map(entry => entry.id).join()} previous={page > 1 ? href({ page: page - 1 }) : pairHref(-1)} next={page < pages ? href({ page: page + 1 }) : pairHref(1)} unreviewed={query.todo} />
    {pager}
    <ol className="flex flex-col gap-4">
      {items.map((entry, i) => {
        const press = pressOf(entry, pressed);
        const shared = sharedKey(entry);
        return <li key={entry.id}><ReviewCard number={first + i + 1} entry={entry} shared={shared} proposal={proposals[entry.id]} pressed={press && { action: press.action as Exclude<typeof press.action, 'undo'>, version: press.version, t: press.t }} names={names} /></li>;
      })}
    </ol>
    {pager}
  </main>;
}
