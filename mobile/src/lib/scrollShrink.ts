export type ScrollPoint = { y: number; maxY: number };

const STEP = 6;
export const TOP = 24;

export function nextCompact(compact: boolean, last: ScrollPoint, now: ScrollPoint): boolean {
  if (now.y <= TOP) return false;
  if (now.y > now.maxY || last.y > last.maxY) return compact;
  if (last.y >= last.maxY - 1 && now.y >= now.maxY - 1) return compact;
  const dy = now.y - last.y;
  if (dy > STEP) return true;
  if (dy < -STEP) return false;
  return compact;
}
