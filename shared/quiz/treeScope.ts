// Which trees a quiz asks, with the branches page's filters: kinds of comparison and difference,
// part of the Quran beyond a juz range (surahs, pages, chosen juz), and saved trees only.
import { branchInventory, type BranchPiece } from '../quran/branchInventory';
import { matrixOnly } from '../quran/branchVerdicts';
import type { JuzRange } from '../quran/juz';
import type { TreeGroup } from '../quran/phraseTrees';
import { quizFilters, type TreeScope } from './scopeParams';
import { citationSource, uniqueSources, type QuizSource } from './sources';

export { parseTreeScope, treeScopeParams, type TreeScope } from './scopeParams';

const idsOf = (piece: BranchPiece) => [piece.id, piece.legacyId, ...(piece.legacyIds ?? []), ...(piece.group?.aliases ?? [])];

/** The trees the quiz asks, as the branches page lists them for the same filters and juz range. */
export function quizTrees(range: JuzRange | null = null, scope: TreeScope = {}): (TreeGroup & { sources: QuizSource[]; cited?: boolean })[] {
  const filters = quizFilters(scope.filters);
  // A card kept as its matrix only has no tree to ask.
  // The books' kind alone, as the branches page's «في كتب المتشابهات» lists it: a bigger tree holding smaller ones is asked once.
  let pieces = branchInventory(filters, range).filter(piece => !matrixOnly(piece));
  if (scope.saved) {
    const saved = new Set(scope.saved);
    pieces = pieces.filter(piece => idsOf(piece).some(id => saved.has(id)));
  }
  // Each tree with the books' entries that set its ayat side by side (shared/quiz/sources.ts).
  return pieces.map(piece => ({ ...piece.phrase, sources: uniqueSources((piece.group?.citations ?? []).map(citationSource)), ...(piece.group?.citations.length ? { cited: true } : {}) }));
}
