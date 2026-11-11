// Which trees a quiz asks, with the branches page's filters: kinds of comparison and difference,
// part of the Quran beyond a juz range (surahs, pages, chosen juz), and saved trees only.
import { branchInventory, type BranchPiece } from '../quran/branchInventory';
import type { JuzRange } from '../quran/juz';
import type { TreeGroup } from '../quran/phraseTrees';
import { quizFilters, type TreeScope } from './scopeParams';

export { parseTreeScope, treeScopeParams, type TreeScope } from './scopeParams';

const idsOf = (piece: BranchPiece) => [piece.id, piece.legacyId, ...(piece.legacyIds ?? []), ...(piece.group?.aliases ?? [])];

/** The trees the quiz asks, as the branches page lists them for the same filters and juz range. */
export function quizTrees(range: JuzRange | null = null, scope: TreeScope = {}): TreeGroup[] {
  let pieces = branchInventory(quizFilters(scope.filters), range);
  if (scope.saved) {
    const saved = new Set(scope.saved);
    pieces = pieces.filter(piece => idsOf(piece).some(id => saved.has(id)));
  }
  return pieces.map(piece => piece.phrase);
}
