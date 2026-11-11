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
  // Only this fan's children: a fan that had more keeps the old ones' places.
  spans = spans.slice(0, lit.length);
  const ends = lit.flatMap((on, i) => on && spans[i] ? [i] : []);
  if (!ends.length) return null;
  const placed = spans.filter(Boolean);
  const low = Math.min(...placed.map(span => span.at));
  const high = Math.max(...placed.map(span => span.at));
  const corner = (i: number) => placed.length < 2 || low === high ? 0 : spans[i].at === low ? CURVE : spans[i].at === high ? -CURVE : 0;
  const middle = whole / 2;
  // A corner never pulls the line back across the parent's line.
  const reach = ends.map(i => { const centre = spans[i].at + spans[i].size / 2; const end = centre + corner(i); return centre < middle ? Math.min(end, middle) : Math.max(end, middle); });
  const from = Math.min(middle, ...reach);
  const to = Math.max(middle, ...reach);
  return to > from ? [from, to] : null;
}
