/** A surah a tree's ayat come from, with those ayat (in mushaf order). */
export type TreeSurah = { surah: number; ayahKeys: string[] };

const parts = (key: string) => key.split(':').map(Number) as [number, number];

/** The surahs a tree's ayat come from, in mushaf order: the chips under a branches tree. */
export function treeSurahs(ayahKeys: readonly string[]): TreeSurah[] {
  const bySurah = new Map<number, string[]>();
  for (const key of new Set(ayahKeys)) {
    const [surah] = parts(key);
    bySurah.set(surah, [...(bySurah.get(surah) ?? []), key]);
  }
  return [...bySurah].sort(([a], [b]) => a - b).map(([surah, keys]) => ({ surah, ayahKeys: keys.sort((a, b) => parts(a)[1] - parts(b)[1]) }));
}
