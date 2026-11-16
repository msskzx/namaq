import { num } from './arabicNumber';
import { normalizeWord } from './normalize';
import { END, type Branch } from './branches';
import { likeness } from './wordMatch';
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

/** One word of a braid: its text, its ayah, its mark on the card, the ayah number after it when it ends an ayah, and `skip` (its ayah number) when it opens an ayah that does not follow the last. */
export type BraidWord = { text: string; ayah: number; mark?: CardMark; end?: number; skip?: number };
export type BraidStrand = { kind: Strand['kind']; a: BraidWord[]; b: BraidWord[] };

const flat = (ayat: CardAyah[]): BraidWord[] => ayat.flatMap((ayah, k) => ayah.words.map((text, i) => ({
  text, ayah: ayah.number, mark: ayah.marks?.[i], ...(i === ayah.words.length - 1 ? { end: ayah.number } : {}),
  ...(i === 0 && k > 0 && ayah.number !== ayat[k - 1].number + 1 ? { skip: ayah.number } : {}),
})));

/** A card's two sides as a braid: one tree for a pair, parting and rejoining. */
export function braidOf(sides: [CardSide, CardSide]): BraidStrand[] {
  const a = flat(sides[0].ayat);
  const b = flat(sides[1].ayat);
  return braid(a.map(word => word.text), b.map(word => word.text))
    .map(strand => ({ kind: strand.kind, a: a.slice(...strand.a), b: b.slice(...strand.b) }));
}

/** `side`: the side a node belongs to, on a node of one side only. */
export type CompareTree = { tree: Branch; sides: Map<Branch, 0 | 1> };

/** The path key of a card side: its surah and first ayah. */
export const sideKey = (side: CardSide) => `${side.surah}:${side.ayah}`;

/** Where the sides' wording leaves out ayat: the mark before the first word after the gap. */
export const SKIP = '⋯';

/**
 * A node's words as the branches tree draws them: an ayah's end sign after its last word (one empty sign where two ayat with
 * different numbers end together), and each word's likeness (on a node both sides share, exact or written differently; on a
 * node of one side, its mark on the card, written where the other side writes the word differently: writtenLinks).
 */
function shown(words: BraidWord[], other: BraidWord[] | undefined, written: Set<string>): Pick<Branch, 'words' | 'tones'> {
  const out: string[] = [];
  const tones: Branch['tones'] = [];
  words.forEach((word, i) => {
    const partner = other?.[i];
    if (word.skip) { out.push(SKIP); tones.push(undefined); }
    out.push(word.text);
    const mark = word.mark;
    tones.push(partner ? (likeness([partner.text, word.text]) === 'written' ? 'written' : 'exact')
      : mark?.kind === 'exact' && mark.link && written.has(mark.link) ? 'written' : mark?.kind);
    const ends = [...new Set([word.end, partner?.end].filter((end): end is number => end !== undefined))];
    if (ends.length) { out.push(ends.length > 1 ? END : `﴿${num(ends[0])}﴾`); tones.push(undefined); }
  });
  return { words: out, tones };
}

/** Ayah numbers as runs of consecutive ayat, so a box whose ayat skip part of the surah names each stretch. */
function runs(surah: number, numbers: number[]): string[][] {
  const out: number[][] = [];
  for (const n of new Set(numbers)) {
    const last = out.at(-1);
    if (last && n === last[last.length - 1] + 1) last.push(n);
    else out.push([n]);
  }
  return out.map(run => run.map(n => `${surah}:${n}`));
}

/**
 * A card's two sides as one tree for the branches tree to draw: a node where both say the same words, a child for each side where
 * they part (the first side first), and `rejoin` where they meet again. Every node names the sides through it in `via`, so tapping
 * a box lights its side's path. A card that opens apart has a root with no words. A node of one side names the ayat it holds; a
 * node both share names the ayat that end in it (`holds`), as a branches box names the ayat it ends.
 */
export function compareTree(sides: [CardSide, CardSide], written: Set<string> = new Set()): CompareTree {
  const strands = braidOf(sides);
  const ends = sides.map(sideKey);
  const both = [...new Set(ends)];
  const owner = new Map<Branch, 0 | 1>();
  const one = (words: BraidWord[], side: 0 | 1): Branch => {
    const branch: Branch = { ...shown(words, undefined, written), ayat: [], children: [], via: [ends[side]], holds: runs(sides[side].surah, words.map(word => word.ayah)) };
    owner.set(branch, side);
    return branch;
  };
  const common = (a: BraidWord[], b: BraidWord[]): Branch => {
    const ending = [a, b].flatMap((words, side) => runs(sides[side].surah, words.flatMap(word => (word.end === undefined ? [] : [word.end]))));
    return { ...shown(a, b, written), ayat: [], children: [], via: both, holds: ending };
  };
  // The box each side's last word is in, which the ayah after it hangs from (`ayat`, as on a branches box that ends an ayah).
  const last: (Branch | undefined)[] = [undefined, undefined];
  const note = (node: Branch, a: BraidWord[], b: BraidWord[]) => { if (a.length) last[0] = node; if (b.length) last[1] = node; return node; };
  const root = strands[0]?.kind === 'shared' ? note(common(strands[0].a, strands[0].b), strands[0].a, strands[0].b) : { words: [], ayat: [], children: [], via: both } as Branch;
  let at = root;
  for (const strand of strands.slice(strands[0]?.kind === 'shared' ? 1 : 0)) {
    if (strand.kind === 'split') {
      at.children = [note(one(strand.a, 0), strand.a, []), note(one(strand.b, 1), [], strand.b)];
      continue;
    }
    const next = note(common(strand.a, strand.b), strand.a, strand.b);
    at.rejoin = next;
    at = next;
  }
  // Its `through` names the side's last ayah, so the ayah after is found after it (ayahEnds).
  last.forEach((node, side) => {
    if (!node) return;
    node.ayat.push(ends[side]);
    node.through = { ...node.through, [ends[side]]: `${sides[side].surah}:${Math.max(...sides[side].ayat.map(ayah => ayah.number))}` };
  });
  return { tree: root, sides: owner };
}
