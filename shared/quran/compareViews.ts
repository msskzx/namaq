import data from '../data/quran/compareViews.json';
import type { PairCard } from './compareCards';
import { tanasubTree } from './tanasubCards';

export type CompareView = { view: 'matrix'; why: string };

export const compareViews = (data as { cards: Record<string, CompareView> }).cards;

export const compareMatrixOnly = (card: { id: string } & Partial<Pick<PairCard, 'book'>>, views: Record<string, CompareView> = compareViews) =>
  views[card.id]?.view === 'matrix' || (!!card.book && !tanasubTree(card.book));
