// docs/plans/quran-compare-page.md
import { sharedSlots, wordDiff } from './wordDiff';

export const MIN_RUN = 2;
export const MAX_STEP_GAP = 5;
export const KEEP_RUN = 4;
export const TAIL_COUNT = 5;
export const DIAGONAL_BONUS = 32;

export type Pair = { a: number; b: number; run: number; shared: string[]; marksA: number[]; marksB: number[] };
export type Block = { kind: 'words' | 'count'; anchors: number; pairs: Pair[] };
export type Range = { from: number; to: number } | null;
export type Row = { type: 'block'; block: Block } | { type: 'gap'; a: Range; b: Range };

type Anchor = { i: number; j: number; run: number };

function longestRun(x: string[], y: string[]): number {
  let best = 0;
  let prev = new Array<number>(y.length + 1).fill(0);
  for (let i = 1; i <= x.length; i++) {
    const row = new Array<number>(y.length + 1).fill(0);
    for (let j = 1; j <= y.length; j++) {
      if (x[i - 1] === y[j - 1]) {
        row[j] = prev[j - 1] + 1;
        if (row[j] > best) best = row[j];
      }
    }
    prev = row;
  }
  return best;
}

function pairOf(a: number, b: number, x: string[], y: string[]): Pair {
  const inY = new Set(y);
  const shared = [...new Set(x.filter(w => inY.has(w)))];
  const diff = shared.length === 0 ? { a: x.map((_, k) => k), b: y.map((_, k) => k) } : wordDiff(x, y);
  return { a, b, run: longestRun(x, y), shared, marksA: diff.a, marksB: diff.b };
}

function anchorsOf(a: string[][], b: string[][]): Anchor[] {
  const width = b.length + 1;
  const size = (a.length + 1) * width;
  const run = new Array<number>(size).fill(0);
  const best = new Array<number>(size).fill(0);
  const top = new Array<number>(size).fill(-1);
  const ended = new Array<number>(size).fill(-1);
  const before = new Array<number>(size).fill(-1);
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const k = i * width + j;
      const from = best[k - width] >= best[k - 1] ? k - width : k - 1;
      best[k] = best[from];
      top[k] = top[from];
      run[k] = longestRun(a[i - 1], b[j - 1]);
      if (run[k] < MIN_RUN) continue;
      let viaDiagonal = -1;
      let behind = -1;
      for (let s = 1; s <= MAX_STEP_GAP && s < Math.min(i, j); s++) {
        const q = k - s * (width + 1);
        if (ended[q] >= 0 && Math.max(run[k], run[q]) >= KEEP_RUN && ended[q] + DIAGONAL_BONUS > viaDiagonal) {
          viaDiagonal = ended[q] + DIAGONAL_BONUS;
          behind = q;
        }
      }
      const d = k - width - 1;
      ended[k] = run[k] * run[k] + Math.max(best[d], viaDiagonal);
      before[k] = viaDiagonal > best[d] ? behind : top[d];
      if (ended[k] >= best[k]) {
        best[k] = ended[k];
        top[k] = k;
      }
    }
  }
  const found: Anchor[] = [];
  for (let k = top[size - 1]; k >= 0; k = before[k]) found.push({ i: Math.floor(k / width), j: k % width, run: run[k] });
  found.reverse();
  const extras: Anchor[] = [];
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) if (run[i * width + j] >= KEEP_RUN) extras.push({ i, j, run: run[i * width + j] });
  }
  const taken = (c: Anchor) => found.some(f => f.i === c.i && f.j === c.j);
  const shares = (c: Anchor) => found.some(f => (f.i === c.i && Math.abs(f.j - c.j) === 1) || (f.j === c.j && Math.abs(f.i - c.i) === 1));
  const inOrder = (c: Anchor) => found.every(f => (f.i <= c.i && f.j <= c.j) || (f.i >= c.i && f.j >= c.j));
  for (const c of extras.sort((p, q) => q.run - p.run)) if (!taken(c) && shares(c) && inOrder(c)) found.push(c);
  return found.sort((p, q) => p.i - q.i || p.j - q.j);
}

export type Group = { as: number[]; bs: number[]; pairs: Pair[] };

export function groupPairs(pairs: Pair[]): Group[] {
  const groups: Group[] = [];
  for (const p of pairs) {
    const group = groups[groups.length - 1];
    const prev = group?.pairs[group.pairs.length - 1];
    if (group && prev && (prev.a === p.a || prev.b === p.b)) {
      group.pairs.push(p);
      if (!group.as.includes(p.a)) group.as.push(p.a);
      if (!group.bs.includes(p.b)) group.bs.push(p.b);
    } else groups.push({ as: [p.a], bs: [p.b], pairs: [p] });
  }
  return groups;
}

export function wordSlots(group: Group, side: 'a' | 'b', ayah: number, count: number): Record<number, number> {
  const slots: Record<number, number> = {};
  group.pairs.forEach((p, k) => {
    if (p[side] === ayah) sharedSlots(count, side === 'a' ? p.marksA : p.marksB, k, slots);
  });
  return slots;
}

export function clampRange(from: unknown, to: unknown, count: number): { from: number; to: number } {
  const pick = (v: unknown, fallback: number) => {
    const n = Number(Array.isArray(v) ? v[0] : v);
    return Number.isInteger(n) ? Math.min(Math.max(n, 1), count) : fallback;
  };
  const start = pick(from, 1);
  return { from: start, to: Math.max(start, pick(to, count)) };
}

export function alignSurahs(a: string[][], b: string[][], first = { a: 1, b: 1 }, withTail = true): Row[] {
  const sa = first.a - 1;
  const sb = first.b - 1;
  const groups: Anchor[][] = [];
  for (const anchor of anchorsOf(a, b)) {
    const group = groups[groups.length - 1];
    const last = group?.[group.length - 1];
    const di = last ? anchor.i - last.i : 0;
    const dj = last ? anchor.j - last.j : 0;
    if (last && ((di === dj && di <= MAX_STEP_GAP) || (di + dj === 1))) group.push(anchor);
    else groups.push([anchor]);
  }

  const tail = withTail ? Math.min(TAIL_COUNT, a.length, b.length) : 0;
  const tailA = a.length - tail + 1;
  const tailB = b.length - tail + 1;
  let used = { i: 0, j: 0 };
  const blocks: Block[] = groups
    .map(g => g.filter(x => x.i < tailA && x.j < tailB))
    .filter(g => g.length >= 2 || (g.length === 1 && g[0].run >= KEEP_RUN))
    .map(g => {
      const at = (i: number, j: number) => pairOf(i + sa, j + sb, a[i - 1], b[j - 1]);
      const pairs: Pair[] = [at(g[0].i, g[0].j)];
      for (let n = 1; n < g.length; n++) {
        const step = g[n].i - g[n - 1].i;
        if (step === g[n].j - g[n - 1].j) for (let k = 1; k <= step; k++) pairs.push(at(g[n - 1].i + k, g[n - 1].j + k));
        else pairs.push(at(g[n].i, g[n].j));
      }
      const lead = pairOf(g[0].i - 1 + sa, g[0].j - 1 + sb, a[g[0].i - 2] ?? [], b[g[0].j - 2] ?? []);
      if (g[0].i - 1 > used.i && g[0].j - 1 > used.j && lead.shared.length > 0) pairs.unshift(lead);
      used = { i: g[g.length - 1].i, j: g[g.length - 1].j };
      return { kind: 'words' as const, anchors: g.length, pairs };
    });
  if (tail > 0) {
    const pairs = Array.from({ length: tail }, (_, k) => pairOf(tailA + k + sa, tailB + k + sb, a[tailA + k - 1], b[tailB + k - 1]));
    blocks.push({ kind: 'count', anchors: 0, pairs });
  }

  const rows: Row[] = [];
  let nextA = first.a;
  let nextB = first.b;
  const gapTo = (endA: number, endB: number) => {
    if (endA >= nextA || endB >= nextB) {
      rows.push({
        type: 'gap',
        a: endA >= nextA ? { from: nextA, to: endA } : null,
        b: endB >= nextB ? { from: nextB, to: endB } : null,
      });
    }
  };
  for (const block of blocks) {
    gapTo(block.pairs[0].a - 1, block.pairs[0].b - 1);
    rows.push({ type: 'block', block });
    nextA = block.pairs[block.pairs.length - 1].a + 1;
    nextB = block.pairs[block.pairs.length - 1].b + 1;
  }
  gapTo(a.length + sa, b.length + sb);
  return rows;
}
