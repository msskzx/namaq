'use client';

import { useContext, useMemo, useState, type HTMLAttributes, type ReactNode } from 'react';
import Card from './Card';
import CappedCard from './CappedCard';
import MoreMenu, { type MoreItem } from './MoreMenu';
import SourceLine from './SourceLine';
import Reference from './Reference';
import { CardRowProvider, UnderCard, useCardRow, useRowSlot } from './UnderCard';
import { SourceSlotContext, type Source } from './sourceSlot';

/** In the sheet that shows a capped card whole, the card's references stay on the source line at the sheet's foot. */
const NO_SOURCES = { set: () => {} };

/** The row under a card: its buttons grouped on the right, hidden while it holds none. */
const ROW = 'flex flex-wrap items-center justify-start [&:not(:has(button,a,[role=toolbar]))]:hidden';

/**
 * A card with the row of buttons under it and the book line under the row (the feed post's shape, owner 2026-11-20; the
 * app's ui/Card `CardWithRow`): every feed card and every section of a page. `lead` opens the item in its own reader, first
 * in the row; what the content hands up with `UnderCard` comes next, then `row` (save, share); the «⋯» of `menu` sits
 * alone at the row's far end. `source` names the card's books on the line; a `Reference` inside the card joins its sheet.
 * With `cap`, long content stops at two thirds of the screen and «اقرأ كاملًا» opens it whole in a sheet.
 */
export default function CardWithRow({ lead, row, menu = [], cap = false, source = [], bar, className = '', card, children }: {
  lead?: ReactNode;
  row?: ReactNode;
  menu?: MoreItem[];
  cap?: boolean;
  source?: Source[];
  /** A bar of the card's own between it and its buttons (recall's recite bar). */
  bar?: ReactNode;
  /** The card's inner layout (padding, flex), as on `Card`. */
  className?: string;
  /** The card's own attributes and looks (an `id` to link to, `data-share-image` for the picture it shares, `picked`); not on a capped card. */
  card?: HTMLAttributes<HTMLElement> & { as?: 'article' | 'section'; picked?: boolean; faded?: boolean } & Record<`data-${string}`, string | number | boolean | undefined>;
  children: ReactNode;
}) {
  const [slot, setSlot] = useRowSlot();
  const [sheetSlot, setSheetSlot] = useRowSlot();
  const [handed, setHanded] = useState<[string, Source][]>([]);
  const sourceSlot = useMemo(() => ({ set: (id: string, given: Source | null) => setHanded(now => {
    const rest = now.filter(([at]) => at !== id);
    if (!given) return rest.length === now.length ? now : rest;
    const at = now.findIndex(([key]) => key === id);
    return at < 0 ? [...now, [id, given]] : now.map(entry => (entry[0] === id ? [id, given] : entry));
  }) }), []);
  const inner = handed.map(([, given]) => given);
  const outerSources = useContext(SourceSlotContext);
  const outerRow = useCardRow();
  const nested = !!outerSources || outerRow;
  // Drawn inside another card with a row (a page's section in a quiz's look-up, a feed post): no second card and no second
  // row; its buttons join that card's row and its books that card's line (as the app's).
  if (nested) return <>{children}<UnderCard>{lead}{row}</UnderCard>{source.map(given => <Reference key={given.line} title={given.line} quotes={given.quotes} links={given.links} />)}</>;
  const buttons = (ref: (element: HTMLElement | null) => void, more?: ReactNode) => <>
    {bar && <div className="mt-2 flex justify-center" data-share-skip>{bar}</div>}
    <div className={ROW} data-share-skip>{lead}<span ref={ref} className="contents" />{row}{more}</div>
  </>;
  const sources = source.length + inner.length > 0 && <SourceLine named={source.length ? source : inner} sources={[...source, ...inner]} />;
  const content = <SourceSlotContext.Provider value={sourceSlot}><CardRowProvider slot={slot}>{children}</CardRowProvider></SourceSlotContext.Provider>;
  const look = `overflow-hidden ${className}`;
  // One block, so a page's gaps part its sections, not a card from its own row and line.
  return <div className="flex shrink-0 flex-col gap-1">
    {cap ? <CappedCard className={look} whole={<>
      <Card className={look}><SourceSlotContext.Provider value={NO_SOURCES}><CardRowProvider slot={sheetSlot}>{children}</CardRowProvider></SourceSlotContext.Provider></Card>
      {buttons(setSheetSlot)}
      {sources}
    </>}>{content}</CappedCard> : <Card {...card} className={look}>{content}</Card>}
    {buttons(setSlot, <MoreMenu items={menu} />)}
    {sources}
  </div>;
}
