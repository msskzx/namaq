import { buildExploration, ExplorationInput, hasSupportBeyondOwnExpansions } from './exploration';
import type { ExpansionRelationId } from './expansion';
import { StoredEdge, SubjectId, subjectId } from './types';

// What a fresh visit and Start over open with, and what a profile's graph
// opens with too: the subject's line in both directions (rule 11 of
// docs/graph-exploration-review-plan.md). One rule serves both scopes, per
// docs/adr/0002-share-relationship-semantics-across-scopes.md. Companionship
// stays off, as its own switch governs it.
export const DEFAULT_LINEAGE_ACTIONS: readonly ExpansionRelationId[] = ['ANCESTORS', 'DESCENDANTS'];

function withoutExpansionsOf(input: ExplorationInput, subject: SubjectId): ExplorationInput {
  return { ...input, expansions: input.expansions.filter((action) => action.subject !== subject) };
}

/**
 * Drops expansion actions whose anchor has lost every independent support, then
 * repeats, since dropping one branch can orphan the branch it fed.
 */
function pruneOrphanedBranches(input: ExplorationInput, edges: StoredEdge[]): ExplorationInput {
  let expansions = input.expansions;

  for (;;) {
    const { visible } = buildExploration({ ...input, expansions }, edges);
    const orphaned = new Set(
      expansions
        .map((action) => action.subject)
        .filter((anchor) => !hasSupportBeyondOwnExpansions(visible.get(anchor), anchor))
    );
    if (orphaned.size === 0) return { ...input, expansions };
    expansions = expansions.filter((action) => !orphaned.has(action.subject));
  }
}

/**
 * Drops the search contribution alone. Rule 5 of
 * docs/graph-exploration-review-plan.md keeps the subject's own expansions
 * active until they are explicitly collapsed, so nothing is pruned here.
 */
export function removeSearchRoot(input: ExplorationInput, subject: SubjectId): ExplorationInput {
  return { ...input, roots: input.roots.filter((root) => root !== subject) };
}

export function collapseBranch(input: ExplorationInput, subject: SubjectId, edges: StoredEdge[]): ExplorationInput {
  return pruneOrphanedBranches(withoutExpansionsOf(input, subject), edges);
}

export function removeSubject(input: ExplorationInput, subject: SubjectId, edges: StoredEdge[]): ExplorationInput {
  const collapsed = withoutExpansionsOf(input, subject);
  return pruneOrphanedBranches(
    {
      ...collapsed,
      roots: collapsed.roots.filter((root) => root !== subject),
      removed: Array.from(new Set([...(collapsed.removed ?? []), subject])),
    },
    edges
  );
}

/** Lifts an explicit removal, without touching the cap history it never wrote. */
export function restoreSubject(input: ExplorationInput, subject: SubjectId): ExplorationInput {
  return {
    ...input,
    roots: input.roots.includes(subject) ? input.roots : [...input.roots, subject],
    removed: (input.removed ?? []).filter((entry) => entry !== subject),
  };
}

export function keepOnlySelected(input: ExplorationInput, subject: SubjectId): ExplorationInput {
  return {
    ...input,
    roots: [subject],
    expansions: input.expansions.filter((action) => action.subject === subject),
    globalFilters: [],
  };
}

export function startOver(target: SubjectId): ExplorationInput {
  return {
    roots: [target],
    expansions: DEFAULT_LINEAGE_ACTIONS.map((relation) => ({ subject: target, relation })),
    globalFilters: [],
    caps: [],
    removed: [],
  };
}

export function defaultExplorationInput(targetSlug: string): ExplorationInput {
  return startOver(subjectId('person', targetSlug));
}
