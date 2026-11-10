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
  };
  visit(tree);
  return indices;
}

/** One beat of a growing tree: what it reveals, what it lights as just drawn, how long it lasts at 1×; an ask beat waits for the answer. */
export type Beat = { step: number; key: string; ms: number; reveal: string[]; now: string[]; ask?: string };

// Milliseconds at 1×, as on the website: a connector, a box fading in, a box an earlier ayah drew lighting again, the pause at an ayah's end.
export const LINE = 200;
export const BOX = 300;
export const RELIGHT = 140;
export const LEAF = 700;

/** The boxes drawn before the root for each ayah: words before the phrase, and the ayat before it with the surrounding switch. */
export type Starts = { id: string; keys: string[] }[];
/** The ayah after each ayah's end, drawn at the end of its branch. */
export type Afters = Record<string, string>;

/**
 * The website's growth (Grow.tsx) as data: each ayah walks from the root to its end, reusing what earlier ayat drew
 * and growing its own branch from where it splits. In ask mode the first new box of each ayah waits, empty, for the answer.
 */
export function growthBeats(tree: Branch, { starts = [], afters = {}, ask = false, prefixes = [] }: { starts?: Starts; afters?: Afters; ask?: boolean; prefixes?: Variant[] } = {}): Beat[] {
  const plan = growthPlan(tree, prefixes.map(prefix => prefix.keys));
  const beats: Beat[] = [];
  const shown = new Set<string>();
  plan.forEach((step, i) => {
    const beat = (ms: number, reveal: string[], now: string[] = [], asked?: string) => {
      reveal.forEach(id => shown.add(id));
      beats.push({ step: i, key: step.key, ms, reveal, now, ...(asked && { ask: asked }) });
    };
    for (const start of starts.filter(start => start.keys.includes(step.key))) {
      if (shown.has(start.id)) beat(RELIGHT, [], [start.id]);
      // A box drawn before the root comes first, then the connector from it toward the root: the tree never opens on a connector.
      else { beat(BOX, [start.id], [start.id]); beat(LINE, [lineId(start.id)]); }
    }
    step.nodes.forEach((index, j) => {
      const id = nodeId(index);
      if (j < step.fresh) { beat(shown.has(id) ? RELIGHT : BOX, [id], [id]); return; }
      if (index >= 0) beat(LINE, [lineId(id)]);
      if (ask && j === step.fresh && index >= 0) beat(0, [], [], id);
      beat(BOX, [id], [id]);
    });
    const after = afters[step.key];
    if (after && !shown.has(after)) { beat(LINE, [lineId(after)]); beat(BOX, [after], [after]); }
    beat(LEAF, []);
  });
  return beats;
}

/** Everything a growth can hide: every box and connector it reveals at some point. */
export const grownIds = (beats: Beat[]) => new Set(beats.flatMap(beat => beat.reveal));

/** The ayah keys each node holds, for lighting the path of the ayah that is growing. */
export const nodeKeys = (tree: Branch) => new Map([...nodeIndices(tree)].map(([node, index]) => [nodeId(index), keys(node)]));
