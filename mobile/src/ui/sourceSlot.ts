import { createContext, useContext, useId, useLayoutEffect } from 'react';

/** A quote from a book: its words, with the page it cites as a link (the page alone when it has no words). A quote with no page is our own note on the ones above. */
export type Quote = { text: string; cite?: string; url?: string };

/** Where a card's sources come from (owner 2026-11-20): the line under its buttons, and what its sheet opens to. */
export type Source = { line: string; quotes: Quote[]; links?: { label: string; url: string }[];
  /** Where in the book and its printings (shared/quiz/sources.ts SourceEntry), written out under it in a share picture. */
  places?: string[]; editions?: string[] };

type SourceSlot = { set: (id: string, source: Source | null) => void };
/** Set by a home card (`CardWithRow`): a `Reference` drawn inside it hands its book up to the card's source line. */
export const SourceSlotContext = createContext<SourceSlot | null>(null);

/** Hands `source` to the card's source line when inside a home card; true there, so the caller draws nothing in the card. */
export function useLiftSource(source: Source) {
  const slot = useContext(SourceSlotContext);
  const id = useId();
  useLayoutEffect(() => { slot?.set(id, source); });
  useLayoutEffect(() => () => slot?.set(id, null), [slot, id]);
  return !!slot;
}

