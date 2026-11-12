import { num } from './arabicNumber';
import { normalizeWord } from './normalize';
import type { CardAyah, CardMark, CardSide } from './compareCards';

/** Word ranges [start, end) on each of the two sides. */
export type Span = [number, number];
/** A stretch both sides say alike (`shared`), or where they part (`split`; either span may be empty). */
export type Strand = { kind: 'shared' | 'split'; a: Span; b: Span };

/** Shared runs shorter than this stay inside a split, so a lone «من» or «الله» does not pinch the two strands together. */
export const MIN_SHARED = 2;

/** The spelling a braid compares: letters only, a leading و/ف kept so «وكلا» and «فكلا» stay apart. */
const key = (word: string) => normalizeWord(word);

/**
 * Two word lists as a braid: the strands part where the wording differs and rejoin on each common stretch of
 * at least MIN_SHARED words (longest common subsequence by letters, tashkeel ignored). Covers both lists in order.
 */
export function braid(a: string[], b: string[], minShared = MIN_SHARED): Strand[] {
  const x = a.map(key);
  const y = b.map(key);
  const table = Array.from({ length: x.length + 1 }, () => new Array<number>(y.length + 1).fill(0));
  for (let i = x.length - 1; i >= 0; i--) for (let j = y.length - 1; j >= 0; j--) {
    table[i][j] = x[i] === y[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
  }
  const matches: [number, number][] = [];
  for (let i = 0, j = 0; i < x.length && j < y.length;) {
    if (x[i] === y[j]) matches.push([i++, j++]);
    else if (table[i + 1][j] >= table[i][j + 1]) i++;
    else j++;
  }
  // Consecutive matches on both sides form a run; only long enough runs join the strands.
  const runs: { a: Span; b: Span }[] = [];
  for (const [i, j] of matches) {
    const last = runs.at(-1);
    if (last && last.a[1] === i && last.b[1] === j) { last.a[1]++; last.b[1]++; }
    else runs.push({ a: [i, i + 1], b: [j, j + 1] });
  }
  const strands: Strand[] = [];
  let at: [number, number] = [0, 0];
  for (const run of runs.filter(run => run.a[1] - run.a[0] >= minShared)) {
    if (run.a[0] > at[0] || run.b[0] > at[1]) strands.push({ kind: 'split', a: [at[0], run.a[0]], b: [at[1], run.b[0]] });
    strands.push({ kind: 'shared', a: run.a, b: run.b });
    at = [run.a[1], run.b[1]];
  }
  if (at[0] < x.length || at[1] < y.length) strands.push({ kind: 'split', a: [at[0], x.length], b: [at[1], y.length] });
  return strands;
}

/** One word of a braid: its text, its mark on the card, the ayah number after it when it ends an ayah, and `skip` (its ayah number) when it opens an ayah that does not follow the last. */
export type BraidWord = { text: string; mark?: CardMark; end?: number; skip?: number };
export type BraidStrand = { kind: Strand['kind']; a: BraidWord[]; b: BraidWord[] };

const flat = (ayat: CardAyah[]): BraidWord[] => ayat.flatMap((ayah, k) => ayah.words.map((text, i) => ({
  text, mark: ayah.marks?.[i], ...(i === ayah.words.length - 1 ? { end: ayah.number } : {}),
  ...(i === 0 && k > 0 && ayah.number !== ayat[k - 1].number + 1 ? { skip: ayah.number } : {}),
})));

/** A card's two sides as a braid: one tree for a pair, parting and rejoining. */
export function braidOf(sides: [CardSide, CardSide]): BraidStrand[] {
  const a = flat(sides[0].ayat);
  const b = flat(sides[1].ayat);
  return braid(a.map(word => word.text), b.map(word => word.text))
    .map(strand => ({ kind: strand.kind, a: a.slice(...strand.a), b: b.slice(...strand.b) }));
}

/**
 * The ayah-end marker after a word. The Quran font draws each number as its own medallion, so where two
 * ayat with different numbers end together it shows one empty medallion; the side headers carry the numbers.
 */
export const endMark = (ends: number[], ar: boolean) => ends.length > 1 ? '\u06DD' : ends.length ? (ar ? num(ends[0]) : `${ends[0]}`) : '';
