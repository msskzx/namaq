'use client';
import { createContext, useContext, useId, useLayoutEffect } from 'react';
import type { Quote } from './Reference';

/** Where a home card's sources come from (owner 2026-11-20): the line under its buttons, and what its sheet opens to. As the app's ui/sourceSlot.ts. */
export type Source = { line: string; quotes: Quote[]; links?: { label: string; url: string }[] };

type SourceSlot = { set: (id: string, source: Source | null) => void };
/** Set by a home card (homepage/HomeFeed `Post`): a `Reference` drawn inside it hands its book up to the card's source line. */
export const SourceSlotContext = createContext<SourceSlot | null>(null);

/** Hands `source` to the card's source line when inside a home card; true there, so the caller draws nothing in the card. */
export function useLiftSource(source: Source) {
  const slot = useContext(SourceSlotContext);
  const id = useId();
  useLayoutEffect(() => { slot?.set(id, source); });
  useLayoutEffect(() => () => slot?.set(id, null), [slot, id]);
  return !!slot;
}
