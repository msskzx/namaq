// Which trees a quiz asks, with the branches page's filters: kinds of comparison and difference,
// part of the Quran beyond a juz range (surahs, pages, chosen juz), and saved trees only.
import { branchInventory, type BranchPiece } from '../quran/branchInventory';
import type { JuzRange } from '../quran/juz';
import type { TreeGroup } from '../quran/phraseTrees';
import { quizFilters, type TreeScope } from './scopeParams';

export { parseTreeScope, treeScopeParams, type TreeScope } from './scopeParams';

const idsOf = (piece: BranchPiece) => [piece.id, piece.legacyId, ...(piece.legacyIds ?? []), ...(piece.group?.aliases ?? [])];

/** The kinds the branches page lists by default; a tree of these kinds may hold smaller trees the quiz would ask. */
const BRANCHES_CATEGORIES = ['mutashabeh', 'pondering'];

/**
 * The quiz's trees, where the branches page shows one bigger tree in place of smaller ones (من تراب ثم من نطفة: 18:37 with
 * 40:67 and 22:5 with 40:67 sit in one tree of four ayat), asks the bigger tree, once.
 */
function merged(pieces: BranchPiece[], categories: string, filters: ReturnType<typeof quizFilters>, range: JuzRange | null): BranchPiece[] {
  const wider = [...new Set([...categories.split(','), ...BRANCHES_CATEGORIES])].join(',');
  if (wider === categories) return pieces;
  const shown = branchInventory({ ...filters, categories: wider }, range);
  const shownIds = new Set(shown.map(piece => piece.id));
  const holder = new Map<string, BranchPiece>();
  for (const piece of shown) for (const id of piece.legacyIds ?? []) holder.set(id, piece);
  const result: BranchPiece[] = [];
  const seen = new Set<string>();
  for (const piece of pieces) {
    const kept = shownIds.has(piece.id) ? piece : holder.get(piece.id) ?? piece;
    if (seen.has(kept.id)) continue;
    seen.add(kept.id);
    result.push(kept);
  }
  return result;
}

/** The trees the quiz asks, as the branches page lists them for the same filters and juz range. */
export function quizTrees(range: JuzRange | null = null, scope: TreeScope = {}): TreeGroup[] {
  const filters = quizFilters(scope.filters);
  let pieces = merged(branchInventory(filters, range), filters.categories!, filters, range);
  if (scope.saved) {
    const saved = new Set(scope.saved);
    pieces = pieces.filter(piece => idsOf(piece).some(id => saved.has(id)));
  }
  return pieces.map(piece => piece.phrase);
}
