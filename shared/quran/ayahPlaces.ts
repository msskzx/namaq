import { num } from './arabicNumber';

/** Where a post's ayat are, for its head: «البقرة ٦١ · آل عمران ٢١، ١١٢», surah first, in the mushaf's order. */
export function ayahPlaces(keys: string[], names: Record<number, string>) {
  const bySurah = new Map<number, number[]>();
  for (const key of keys) {
    const [surah, ayah] = key.split(':').map(Number);
    bySurah.set(surah, [...(bySurah.get(surah) ?? []), ayah]);
  }
  return [...bySurah].sort(([a], [b]) => a - b).map(([surah, ayat]) => `${names[surah] ?? num(surah)} ${[...new Set(ayat)].sort((a, b) => a - b).map(num).join('، ')}`).join(' · ');
}
