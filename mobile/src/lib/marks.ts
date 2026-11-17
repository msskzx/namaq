import { SOME_WEIGHT, blend } from '@shared/quran/compareCardLook';
import { likenessAt, type MatrixLink, type Shared } from './branches';
import type { Palette } from './theme';

/** A shared word's colour (shared/quran/wordMatch.ts, under the colour setting); a word only some rows share is faded into the card. */
export function sharedTone(palette: Palette, shared: Shared & { links?: Map<number, MatrixLink> }, i: number): string | undefined {
  const kind = likenessAt(shared, i);
  if (kind) return palette.marks[kind];
  const link = shared.links?.get(i);
  const colour = link?.some ? palette.marks[link.kind] : undefined;
  return colour && someTone(palette, colour);
}

/** A colour faded into the card for a word only some rows share. */
export const someTone = (palette: Palette, colour: string) => blend(colour, palette.card, SOME_WEIGHT);
