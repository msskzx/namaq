import { shownCards, type PairCard, type StoredCards, type WordsOf } from './quran/compareCards';

/** The local calendar day as a whole number, the same all day and the next number tomorrow. */
export const dayNumber = (date: Date) => Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);

/** Today's place in a list of `length`, spread so that following days land far apart. */
export const dailyIndex = (day: number, length: number) => (length ? ((day * 7919) % length + length) % length : -1);

/** A card of one ayah against one ayah, which reads well on its own. */
const isPair = (card: PairCard) => !card.many && !card.pairs && card.sides.every(side => side.ayat.length === 1);

/** The day's look-alike pair for the homepage: one ayah from each of two surahs, from the compare cards a reader kept. */
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

/** The fewest and most ayat a feed tree may hold: big enough to be worth a look, small enough to fit a phone. */
export const FEED_TREE_AYAT = [3, 8] as const;

/** The trees that suit the home feed: mid-sized ones. */
export const feedTrees = <T extends { keys: string[] }>(pieces: T[]) => pieces.filter(piece => {
  const count = new Set(piece.keys).size;
  return count >= FEED_TREE_AYAT[0] && count <= FEED_TREE_AYAT[1];
});

/** The feed's tree for a day, the same all day; `offset` walks on to the next ones when the feed loads more. */
export function dailyTree<T extends { keys: string[] }>(pieces: T[], day: number, offset = 0): T | undefined {
  const fits = feedTrees(pieces);
  return fits.length ? fits[(dailyIndex(day, fits.length) + offset) % fits.length] : undefined;
}
