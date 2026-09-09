import { buildExploration, ExplorationInput, hasSupportBeyondOwnExpansions } from './exploration';
import { RelationType, StoredEdge, SubjectId, subjectId } from './types';

// The family a fresh visit and Start over both open with (rule 11 of
// docs/graph-exploration-review-plan.md). GRANDSON/GRANDDAUGHTER are recorded
// relations, not two parent hops, so no lineage action belongs here.
export const DEFAULT_FAMILY_RELATIONS: readonly RelationType[] = ['WIFE', 'SON', 'DAUGHTER', 'GRANDSON', 'GRANDDAUGHTER'];

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
    expansions: DEFAULT_FAMILY_RELATIONS.map((relation) => ({ subject: target, relation })),
    globalFilters: [],
    caps: [],
    removed: [],
  };
}

export function defaultExplorationInput(targetSlug: string): ExplorationInput {
  return startOver(subjectId('person', targetSlug));
}
