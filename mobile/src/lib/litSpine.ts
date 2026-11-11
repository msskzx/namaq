/** How far a fan's end corners curve. */
export const CURVE = 10;
/** Where a fan's child sits along the spine, and how wide (or tall) it is. */
export type Span = { at: number; size: number };

/**
 * The lit stretch of a fan's spine: from where the parent's line meets it to the farthest lit child, short of a corner's curve,
 * so the lit line turns into the child along the curve instead of running past it. The corners are the children at either end
 * by where they sit, not by order: top down in Arabic the first child is on the right.
 */
export function litSpine(spans: Span[], lit: boolean[], whole: number): [number, number] | null {
  const ends = lit.flatMap((on, i) => on && spans[i] ? [i] : []);
  if (!ends.length) return null;
  const placed = spans.filter(Boolean);
  const low = Math.min(...placed.map(span => span.at));
  const high = Math.max(...placed.map(span => span.at));
  const corner = (i: number) => placed.length < 2 || low === high ? 0 : spans[i].at === low ? CURVE : spans[i].at === high ? -CURVE : 0;
  const reach = ends.map(i => spans[i].at + spans[i].size / 2 + corner(i));
  const middle = whole / 2;
  const from = Math.min(middle, ...reach);
  const to = Math.max(middle, ...reach);
  return to > from ? [from, to] : null;
}
