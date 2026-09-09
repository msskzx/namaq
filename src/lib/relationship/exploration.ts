import { governingRelationType } from './categories';
import { buildLogicalConnections, LogicalConnection } from './connections';
import { ExpansionRelationId, matchExpansionEdges, matchExpansionNeighbors } from './expansion';
import { participationMatchesStatuses } from './status';
import { RelationType, StoredEdge, SubjectId } from './types';

export type ProvenanceTag =
  | { kind: 'search' }
  | { kind: 'expansion'; subject: SubjectId; relation: ExpansionRelationId }
  | { kind: 'filter'; relationType: RelationType };

export interface ExpansionAction {
  subject: SubjectId;
  relation: ExpansionRelationId;
  // The action a lineage traversal expanded into these hops, so every subject
  // it reaches belongs to that one branch (see flattenLineageExpansions).
  origin?: { subject: SubjectId; relation: ExpansionRelationId };
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
  // Absent until the user chooses; an empty array is a deliberate choice that
  // matches no participation at all.
  statuses?: string[];
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

function edgeKey(edge: StoredEdge): string {
  return `${edge.source}|${edge.target}|${edge.type}`;
}

export function buildExploration(input: ExplorationInput, edges: StoredEdge[]): ExplorationResult {
  const visible = new Map<SubjectId, ProvenanceTag[]>();
  const removed = new Set(input.removed ?? []);
  const capped = new Set((input.caps ?? []).map(capKey));
  const caps = [...(input.caps ?? [])];
  const eligibleEdges = edges.filter((edge) => participationMatchesStatuses(edge, input.statuses));
  // Connections a contribution actually revealed. A global filter answers for
  // its whole relation type instead, so it needs no per-edge record.
  const contributedEdges = new Set<string>();
  const filteredTypes = new Set(input.globalFilters.map(governingRelationType));

  for (const root of input.roots) {
    if (removed.has(root)) continue;
    addProvenance(visible, root, { kind: 'search' });
  }

  for (const action of input.expansions) {
    if (removed.has(action.subject)) continue;
    const origin = action.origin ?? action;
    const tag: ProvenanceTag = { kind: 'expansion', subject: origin.subject, relation: origin.relation };
    const matched = matchExpansionEdges(eligibleEdges, action.subject, action.relation);
    // Keep both ends of an independently expanded branch when another control collapses.
    if (matched.length > 0) addProvenance(visible, action.subject, tag);
    for (const edge of matched) {
      const neighbor = edge.source === action.subject ? edge.target : edge.source;
      if (removed.has(neighbor)) continue;
      contributedEdges.add(edgeKey(edge));
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
        for (const neighbor of matchExpansionNeighbors(eligibleEdges, source, relationType)) {
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
  const relevantEdges = eligibleEdges.filter(
    (edge) => visibleSubjects.has(edge.source) && visibleSubjects.has(edge.target)
  );
  const isAllowed = (edge: StoredEdge) =>
    contributedEdges.has(edgeKey(edge)) || filteredTypes.has(governingRelationType(edge.type));
  // Both directions of one relationship travel together, so a connection
  // survives on either side's permission and keeps its reciprocal wording.
  const connections = buildLogicalConnections(relevantEdges).filter(
    (connection) => isAllowed(connection.primary) || (connection.reciprocal !== undefined && isAllowed(connection.reciprocal))
  );

  return { visible, connections, caps };
}
