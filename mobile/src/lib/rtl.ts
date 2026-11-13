type Align = 'auto' | 'start' | 'end' | 'left' | 'right' | 'center' | 'justify';
type Dir = 'ltr' | 'rtl';
type In = { direction?: Dir | 'inherit'; writingDirection?: 'auto' | Dir; textAlign?: Align };
type Out = { direction: Dir; writingDirection?: Dir; textAlign?: Align };

/**
 * The style that puts a top-level text on the right, as an Arabic app should, on every platform.
 * Each text gets its own layout direction (rtl, or ltr when it asks for ltr writing), whatever its
 * parents use, so a text inside an ltr pager track still starts on the right.
 * React Native on iOS and Android reads textAlign left/right as start/end in an rtl layout, so there
 * 'right' becomes the default (start, the right edge) and 'left' becomes 'right' (end, the left edge).
 * The web reads left/right literally, so they stay.
 */
export function textDirection(flat: In, native: boolean): Out {
  const direction: Dir = flat.direction && flat.direction !== 'inherit' ? flat.direction : flat.writingDirection === 'ltr' ? 'ltr' : 'rtl';
  const out: Out = { direction };
  if (!flat.writingDirection || flat.writingDirection === 'auto') out.writingDirection = direction;
  if (native && direction === 'rtl' && flat.textAlign === 'right') out.textAlign = 'auto';
  if (native && direction === 'rtl' && flat.textAlign === 'left') out.textAlign = 'right';
  return out;
}
