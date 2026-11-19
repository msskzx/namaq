/**
 * The smallest touch a finger gets on anything tappable in the app (owner, 2026-11-19): 44 × 44 points, Apple's minimum.
 * It counts the box and its hit slop together, so an icon never grows to reach it. Tap, the one press every button goes
 * through, widens its hit slop to this floor on its own (`slopFor`); the shared pieces' sizes are checked against it in
 * shared/tapSize.test.ts.
 *
 * Hit slop cannot reach past a parent that clips (overflow hidden), nor past the parent's bounds on Android: where a press
 * sits tight in such a parent, size its box to the floor instead. Words tapped inside a line of text (Text onPress) take
 * no slop; they get a tall line instead (the matrix's 44-point lines).
 */
export const MIN_TAP = 44;

export type Slop = { top: number; bottom: number; left: number; right: number };

/** The hit slop a press of this drawn size needs: what it was given, widened on each side until the touch is MIN_TAP. */
export function slopFor(size: { width: number; height: number } | null, given?: number | Partial<Slop> | null): Slop {
  const base: Slop = typeof given === 'number' ? { top: given, bottom: given, left: given, right: given }
    : { top: given?.top ?? 0, bottom: given?.bottom ?? 0, left: given?.left ?? 0, right: given?.right ?? 0 };
  if (!size) return base;
  const across = Math.max(0, (MIN_TAP - size.width) / 2);
  const down = Math.max(0, (MIN_TAP - size.height) / 2);
  return { top: Math.max(base.top, down), bottom: Math.max(base.bottom, down), left: Math.max(base.left, across), right: Math.max(base.right, across) };
}

/** The touch a press of this drawn size and slop gives, across and down. */
export const touchOf = (size: { width: number; height: number }, slop: Slop) =>
  ({ width: size.width + slop.left + slop.right, height: size.height + slop.top + slop.bottom });
