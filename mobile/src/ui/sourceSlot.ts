import { createContext, useContext } from 'react';
import { useLiftInto } from '@/lib/hooks/useLiftInto';

export type Quote = { text: string; cite?: string; url?: string };

export type Source = { line: string; quotes: Quote[]; links?: { label: string; url: string }[];
  places?: string[]; editions?: string[] };

type SourceSlot = { set: (id: string, source: Source | null) => void };
export const SourceSlotContext = createContext<SourceSlot | null>(null);

export function useLiftSource(source: Source) {
  const slot = useContext(SourceSlotContext);
  useLiftInto(slot, source);
  return !!slot;
}

