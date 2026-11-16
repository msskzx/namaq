import { num } from './arabicNumber';
import { letters, sharedDisplay } from './phraseTrees';
import { END, type Branch } from './branches';
import { likeness } from './wordMatch';
import type { CardAyah, CardMark, CardSide } from './compareCards';

/** Word ranges [start, end) on each of the two sides. */
export type Span = [number, number];
/** A stretch both sides say alike (`shared`), or where they part (`split`; either span may be empty). */
export type Strand = { kind: 'shared' | 'split'; a: Span; b: Span };

/** Shared runs shorter than this stay inside a split, so a lone «من» or «الله» does not pinch the two strands together. */
export const MIN_SHARED = 2;

/** The spelling a braid compares, as the branches trees group words: letters only, hamza seats made one, a leading و/ف kept so «وكلا» and «فكلا» stay apart. */
const key = (word: string) => letters(word);

/**
 * Two word lists as a braid: the strands part where the wording differs and rejoin on each common stretch of
 * at least MIN_SHARED words (longest common subsequence by letters, as the branches trees compare words). Covers both lists in order.
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

/** One word of a braid: its text, its ayah, its mark on the card, the ayah number after it when it ends an ayah, and `moved` when it
 * moved out of a common stretch because the two sides write it differently (foldStrands). */
export type BraidWord = { text: string; ayah: number; mark?: CardMark; end?: number; moved?: true };
export type BraidStrand = { kind: Strand['kind']; a: BraidWord[]; b: BraidWord[] };

const flat = (ayat: CardAyah[]): BraidWord[] => ayat.flatMap(ayah => ayah.words.map((text, i) => ({
  text, ayah: ayah.number, mark: ayah.marks?.[i], ...(i === ayah.words.length - 1 ? { end: ayah.number } : {}),
})));

/** Two words the braid pairs as one but the sides write differently. */
const apart = (a: BraidWord, b: BraidWord) => likeness([a.text, b.text]) !== 'exact';

/**
 * The branches trees' rule for a word written differently (docs/adr/0036), on a braid: the first word of a common stretch joins
 * the parted words before it, and its last word the parted words after it, each side keeping its own writing. A common stretch left
 * with no words lets the parts around it run on as one. The first stretch keeps at least one word, as a tree's trunk does.
 */
export function foldStrands(strands: BraidStrand[]): BraidStrand[] {
  const out = strands.map(strand => ({ kind: strand.kind, a: [...strand.a], b: [...strand.b] }));
  const move = (word: BraidWord): BraidWord => ({ ...word, moved: true });
  for (let i = 0; i < out.length; i++) {
    const strand = out[i];
    if (strand.kind !== 'shared') continue;
    const before = out[i - 1]?.kind === 'split' ? out[i - 1] : undefined;
    const after = out[i + 1]?.kind === 'split' ? out[i + 1] : undefined;
    if (before && strand.a.length && apart(strand.a[0], strand.b[0])) {
      before.a.push(move(strand.a.shift()!));
      before.b.push(move(strand.b.shift()!));
    }
    const keep = before || i > 0 ? 0 : 1;
    if (after && strand.a.length > keep && apart(strand.a[strand.a.length - 1], strand.b[strand.b.length - 1])) {
      after.a.unshift(move(strand.a.pop()!));
      after.b.unshift(move(strand.b.pop()!));
    }
    if (strand.a.length) continue;
    if (before && after) {
      before.a.push(...after.a);
      before.b.push(...after.b);
      out.splice(i, 2);
    } else out.splice(i, 1);
    i--;
  }
  return out;
}

/** A card's two sides as a braid: one tree for a pair, parting and rejoining, with words the sides write differently folded into the parts (foldStrands). */
export function braidOf(sides: [CardSide, CardSide]): BraidStrand[] {
  const a = flat(sides[0].ayat);
  const b = flat(sides[1].ayat);
  return foldStrands(braid(a.map(word => word.text), b.map(word => word.text))
    .map(strand => ({ kind: strand.kind, a: a.slice(...strand.a), b: b.slice(...strand.b) })));
}

/** `side`: the side a node belongs to, on a node of one side only. */
export type CompareTree = { tree: Branch; sides: Map<Branch, 0 | 1> };

/** The path key of a card side: its surah and first ayah. */
export const sideKey = (side: CardSide) => `${side.surah}:${side.ayah}`;

const sign = (ends: number[]) => (ends.length > 1 ? END : `﴿${num(ends[0])}﴾`);

/**
 * A node of one side as the branches tree draws it: an ayah's end sign after its last word, and each word's likeness (its mark on
 * the card, written where the other side writes the word differently: writtenLinks, or moved here for that: foldStrands).
 */
function one(words: BraidWord[], written: Set<string>): Pick<Branch, 'words' | 'tones'> {
  const out: string[] = [];
  const tones: Branch['tones'] = [];
  for (const word of words) {
    const mark = word.mark;
    out.push(word.text);
    tones.push(word.moved || (mark?.kind === 'exact' && mark.link && written.has(mark.link)) ? 'written' : mark?.kind);
    if (word.end !== undefined) { out.push(sign([word.end])); tones.push(undefined); }
  }
  return { words: out, tones };
}

/**
 * A node both sides share, as the branches tree builds one (phraseTrees `grow`): each word in the writing both sides share, with
 * each side's own writing in `forms` where they differ, so the tree draws it as a braid; an ayah's end sign after its last word
 * (one empty sign where two ayat with different numbers end together).
 */
function both(a: BraidWord[], b: BraidWord[], surahs: [number, number]): Pick<Branch, 'words' | 'tones' | 'forms'> {
  const out: string[] = [];
  const tones: Branch['tones'] = [];
  const forms: [string[], string[]] = [[], []];
  a.forEach((word, i) => {
    const partner = b[i];
    const differ = apart(word, partner);
    out.push(differ ? sharedDisplay([word.text, partner.text]) : word.text);
    forms[0].push(word.text);
    forms[1].push(partner.text);
    tones.push(differ ? undefined : 'exact');
    const ends = [...new Set([word.end, partner.end].filter((end): end is number => end !== undefined))];
    if (ends.length) { out.push(sign(ends)); forms[0].push(sign(ends)); forms[1].push(sign(ends)); tones.push(undefined); }
  });
  // Each writing is named by the ayah it is written in (the first word the sides write differently), so a braid's strand names its own ayah.
  const at = a.findIndex((word, i) => apart(word, b[i]));
  const keys = at < 0 ? [] : [`${surahs[0]}:${a[at].ayah}`, `${surahs[1]}:${b[at].ayah}`];
  return { words: out, tones, ...(at >= 0 && keys[0] !== keys[1] ? { forms: { [keys[0]]: forms[0], [keys[1]]: forms[1] } } : {}) };
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
 * node both share names the ayat that end in it (`holds`), as a branches box names the ayat it ends. Where one side has no words
 * between two common stretches its child has none either, and the tree draws its line straight through.
 */
export function compareTree(sides: [CardSide, CardSide], written: Set<string> = new Set()): CompareTree {
  const strands = braidOf(sides);
  const ends = sides.map(sideKey) as [string, string];
  const all = [...new Set(ends)];
  const owner = new Map<Branch, 0 | 1>();
  const part = (words: BraidWord[], side: 0 | 1): Branch => {
    const branch: Branch = { ...one(words, written), ayat: [], children: [], via: [ends[side]], holds: runs(sides[side].surah, words.map(word => word.ayah)) };
    owner.set(branch, side);
    return branch;
  };
  const common = (a: BraidWord[], b: BraidWord[]): Branch => {
    const ending = [a, b].flatMap((words, side) => runs(sides[side].surah, words.flatMap(word => (word.end === undefined ? [] : [word.end]))));
    return { ...both(a, b, [sides[0].surah, sides[1].surah]), ayat: [], children: [], via: all, holds: ending };
  };
  // The box each side's last word is in, which the ayah after it hangs from (`ayat`, as on a branches box that ends an ayah).
  const last: (Branch | undefined)[] = [undefined, undefined];
  const note = (node: Branch, a: BraidWord[], b: BraidWord[]) => { if (a.length) last[0] = node; if (b.length) last[1] = node; return node; };
  const root = strands[0]?.kind === 'shared' ? note(common(strands[0].a, strands[0].b), strands[0].a, strands[0].b) : { words: [], ayat: [], children: [], via: all } as Branch;
  let at = root;
  strands.forEach((strand, i) => {
    if (at === root && i === 0 && strand.kind === 'shared') return;
    if (strand.kind === 'split') {
      // A side with no words gets a child (a line running straight on) only between two common stretches: not before the first
      // or after the last, where a line would come from nothing or lead nowhere. A side that tells nothing of a story part keeps
      // its child, for its note.
      const between = i > 0 && i < strands.length - 1;
      at.children = [note(part(strand.a, 0), strand.a, []), note(part(strand.b, 1), [], strand.b)].filter((child, side) => child.words.length || between || !sides[side].ayat.length);
      return;
    }
    const next = note(common(strand.a, strand.b), strand.a, strand.b);
    at.rejoin = next;
    at = next;
  });
  // Its `through` names the side's last ayah, so the ayah after is found after it (ayahEnds).
  last.forEach((node, side) => {
    if (!node) return;
    node.ayat.push(ends[side]);
    node.through = { ...node.through, [ends[side]]: `${sides[side].surah}:${Math.max(...sides[side].ayat.map(ayah => ayah.number))}` };
  });
  return { tree: root, sides: owner };
}
