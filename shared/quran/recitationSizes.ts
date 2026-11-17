import sizes from '../data/quran/recitationSizes.json';
import type { Memorized } from '../memorized';

/**
 * Each reciter's file sizes, summed by surah and by juz (`npm run quran:recitation-sizes` reads every ayah file's size from
 * the server), so a download's size shows before it starts.
 */
type Sizes = { surah: number[]; juz: number[] };
const table = sizes as Record<string, Sizes>;
const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

export function packBytes(reciter: number, what: { surah?: number; memorized?: Memorized | null }): number {
  const row = table[String(reciter)];
  if (!row) return 0;
  if (what.surah) return row.surah[what.surah - 1] ?? 0;
  const memorized = what.memorized;
  if (!memorized || 'all' in memorized) return sum(row.surah);
  const by = memorized.unit === 'juz' ? row.juz : row.surah;
  return sum(memorized.picked.map(n => by[n - 1] ?? 0));
}
