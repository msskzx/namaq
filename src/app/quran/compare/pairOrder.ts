import type { SurahPair } from '@/lib/quran/mutashabih/pairs';

/** One stop when stepping through pages: a surah pair seen from `lead`, the surah being browsed. */
export type Visit = { lead: number; other: number; pair: SurahPair };

/**
 * The pages in the order the side pane lists them in mushaf order: under each surah, every pair it is in,
 * so a pair comes twice (once under each of its surahs). Swiping walks this list, so after opening 3·2
 * from under surah 3 the next page is 3·4, not 2·4.
 */
export function surahOrder(pairs: SurahPair[]): Visit[] {
  const groups = new Map<number, Visit[]>();
  for (const pair of pairs) {
    for (const [lead, other] of [[pair.a, pair.b], [pair.b, pair.a]]) groups.set(lead, [...(groups.get(lead) ?? []), { lead, other, pair }]);
  }
  return [...groups.keys()].sort((x, y) => x - y).flatMap(n => groups.get(n)!);
}
