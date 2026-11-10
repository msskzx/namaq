/**
 * When the bottom tab bar shrinks (Instagram-style, owner 2026-11-10): it gets smaller while the page scrolls down,
 * and comes back to full size as soon as the page scrolls up or reaches the top. It never hides fully.
 */
export type ScrollPoint = { y: number; maxY: number };

/** Scrolls smaller than this (in points) are finger jitter and change nothing. */
const STEP = 6;
/** Near the top the bar stays full size. */
const TOP = 24;

export function nextCompact(compact: boolean, last: ScrollPoint, now: ScrollPoint): boolean {
  if (now.y <= TOP) return false;
  // The bounce past either end (iOS) moves the page back without the reader asking for it.
  if (now.y > now.maxY || last.y > last.maxY) return compact;
  // At the bottom, the bar shrinking makes the page taller and pulls it back a little; that is not the reader scrolling up.
  if (last.y >= last.maxY - 1 && now.y >= now.maxY - 1) return compact;
  const dy = now.y - last.y;
  if (dy > STEP) return true;
  if (dy < -STEP) return false;
  return compact;
}
