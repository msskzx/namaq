import generated from '@shared/data/quran/compareCards';
import corpus from '@shared/data/quran/trees.json';
import type { PairCard, StoredCards } from '@shared/quran/compareCards';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { dailyIndex, dailyPair as pairOfDay, dayNumber, feedTrees } from '@shared/dailyPick';
import { treeList } from './branches';

let words: Map<string, string[]> | undefined;
const wordsOf = (key: string) => (words ??= new Map((corpus.ayat as { key: string; words: string[] }[]).map(ayah => [ayah.key, ayah.words]))).get(key);

const pairs = new Map<number, PairCard | undefined>();
/** The look-alike pair for a day number; the feed walks on to the next days' pairs when it loads more. */
export function pairOfDayNumber(day: number) {
  if (!pairs.has(day)) pairs.set(day, pairOfDay(generated as unknown as StoredCards, wordsOf, day));
  return pairs.get(day);
}

/** Today's look-alike pair on this phone's calendar day. */
export const dailyPair = (date = new Date()) => pairOfDayNumber(dayNumber(date));

let fits: BranchPiece[] | undefined;
/** The feed's tree for a day, `offset` trees on: mid-sized trees from the kept ones, in mushaf order from the day's place. */
export function treeOfDay(day: number, offset = 0) {
  fits ??= feedTrees(treeList());
  return fits.length ? fits[(dailyIndex(day, fits.length) + offset) % fits.length] : undefined;
}
