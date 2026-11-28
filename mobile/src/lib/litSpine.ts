export const CURVE = 10;
export type Span = { at: number; size: number };

export function litSpine(spans: Span[], lit: boolean[], whole: number): [number, number] | null {
  spans = spans.slice(0, lit.length);
  const ends = lit.flatMap((on, i) => on && spans[i] ? [i] : []);
  if (!ends.length) return null;
  const placed = spans.filter(Boolean);
  const low = Math.min(...placed.map(span => span.at));
  const high = Math.max(...placed.map(span => span.at));
  const corner = (i: number) => placed.length < 2 || low === high ? 0 : spans[i].at === low ? CURVE : spans[i].at === high ? -CURVE : 0;
  const middle = whole / 2;
  const reach = ends.map(i => { const centre = spans[i].at + spans[i].size / 2; const end = centre + corner(i); return centre < middle ? Math.min(end, middle) : Math.max(end, middle); });
  const from = Math.min(middle, ...reach);
  const to = Math.max(middle, ...reach);
  return to > from ? [from, to] : null;
}
