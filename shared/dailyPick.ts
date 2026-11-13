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
