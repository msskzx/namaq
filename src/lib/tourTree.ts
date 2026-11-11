import treeData from '@shared/data/quran/trees.json';
import { phrasePresentation } from '@shared/quran/phraseTrees';
import { branchInventory } from '@shared/quran/branchInventory';
import { groupPresentation } from '@shared/quran/mutashabih/presentation';
import type { BranchAyah } from '@shared/quran/branches';
import { tourPieceIn } from '@shared/quran/tour';

let tour: ReturnType<typeof phrasePresentation> | null | undefined;
/** The tree the first-visit tour shows (the app's tour tree), built once. */
export function tourTree() {
  if (tour !== undefined) return tour;
  const ayat = treeData.ayat as BranchAyah[];
  const piece = tourPieceIn(branchInventory({}, null));
  tour = !piece ? null : piece.group ? groupPresentation(piece.group, new Map(ayat.map(ayah => [ayah.key, ayah]))) : phrasePresentation(piece.phrase, ayat, true, true);
  return tour;
}
