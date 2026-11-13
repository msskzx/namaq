// The surah openings quiz (owner, 2026-11-13): the mushaf opens at a random surah's start in write mode, its name in
// the title box, and the reader writes its first ayah; the next button goes on to another surah.
import { inJuzRange, type JuzRange } from './juz';
import { shuffle, type Random } from '../quiz/random';

/** The first ayah of every surah that starts inside the range (all 114 without one). */
export const openingKeys = (range: JuzRange | null): string[] =>
  Array.from({ length: 114 }, (_, i) => `${i + 1}:1`).filter(key => !range || inJuzRange(key, range));

/** A round of the quiz: every opening in the range once, in random order. */
export const openingRound = (range: JuzRange | null, random: Random): string[] => shuffle(openingKeys(range), random);

/** Where the quiz is: the round's openings and the one being asked. */
export type Openings = { range: JuzRange | null; keys: string[]; at: number };

/** The next opening; a finished round starts a new one, never with the surah just asked. */
export function nextOpening(openings: Openings, random: Random): Openings {
  if (openings.at + 1 < openings.keys.length) return { ...openings, at: openings.at + 1 };
  const last = openings.keys[openings.at];
  let keys = openingRound(openings.range, random);
  if (keys.length > 1 && keys[0] === last) keys = [...keys.slice(1), keys[0]];
  return { ...openings, keys, at: 0 };
}

/** The website keeps the round for this tab (the app keeps it in the reader). */
export const OPENINGS_KEY = 'quran-openings';
