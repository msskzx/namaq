import generated from '@shared/data/quran/compareCards';
import corpus from '@shared/data/quran/trees.json';
import type { StoredCards } from '@shared/quran/compareCards';
import { dailyPair as pairOfDay, dayNumber } from '@shared/dailyPick';

let words: Map<string, string[]> | undefined;
const wordsOf = (key: string) => (words ??= new Map((corpus.ayat as { key: string; words: string[] }[]).map(ayah => [ayah.key, ayah.words]))).get(key);

/** Today's look-alike pair on this phone's calendar day. */
export const dailyPair = (date = new Date()) => pairOfDay(generated as unknown as StoredCards, wordsOf, dayNumber(date));
