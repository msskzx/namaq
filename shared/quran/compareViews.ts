import data from '../data/quran/compareViews.json';
import type { PairCard } from './compareCards';

/**
 * The owner's view verdict on one compare card, keyed by the card's id (`PairCard.id`). `view: 'matrix'` keeps the card as its
 * matrix only: no tree and no tree button, on the compare page, the home pair card and everywhere else the card shows.
 * `why` names the case: nothing shared, parts and rejoins twice or more, or too long for a tree.
 */
export type CompareView = { view: 'matrix'; why: string };

export const compareViews = (data as { cards: Record<string, CompareView> }).cards;

/** Whether some ayah of the card has two marked words in a row: a run of shared words a tree can draw. */
const sharesRun = (card: Pick<PairCard, 'sides'>) => card.sides.some(side => side.ayat.some(ayah => Object.keys(ayah.marks ?? {}).map(Number).some((word, _, all) => all.includes(word + 1))));

/**
 * A compare card the owner keeps as its matrix only. A surah-order book's card (`book`) follows the owner's first case by
 * itself: with no run of two shared words it has nothing to draw as a tree, and the book, not the words, makes it a pair.
 */
export const compareMatrixOnly = (card: { id: string } & Partial<Pick<PairCard, 'book' | 'sides'>>, views: Record<string, CompareView> = compareViews) =>
  views[card.id]?.view === 'matrix' || (!!card.book && !!card.sides && !sharesRun({ sides: card.sides }));
