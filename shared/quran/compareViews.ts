import data from '../data/quran/compareViews.json';

/**
 * The owner's view verdict on one compare card, keyed by the card's id (`PairCard.id`). `view: 'matrix'` keeps the card as its
 * matrix only: no tree and no tree button, on the compare page, the home pair card and everywhere else the card shows.
 * `why` names the case: nothing shared, parts and rejoins twice or more, or too long for a tree.
 */
export type CompareView = { view: 'matrix'; why: string };

export const compareViews = (data as { cards: Record<string, CompareView> }).cards;

/** A compare card the owner keeps as its matrix only. */
export const compareMatrixOnly = (card: { id: string }, views: Record<string, CompareView> = compareViews) => views[card.id]?.view === 'matrix';
