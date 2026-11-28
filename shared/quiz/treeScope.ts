import { branchInventory, type BranchPiece } from '../quran/branchInventory';
import { matrixOnly } from '../quran/branchVerdicts';
import type { JuzRange } from '../quran/juz';
import type { TreeGroup } from '../quran/phraseTrees';
import { quizFilters, type TreeScope } from './scopeParams';
import { citationSource, uniqueSources, type QuizSource } from './sources';

export { parseTreeScope, treeScopeParams, type TreeScope } from './scopeParams';

const idsOf = (piece: BranchPiece) => [piece.id, piece.legacyId, ...(piece.legacyIds ?? []), ...(piece.group?.aliases ?? [])];

export function quizTrees(range: JuzRange | null = null, scope: TreeScope = {}): (TreeGroup & { sources: QuizSource[]; cited?: boolean })[] {
  const filters = quizFilters(scope.filters);
  let pieces = branchInventory(filters, range).filter(piece => !matrixOnly(piece));
  if (scope.saved) {
    const saved = new Set(scope.saved);
    pieces = pieces.filter(piece => idsOf(piece).some(id => saved.has(id)));
  }
  return pieces.map(piece => ({ ...piece.phrase, sources: uniqueSources((piece.group?.citations ?? []).map(citationSource)), ...(piece.group?.citations.length ? { cited: true } : {}) }));
}
