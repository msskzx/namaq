import { SOME_WEIGHT, blend, markColour } from '@shared/quran/compareCardLook';
import type { Likeness } from '@shared/quran/wordMatch';
import { likenessAt, type MatrixLink, type Shared } from './branches';
import type { Palette } from './theme';

/**
 * How a Quran word matches the others (shared/quran/wordMatch.ts): the same word, the same letters written differently, the
 * same root, or a related word; `some` when only some of the rows share it. The Quran text module colours it (AyahWords `mark`).
 */
export type WordMark = { kind: Likeness | 'related'; some?: boolean };

/** A marked word's colour under the colour setting; a word only some rows share is mixed with the muted colour. */
export function markTone(palette: Palette, mark: WordMark): string | undefined {
  const colour = markColour(mark.kind === 'written' ? 'exact' : mark.kind, palette, mark.kind === 'written');
  return colour && (mark.some ? someTone(palette, colour) : colour);
}

/** A matrix word's mark: shared by every row, or by only some of them. */
export function sharedMark(shared: Shared & { links?: Map<number, MatrixLink> }, i: number): WordMark | undefined {
  const kind = likenessAt(shared, i);
  if (kind) return { kind };
  const link = shared.links?.get(i);
  return link?.some ? { kind: link.kind, some: true } : undefined;
}

/** A shared word's colour, as the matrix colours it (sharedMark): for the videos, drawn outside the Quran text module. */
export function sharedTone(palette: Palette, shared: Shared & { links?: Map<number, MatrixLink> }, i: number): string | undefined {
  const mark = sharedMark(shared, i);
  return mark && markTone(palette, mark);
}

/** A word only some rows share: its colour mixed with the muted text colour. */
export const someTone = (palette: Palette, colour: string) => blend(colour, palette.muted, SOME_WEIGHT);
