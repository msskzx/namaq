import { shownCards, type PairCard, type StoredCards, type WordsOf } from './quran/compareCards';

export const dayNumber = (date: Date) => Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);

export const dailyIndex = (day: number, length: number) => (length ? ((day * 7919) % length + length) % length : -1);

const isPair = (card: PairCard) => !card.many && !card.pairs && card.sides.every(side => side.ayat.length === 1);

export function dailyPair(stored: StoredCards, words: WordsOf, day: number): PairCard | undefined {
  const pages = stored.listed.filter(pair => pair.a !== pair.b);
  const start = dailyIndex(day, pages.length);
  for (let step = 0; step < pages.length; step++) {
    const page = pages[(start + step) % pages.length];
    const cards = shownCards(stored, words, page.a, page.b).filter(isPair);
    if (cards.length) return cards[dailyIndex(day, cards.length)];
  }
  return undefined;
}

export const FEED_TREE_AYAT = [3, 8] as const;

export const feedTrees = <T extends { keys: string[] }>(pieces: T[]) => pieces.filter(piece => {
  const count = new Set(piece.keys).size;
  return count >= FEED_TREE_AYAT[0] && count <= FEED_TREE_AYAT[1];
});

export function dailyTree<T extends { keys: string[] }>(pieces: T[], day: number, offset = 0): T | undefined {
  const fits = feedTrees(pieces);
  return fits.length ? fits[(dailyIndex(day, fits.length) + offset) % fits.length] : undefined;
}
