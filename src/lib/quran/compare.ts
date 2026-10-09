// docs/plans/quran-compare-page.md
import { wordDiff } from './wordDiff';

export const MIN_RUN = 2;
export const MAX_STEP_GAP = 5;
export const KEEP_RUN = 4;
export const TAIL_COUNT = 5;

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
  const diff = shared.length === 0 ? { a: [], b: [] } : wordDiff(x, y);
  return { a, b, run: longestRun(x, y), shared, marksA: diff.a, marksB: diff.b };
}

function anchorsOf(a: string[][], b: string[][]): Anchor[] {
  const run = a.map(x => b.map(y => longestRun(x, y)));
  const best = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const r = run[i - 1][j - 1];
      const hit = r >= MIN_RUN ? best[i - 1][j - 1] + r * r : 0;
      best[i][j] = Math.max(best[i - 1][j], best[i][j - 1], hit);
    }
  }
  const found: Anchor[] = [];
  let i = a.length;
  let j = b.length;
  while (i > 0 && j > 0) {
    const r = run[i - 1][j - 1];
    if (r >= MIN_RUN && best[i][j] === best[i - 1][j - 1] + r * r) {
      found.push({ i, j, run: r });
      i--;
      j--;
    } else if (best[i][j] === best[i - 1][j]) i--;
    else j--;
  }
  return found.reverse();
}

export function alignSurahs(a: string[][], b: string[][]): Row[] {
  const groups: Anchor[][] = [];
  for (const anchor of anchorsOf(a, b)) {
    const group = groups[groups.length - 1];
    const last = group?.[group.length - 1];
    const step = last ? anchor.i - last.i : 0;
    if (last && step === anchor.j - last.j && step <= MAX_STEP_GAP) group.push(anchor);
    else groups.push([anchor]);
  }

  const tail = Math.min(TAIL_COUNT, a.length, b.length);
  const tailA = a.length - tail + 1;
  const tailB = b.length - tail + 1;
  const blocks: Block[] = groups
    .map(g => g.filter(x => x.i < tailA && x.j < tailB))
    .filter(g => g.length >= 2 || (g.length === 1 && g[0].run >= KEEP_RUN))
    .map(g => {
      const pairs: Pair[] = [];
      for (let k = 0; k <= g[g.length - 1].i - g[0].i; k++) {
        pairs.push(pairOf(g[0].i + k, g[0].j + k, a[g[0].i + k - 1], b[g[0].j + k - 1]));
      }
      return { kind: 'words' as const, anchors: g.length, pairs };
    });
  if (tail > 0) {
    const pairs = Array.from({ length: tail }, (_, k) => pairOf(tailA + k, tailB + k, a[tailA + k - 1], b[tailB + k - 1]));
    blocks.push({ kind: 'count', anchors: 0, pairs });
  }

  const rows: Row[] = [];
  let nextA = 1;
  let nextB = 1;
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
  gapTo(a.length, b.length);
  return rows;
}
