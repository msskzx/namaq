import { ALL_WORDS, cardWords, growthPlan } from '@shared/quran/growth';
import { type Branch, type Variant } from '@shared/quran/branches';

export { ALL_WORDS };

export const nodeId = (index: number) => `n${index}`;
export const lineId = (id: string) => `l:${id}`;

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

export type Beat = { step: number; key: string; ms: number; reveal: string[]; now: string[]; ask?: string;
  words?: number;
  path?: boolean };

export const LINE = 200;
export const BOX = 300;
export const RELIGHT = 140;
export const LEAF = 700;
export const PATH = 2500;

export type Starts = { id: string; keys: string[] }[];
export type Afters = Record<string, string>;

export function growthBeats(tree: Branch, { starts = [], afters = {}, ask = false, prefixes = [], paths = false, offsets = {} }: { starts?: Starts; afters?: Afters; ask?: boolean; prefixes?: Variant[];
  offsets?: Record<string, number>;
  paths?: boolean } = {}): Beat[] {
  const plan = growthPlan(tree, prefixes.map(prefix => prefix.keys));
  const beats: Beat[] = [];
  const shown = new Set<string>();
  const nodes = new Map<number, Branch>();
  const visit = (node: Branch) => { nodes.set(nodes.size - 1, node); node.children.forEach(visit); };
  visit(tree);
  plan.forEach((step, i) => {
    const mine = starts.filter(start => start.keys.includes(step.key));
    let words = mine.some(start => start.id.startsWith('p')) ? 0 : offsets[step.key] ?? 0;
    let afterEnd = false;
    const beat = (ms: number, reveal: string[], now: string[] = [], asked?: string) => {
      reveal.forEach(id => shown.add(id));
      beats.push({ step: i, key: step.key, ms, reveal, now, words, ...(asked && { ask: asked }) });
    };
    for (const start of mine) {
      if (start.id.startsWith('p')) words = offsets[step.key] ?? 0;
      if (shown.has(start.id)) beat(RELIGHT, [], [start.id]);
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

export const grownIds = (beats: Beat[]) => new Set(beats.flatMap(beat => beat.reveal));

export function connectionBeats(count: number, ask = false): Beat[] {
  return Array.from({ length: count }, (_, i) => [
    ...(ask ? [{ step: i, key: '', ms: 0, reveal: [], now: [], ask: `r${i}` }] : []),
    { step: i, key: '', ms: 700, reveal: [`r${i}`], now: [`r${i}`] },
    { step: i, key: '', ms: 500, reveal: [], now: [] },
  ]).flat();
}
