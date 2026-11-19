"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** Where `UnderCard` puts its buttons: the row under a feed post's card (homepage/HomeFeed `Post`). */
const RowSlot = createContext<HTMLElement | null>(null);

/**
 * A feature's own buttons (a quiz's hint, a checked tree's save and share, «ابحث عن الجواب»): in the row under the card when
 * the card has one (a feed post; owner 2026-11-18 and 2026-11-19: buttons sit under the card, never in it), else where they
 * are drawn. As the app's ui/Card `UnderCard`.
 */
export function UnderCard({ children }: { children: ReactNode }) {
  const slot = useContext(RowSlot);
  return slot ? createPortal(children, slot) : <>{children}</>;
}

/** True where `UnderCard` puts its buttons in a card's row, so a piece can draw them the row's way (icon only). */
export const useCardRow = () => !!useContext(RowSlot);

/**
 * The card's content and the row its buttons go to: `slot` is the element at the start of the row under the card
 * (`display: contents`, so what lands there flows with the post's own buttons).
 */
export function CardRowProvider({ slot, children }: { slot: HTMLElement | null; children: ReactNode }) {
  return <RowSlot.Provider value={slot}>{children}</RowSlot.Provider>;
}

/** The slot element a post keeps for its row: a callback ref and the element once mounted. */
export function useRowSlot() {
  return useState<HTMLElement | null>(null);
}
