import type { BranchAyah } from '../branches';
import { compareAyat } from './engine';
import type { Level } from './types';

/** Compare page criteria on the متشابه engine's word alignment: shorter ayat that share a few words, lemmas or roots
 *  count, unlike the long near-identical ayat the branches page asks for. Only content words (words with a root) count. */
export const COMPARE_CRITERIA = {
  minWords: 3,
  minCoverage: 0.35,
  /** Sum of log(ayat / ayat with the root) over the distinct matched roots, so «قال … رب العالمين» alone is not enough. */
  minWeight: 7,
  /** Two matched content words are enough when they are all the content words of both ayat («إلا عبادك منهم المخلصين»). */
  minWholeWords: 2,
};

/** [a ayah index, b ayah index, level] of one matched word. */
export type CompactColumn = [number, number, Level];
export type SimilarAyahPair = { a: string; b: string; columns: CompactColumn[] };

const surahOf = (key: string) => Number(key.split(':')[0]);
const contentCount = (ayah: BranchAyah) => (ayah.roots ?? []).filter(Boolean).length;

const rootsOf = (ayah: BranchAyah) => new Set((ayah.roots ?? []).filter(Boolean) as string[]);

/** How rare each root is: log(ayat / ayat that hold the root). */
export function rootWeights(ayat: BranchAyah[]) {
  const counts = new Map<string, number>();
  for (const ayah of ayat) for (const root of rootsOf(ayah)) counts.set(root, (counts.get(root) ?? 0) + 1);
  return new Map([...counts].map(([root, count]) => [root, Math.log(ayat.length / count)]));
}

export function similarAyahPair(a: BranchAyah, b: BranchAyah, weights: Map<string, number>, criteria = COMPARE_CRITERIA): SimilarAyahPair | null {
  const matched = compareAyat(a, b).columns.filter(column => column.level && column.a?.key === a.key && column.b?.key === b.key);
  const content = matched.flatMap(column => {
    const root = a.roots?.[column.a!.index];
    return root && b.roots?.[column.b!.index] ? [root] : [];
  });
  const longest = Math.max(contentCount(a), contentCount(b));
  const weight = [...new Set(content)].reduce((sum, root) => sum + (weights.get(root) ?? 0), 0);
  const whole = content.length >= criteria.minWholeWords && content.length === longest;
  if (weight < criteria.minWeight || !whole && (content.length < criteria.minWords || content.length / longest < criteria.minCoverage)) return null;
  return { a: a.key, b: b.key, columns: matched.map(column => [column.a!.index, column.b!.index, column.level!]) };
}

/** Every cross-surah ayah pair that meets the compare criteria, lower surah first. Candidates share two or more roots. */
export function similarAyat(ayat: BranchAyah[], criteria = COMPARE_CRITERIA): SimilarAyahPair[] {
  const n = ayat.length;
  const weights = rootWeights(ayat);
  const postings = new Map<string, number[]>();
  ayat.forEach((ayah, i) => rootsOf(ayah).forEach(root => postings.set(root, [...(postings.get(root) ?? []), i])));
  const shared = new Uint8Array(n * n);
  for (const list of postings.values()) for (let p = 0; p < list.length; p++) for (let q = p + 1; q < list.length; q++) {
    const k = list[p] * n + list[q];
    if (shared[k] < 255) shared[k]++;
  }
  const pairs: SimilarAyahPair[] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    if (shared[i * n + j] < criteria.minWholeWords || surahOf(ayat[i].key) === surahOf(ayat[j].key)) continue;
    const pair = similarAyahPair(ayat[i], ayat[j], weights, criteria);
    if (pair) pairs.push(pair);
  }
  return pairs;
}
