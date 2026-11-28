import { SOME_WEIGHT, blend, markColour } from '@shared/quran/compareCardLook';
import type { Likeness } from '@shared/quran/wordMatch';
import { likenessAt, type MatrixLink, type Shared } from './branches';
import type { Palette } from './theme';

export type WordMark = { kind: Likeness | 'related'; some?: boolean };

export function markTone(palette: Palette, mark: WordMark): string | undefined {
  const colour = markColour(mark.kind === 'written' ? 'exact' : mark.kind, palette, mark.kind === 'written');
  return colour && (mark.some ? someTone(palette, colour) : colour);
}

export function sharedMark(shared: Shared & { links?: Map<number, MatrixLink> }, i: number): WordMark | undefined {
  const kind = likenessAt(shared, i);
  if (kind) return { kind };
  const link = shared.links?.get(i);
  return link?.some ? { kind: link.kind, some: true } : undefined;
}

export function sharedTone(palette: Palette, shared: Shared & { links?: Map<number, MatrixLink> }, i: number): string | undefined {
  const mark = sharedMark(shared, i);
  return mark && markTone(palette, mark);
}

export const someTone = (palette: Palette, colour: string) => blend(colour, palette.muted, SOME_WEIGHT);
