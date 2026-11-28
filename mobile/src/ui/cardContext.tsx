import { createContext, useContext } from 'react';

export const InsideCard = createContext(false);

export const useInsideCard = () => useContext(InsideCard);

export type Slot = { set: (id: string, node: React.ReactNode | null) => void };
export const RowSlot = createContext<Slot | null>(null);

export const useCardRow = () => !!useContext(RowSlot);

export function OutsideCard({ children }: { children: React.ReactNode }) {
  return <InsideCard.Provider value={false}><RowSlot.Provider value={null}>{children}</RowSlot.Provider></InsideCard.Provider>;
}
