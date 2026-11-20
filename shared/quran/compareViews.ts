import data from '../data/quran/compareViews.json';
import type { PairCard } from './compareCards';
import { tanasubTree } from './tanasubCards';

/**
 * The owner's view verdict on one compare card, keyed by the card's id (`PairCard.id`). `view: 'matrix'` keeps the card as its
 * matrix only: no tree and no tree button, on the compare page, the home pair card and everywhere else the card shows.
 * `why` names the case: nothing shared, parts and rejoins twice or more, or too long for a tree.
 */
export type CompareView = { view: 'matrix'; why: string };

export const compareViews = (data as { cards: Record<string, CompareView> }).cards;

/**
 * A compare card the owner keeps as its matrix only. A surah-order book's card (`book`) grows a tree only when it is meaningful
 * (owner 2026-11-20, shared/quran/tanasubCards.ts tanasubTree): the same rule on compare and on branches.
 */
export const compareMatrixOnly = (card: { id: string } & Partial<Pick<PairCard, 'book'>>, views: Record<string, CompareView> = compareViews) =>
  views[card.id]?.view === 'matrix' || (!!card.book && !tanasubTree(card.book));
