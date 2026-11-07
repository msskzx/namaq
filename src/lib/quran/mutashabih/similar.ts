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

/** Lemmas the corpus spells apart that name the same thing, with the root the corpus leaves out. */
export const LEMMA_ALIASES: Record<string, { lemma: string; root: string }> = {
  'yahuwdiy~': { lemma: 'huwd2', root: 'hwd' }, // يهوديا and هودا: the Jews
};

/** The ayah with LEMMA_ALIASES applied, so aliased words match by lemma and have a root. */
export function withAliases(ayah: BranchAyah): BranchAyah {
  if (!ayah.lemmas?.some(lemma => lemma && LEMMA_ALIASES[lemma])) return ayah;
  const alias = (i: number) => LEMMA_ALIASES[ayah.lemmas![i] ?? ''];
  return {
    ...ayah,
    lemmas: ayah.lemmas.map((lemma, i) => alias(i)?.lemma ?? lemma),
    roots: ayah.words.map((_, i) => ayah.roots?.[i] ?? alias(i)?.root ?? null),
  };
}

/** Rootless lemmas that are names of people, peoples, places and books, so they count as content words when crossing. */
const NAMES = new Set(['<iboraAhiym', 'muwsaY`', 'firoEawon', 'jahan~am', '<isoraA}iyl', 'nuwH', 'maroyam', 'yuwsuf', 'luwT', 'vamuwd', 'A^dam', 'EiysaY', 'ha`ruwn', 't~aworaY`p', 'sulayoma`n', '<isoHaAq', 'yaEoquwb', 'daAwud', '<isomaAEiyl', '<injiyl', '<iboliys', 'masiyH', '$uEayob', 'Eadon', 'madoyan', 'zakariy~aA', 'ha`ma`n', 'yaHoyaY`', 'muHam~ad', '>ay~uwb', 'yuwnus', 'qa`ruwn', 'saqar', 'jiboriyl', 'jaAluwt', 'Eimora`n', '<iloyaAs', 'TaAluwt', 't~aAbuwt', '{loyasaEa', 'ya>ojuwj', 'ma>ojuwj', 'firodawos', '<idoriys', 'saba<', 'luqoma`n', 'tub~aE', 'miykaY`l', 'baAbil', 'ha`ruwt', 'ma`ruwt', 'S~afaA', 'marowap', 'ramaDaAn', 'Earafa`t', 'bak~ap', 'bador', 'A^zar', 'Hunayon', 'Euzayor', 'juwdiY~', 'sayonaA^\'', 'r~uwm', 'yavorib', 'zayod', 'mak~ap', '{ll~a`t', '{loEuz~aY`', 'manaw`p', '>aHomad', 'laZaY`', 'yaguwv', 'yaEuwq', '<iram', 'qurayo$', 'yahuwdiy~']);

const isContent = (ayah: BranchAyah, i: number) => Boolean(ayah.roots?.[i] || NAMES.has(ayah.lemmas?.[i] ?? ''));

/** Words with the same lemma that the in-order alignment left apart because they cross (هودا … إبراهيم / إبراهيم يهوديا). */
export function crossingColumns(a: BranchAyah, b: BranchAyah, taken: CompactColumn[]): CompactColumn[] {
  const usedA = new Set(taken.map(column => column[0]));
  const usedB = new Set(taken.map(column => column[1]));
  const columns: CompactColumn[] = [];
  a.words.forEach((_, i) => {
    const lemma = a.lemmas?.[i];
    if (usedA.has(i) || !lemma || !isContent(a, i)) return;
    const j = b.words.findIndex((__, k) => !usedB.has(k) && b.lemmas?.[k] === lemma);
    if (j < 0) return;
    usedA.add(i);
    usedB.add(j);
    columns.push([i, j, 'lemma']);
  });
  return columns;
}

const surahOf = (key: string) => Number(key.split(':')[0]);
const contentCount = (ayah: BranchAyah) => (ayah.roots ?? []).filter(Boolean).length;

const rootsOf = (ayah: BranchAyah) => new Set((ayah.roots ?? []).filter(Boolean) as string[]);

/** How rare each root is: log(ayat / ayat that hold the root). */
export function rootWeights(ayat: BranchAyah[]) {
  const counts = new Map<string, number>();
  for (const ayah of ayat) for (const root of rootsOf(ayah)) counts.set(root, (counts.get(root) ?? 0) + 1);
  return new Map([...counts].map(([root, count]) => [root, Math.log(ayat.length / count)]));
}

export function similarAyahPair(rawA: BranchAyah, rawB: BranchAyah, weights: Map<string, number>, criteria = COMPARE_CRITERIA): SimilarAyahPair | null {
  const [a, b] = [withAliases(rawA), withAliases(rawB)];
  const aligned: CompactColumn[] = compareAyat(a, b).columns
    .filter(column => column.level && column.a?.key === a.key && column.b?.key === b.key)
    .map(column => [column.a!.index, column.b!.index, column.level!]);
  // Only the in-order alignment decides whether the pair is similar: crossing matches of common words («الله»، «قال»)
  // would link far too many ayat. Crossing words are marked once the pair qualifies.
  const content = aligned.flatMap(([i, j]) => {
    const root = a.roots?.[i];
    return root && b.roots?.[j] ? [root] : [];
  });
  const longest = Math.max(contentCount(a), contentCount(b));
  const weight = [...new Set(content)].reduce((sum, root) => sum + (weights.get(root) ?? 0), 0);
  const whole = content.length >= criteria.minWholeWords && content.length === longest;
  if (weight < criteria.minWeight || !whole && (content.length < criteria.minWords || content.length / longest < criteria.minCoverage)) return null;
  return { a: a.key, b: b.key, columns: [...aligned, ...crossingColumns(a, b, aligned)] };
}

/** Every cross-surah ayah pair that meets the compare criteria, lower surah first. Candidates share two or more roots. */
export function similarAyat(source: BranchAyah[], criteria = COMPARE_CRITERIA): SimilarAyahPair[] {
  const ayat = source.map(withAliases);
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
