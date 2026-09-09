import { buildLogicalConnections, LogicalConnection } from './connections';
import { ExpansionRelationId, matchExpansionNeighbors } from './expansion';
import { RelationType, StoredEdge, SubjectId } from './types';

export type ProvenanceTag =
  | { kind: 'search' }
  | { kind: 'expansion'; subject: SubjectId; relation: ExpansionRelationId }
  | { kind: 'filter'; relationType: RelationType };

export interface ExpansionAction {
  subject: SubjectId;
  relation: ExpansionRelationId;
}

export interface ExplorationCap {
  subject: SubjectId;
  relation: RelationType;
}

export interface ExplorationInput {
  roots: SubjectId[];
  expansions: ExpansionAction[];
  globalFilters: RelationType[];
  // Subjects a global filter has already introduced, per relation type. See
  // docs/adr/0003-cap-global-relationship-filters.md: the cap outlives search,
  // toggling, and removal, so it is carried in state rather than rederived.
  caps?: ExplorationCap[];
  removed?: SubjectId[];
}

export interface ExplorationResult {
  visible: Map<SubjectId, ProvenanceTag[]>;
  connections: LogicalConnection[];
  caps: ExplorationCap[];
}

function provenanceKey(tag: ProvenanceTag): string {
  switch (tag.kind) {
    case 'search':
      return 'search';
    case 'expansion':
      return `expansion:${tag.subject}:${tag.relation}`;
    case 'filter':
      return `filter:${tag.relationType}`;
  }
}

export function capKey(cap: ExplorationCap): string {
  return `${cap.subject}:${cap.relation}`;
}

function addProvenance(visible: Map<SubjectId, ProvenanceTag[]>, subject: SubjectId, tag: ProvenanceTag): void {
  const existing = visible.get(subject);
  if (!existing) {
    visible.set(subject, [tag]);
    return;
  }
  const key = provenanceKey(tag);
  if (existing.some((existingTag) => provenanceKey(existingTag) === key)) return;
  existing.push(tag);
}

/**
 * Whether `subject` is held in the exploration by anything other than its own
 * expansion choices -- the question collapse and removal ask before deciding
 * that an anchor has lost its last independent support.
 */
export function hasSupportBeyondOwnExpansions(tags: ProvenanceTag[] | undefined, subject: SubjectId): boolean {
  return (tags ?? []).some((tag) => !(tag.kind === 'expansion' && tag.subject === subject));
}

export function buildExploration(input: ExplorationInput, edges: StoredEdge[]): ExplorationResult {
  const visible = new Map<SubjectId, ProvenanceTag[]>();
  const removed = new Set(input.removed ?? []);
  const capped = new Set((input.caps ?? []).map(capKey));
  const caps = [...(input.caps ?? [])];

  for (const root of input.roots) {
    if (removed.has(root)) continue;
    addProvenance(visible, root, { kind: 'search' });
  }

  for (const action of input.expansions) {
    if (removed.has(action.subject)) continue;
    const tag: ProvenanceTag = { kind: 'expansion', subject: action.subject, relation: action.relation };
    addProvenance(visible, action.subject, tag);
    for (const neighbor of matchExpansionNeighbors(edges, action.subject, action.relation)) {
      if (removed.has(neighbor)) continue;
      addProvenance(visible, neighbor, tag);
    }
  }

  // Runs to a fixed point rather than a fixed number of passes: each
  // introduction caps its own subject for that relation type, so a filter
  // cannot walk the same chain twice, while a subject introduced by one
  // filter stays eligible to trigger a different one.
  for (let introduced = true; introduced; ) {
    introduced = false;
    for (const relationType of input.globalFilters) {
      for (const source of Array.from(visible.keys())) {
        if (capped.has(capKey({ subject: source, relation: relationType }))) continue;
        for (const neighbor of matchExpansionNeighbors(edges, source, relationType)) {
          if (removed.has(neighbor)) continue;
          // A filter supports every matching neighbor, but only caps the ones
          // it actually introduces: a subject already revealed some other way
          // keeps its own eligibility.
          if (!visible.has(neighbor)) {
            const cap = { subject: neighbor, relation: relationType };
            capped.add(capKey(cap));
            caps.push(cap);
            introduced = true;
          }
          addProvenance(visible, neighbor, { kind: 'filter', relationType });
        }
      }
    }
  }

  const visibleSubjects = new Set(visible.keys());
  const relevantEdges = edges.filter(
    (edge) => visibleSubjects.has(edge.source) && visibleSubjects.has(edge.target)
  );

  return { visible, connections: buildLogicalConnections(relevantEdges), caps };
}
