/** The bar (from 0) nearest to `index` that has a count, so a finger between bars, or on an empty one, lands on one. */
export function nearestBar(counts: number[], index: number): number {
  const at = Math.min(counts.length - 1, Math.max(0, index));
  for (let step = 0; step < counts.length; step++) {
    if (counts[at - step]) return at - step;
    if (counts[at + step]) return at + step;
  }
  return at;
}

/** The next bar after `from` that has a count, toward the end (1) or the start (-1); `from` when there is none. */
export function stepBar(counts: number[], from: number, by: 1 | -1): number {
  for (let i = from + by; i >= 0 && i < counts.length; i += by) if (counts[i]) return i;
  return from;
}
