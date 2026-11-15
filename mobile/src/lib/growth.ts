import { growthPlan } from '@shared/quran/growth';
import { keys, type Branch, type Variant } from '@shared/quran/branches';

/**
 * Ids of what a tree card draws, shared by the tree, the growth studio and the video:
 * nodes `n<index>` (the root is n-1, then depth first, as the website numbers them),
 * words before the phrase `p<i>`, the ayah before an ayah `b<key>` (and one more, `e<key>`), the ayah after `a<key>`.
 * The connector into a box is `l:<id>`.
 */
export const nodeId = (index: number) => `n${index}`;
export const lineId = (id: string) => `l:${id}`;

/** Depth-first node numbers, the root first as -1. */
export function nodeIndices(tree: Branch) {
  const indices = new Map<Branch, number>();
  const visit = (node: Branch) => {
    indices.set(node, indices.size - 1);
    node.children.forEach(visit);
    if (node.rejoin) visit(node.rejoin);
  };
  visit(tree);
  return indices;
}

/** One beat of a growing tree: what it reveals, what it lights as just drawn, how long it lasts at 1×; an ask beat waits for the answer. */
export type Beat = { step: number; key: string; ms: number; reveal: string[]; now: string[]; ask?: string;
  /** While the ayah grows: how many of its words (from the ayah's start) the boxes drawn so far hold; its card under the tree shows those. */
  words?: number;
  /** After the tree has grown: the ayah's path lit on its own, with its ayah read in full. */
  path?: boolean };

// Milliseconds at 1×, as on the website: a connector, a box fading in, a box an earlier ayah drew lighting again, the pause at an ayah's end.
export const LINE = 200;
export const BOX = 300;
export const RELIGHT = 140;
export const LEAF = 700;
/** How long each ayah's path stays lit once the tree has grown. */
export const PATH = 2500;

/** The boxes drawn before the root for each ayah: words before the phrase, and the ayat before it with the surrounding switch. */
export type Starts = { id: string; keys: string[] }[];
/** The ayah after each ayah's end, drawn at the end of its branch. */
export type Afters = Record<string, string>;

/**
 * The website's growth (Grow.tsx) as data: each ayah walks from the root to its end, reusing what earlier ayat drew
 * and growing its own branch from where it splits. In ask mode the first new box of each ayah waits, empty, for the answer.
 */
/** Every word an ayah's card shows once its branch has grown. */
export const ALL_WORDS = 10000;
// Ayah ends (۝, ﴿٣﴾) are the card's ayah numbers, not words; a run into the next surah carries its basmala in the tree,
// which the card sets apart, so those four words are not the card's either.
const isEnd = (word: string) => word === '۝' || word.startsWith('﴿');
const letters = (word: string) => word.replace(/[أإآٱ]/g, 'ا').normalize('NFD').replace(/\u0640/g, '').replace(/[^\u0621-\u064A]/g, '');
const BASMALA = ['بسم', 'الله', 'الرحمن', 'الرحيم'];
function cardWords(words: string[], afterEnd: boolean): { count: number; afterEnd: boolean } {
  let count = 0;
  for (let i = 0; i < words.length; i++) {
    if (isEnd(words[i])) { afterEnd = true; continue; }
    if (afterEnd && BASMALA.every((word, j) => words[i + j] !== undefined && letters(words[i + j]) === word)) { i += BASMALA.length - 1; continue; }
    afterEnd = false;
    count++;
  }
  return { count, afterEnd };
}

export function growthBeats(tree: Branch, { starts = [], afters = {}, ask = false, prefixes = [], paths = false, offsets = {} }: { starts?: Starts; afters?: Afters; ask?: boolean; prefixes?: Variant[];
  /** Where the phrase starts in each ayah (the presentation's offsets): the words before it show with the box that draws them. */
  offsets?: Record<string, number>;
  /** Ends by lighting each ayah's path in turn, in the order the ayat grew. */
  paths?: boolean } = {}): Beat[] {
  const plan = growthPlan(tree, prefixes.map(prefix => prefix.keys));
  const beats: Beat[] = [];
  const shown = new Set<string>();
  // Numbered as growthPlan numbers them (children only, depth first, the root -1).
  const nodes = new Map<number, Branch>();
  const visit = (node: Branch) => { nodes.set(nodes.size - 1, node); node.children.forEach(visit); };
  visit(tree);
  plan.forEach((step, i) => {
    const mine = starts.filter(start => start.keys.includes(step.key));
    // The words before the phrase come with the box that draws them (a mixed tree's first box), else with the ayah's first beat.
    let words = mine.some(start => start.id.startsWith('p')) ? 0 : offsets[step.key] ?? 0;
    let afterEnd = false;
    const beat = (ms: number, reveal: string[], now: string[] = [], asked?: string) => {
      reveal.forEach(id => shown.add(id));
      beats.push({ step: i, key: step.key, ms, reveal, now, words, ...(asked && { ask: asked }) });
    };
    for (const start of mine) {
      if (start.id.startsWith('p')) words = offsets[step.key] ?? 0;
      if (shown.has(start.id)) beat(RELIGHT, [], [start.id]);
      // A box drawn before the root comes first, then the connector from it toward the root: the tree never opens on a connector.
      else { beat(BOX, [start.id], [start.id]); beat(LINE, [lineId(start.id)]); }
    }
    step.nodes.forEach((index, j) => {
      const id = nodeId(index);
      const counted = cardWords(nodes.get(index)!.words, afterEnd);
      afterEnd = counted.afterEnd;
      const more = counted.count;
      if (j < step.fresh) { words += more; beat(shown.has(id) ? RELIGHT : BOX, [id], [id]); return; }
      if (index >= 0) beat(LINE, [lineId(id)]);
      if (ask && j === step.fresh && index >= 0) beat(0, [], [], id);
      words += more;
      beat(BOX, [id], [id]);
    });
    const after = afters[step.key];
    if (after && !shown.has(after)) { beat(LINE, [lineId(after)]); beat(BOX, [after], [after]); }
    words = ALL_WORDS;
    beat(LEAF, []);
  });
  if (paths) plan.forEach(step => beats.push({ step: plan.length - 1, key: step.key, ms: PATH, reveal: [], now: [], path: true }));
  return beats;
}

/** Everything a growth can hide: every box and connector it reveals at some point. */
export const grownIds = (beats: Beat[]) => new Set(beats.flatMap(beat => beat.reveal));

/** The website's connections studio (Grow.tsx playMatrix): the matrix's lines one by one, `r<n>` in drawing order; ask waits before each. */
export function connectionBeats(count: number, ask = false): Beat[] {
  return Array.from({ length: count }, (_, i) => [
    ...(ask ? [{ step: i, key: '', ms: 0, reveal: [], now: [], ask: `r${i}` }] : []),
    { step: i, key: '', ms: 700, reveal: [`r${i}`], now: [`r${i}`] },
    { step: i, key: '', ms: 500, reveal: [], now: [] },
  ]).flat();
}

/** The ayah keys each node holds, for lighting the path of the ayah that is growing. */
export const nodeKeys = (tree: Branch) => new Map([...nodeIndices(tree)].map(([node, index]) => [nodeId(index), keys(node)]));
