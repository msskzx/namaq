export const MIN_TAP = 44;

export type Slop = { top: number; bottom: number; left: number; right: number };

export function slopFor(size: { width: number; height: number } | null, given?: number | Partial<Slop> | null): Slop {
  const base: Slop = typeof given === 'number' ? { top: given, bottom: given, left: given, right: given }
    : { top: given?.top ?? 0, bottom: given?.bottom ?? 0, left: given?.left ?? 0, right: given?.right ?? 0 };
  if (!size) return base;
  const across = Math.max(0, (MIN_TAP - size.width) / 2);
  const down = Math.max(0, (MIN_TAP - size.height) / 2);
  return { top: Math.max(base.top, down), bottom: Math.max(base.bottom, down), left: Math.max(base.left, across), right: Math.max(base.right, across) };
}

export const touchOf = (size: { width: number; height: number }, slop: Slop) =>
  ({ width: size.width + slop.left + slop.right, height: size.height + slop.top + slop.bottom });
