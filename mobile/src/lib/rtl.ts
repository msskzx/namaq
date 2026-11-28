type Align = 'auto' | 'start' | 'end' | 'left' | 'right' | 'center' | 'justify';
type Dir = 'ltr' | 'rtl';
type In = { direction?: Dir | 'inherit'; writingDirection?: 'auto' | Dir; textAlign?: Align };
type Out = { direction: Dir; writingDirection?: Dir; textAlign?: Align };

export function textDirection(flat: In, native: boolean): Out {
  const direction: Dir = flat.direction && flat.direction !== 'inherit' ? flat.direction : flat.writingDirection === 'ltr' ? 'ltr' : 'rtl';
  const out: Out = { direction };
  if (!flat.writingDirection || flat.writingDirection === 'auto') out.writingDirection = direction;
  if (native && direction === 'rtl' && flat.textAlign === 'right') out.textAlign = 'auto';
  if (native && direction === 'rtl' && flat.textAlign === 'left') out.textAlign = 'right';
  return out;
}
