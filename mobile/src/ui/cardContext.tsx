import { createContext, useContext } from 'react';

/** True inside a card: a box drawn there would be a card in a card, so the shared pieces draw flat instead. */
export const InsideCard = createContext(false);

/**
 * Inside a card (owner, 2026-11-19: no box in a box): a piece that frames itself (the matrix, a quiz's ayah) asks this and
 * draws no frame of its own there. A `Card` inside a card already draws flat by itself.
 */
export const useInsideCard = () => useContext(InsideCard);

export type Slot = { set: (id: string, node: React.ReactNode | null) => void };
/** Where `UnderCard` puts its buttons: the row under the card of a feed post (`CardWithRow`). */
export const RowSlot = createContext<Slot | null>(null);

/** True where `UnderCard` puts its buttons in a card's row, so a piece can draw them the row's size (small, icon only). */
export const useCardRow = () => !!useContext(RowSlot);

/** What opens over the screen (a sheet, a menu) starts outside every card, wherever it is drawn from. */
export function OutsideCard({ children }: { children: React.ReactNode }) {
  return <InsideCard.Provider value={false}><RowSlot.Provider value={null}>{children}</RowSlot.Provider></InsideCard.Provider>;
}
