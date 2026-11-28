import { createContext, useContext, useId, useLayoutEffect } from 'react';

export type Quote = { text: string; cite?: string; url?: string };

export type Source = { line: string; quotes: Quote[]; links?: { label: string; url: string }[];
  places?: string[]; editions?: string[] };

type SourceSlot = { set: (id: string, source: Source | null) => void };
export const SourceSlotContext = createContext<SourceSlot | null>(null);

export function useLiftSource(source: Source) {
  const slot = useContext(SourceSlotContext);
  const id = useId();
  useLayoutEffect(() => { slot?.set(id, source); });
  useLayoutEffect(() => () => slot?.set(id, null), [slot, id]);
  return !!slot;
}

