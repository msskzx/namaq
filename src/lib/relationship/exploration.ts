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

export interface ExplorationInput {
  roots: SubjectId[];
  expansions: ExpansionAction[];
  globalFilters: RelationType[];
}

export interface ExplorationResult {
  visible: Map<SubjectId, ProvenanceTag[]>;
  connections: LogicalConnection[];
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

export function buildExploration(input: ExplorationInput, edges: StoredEdge[]): ExplorationResult {
  const visible = new Map<SubjectId, ProvenanceTag[]>();

  for (const root of input.roots) {
    addProvenance(visible, root, { kind: 'search' });
  }

  for (const action of input.expansions) {
    const neighbors = matchExpansionNeighbors(edges, action.subject, action.relation);
    // Keep both ends of an independently expanded branch when another control collapses.
    if (neighbors.length > 0) addProvenance(visible, action.subject, { kind: 'expansion', subject: action.subject, relation: action.relation });
    for (const neighbor of neighbors) {
      addProvenance(visible, neighbor, { kind: 'expansion', subject: action.subject, relation: action.relation });
    }
  }

  const preFilterSources = Array.from(visible.keys());
  const directNeighborsByFilter = new Map<RelationType, SubjectId[]>();

  for (const relationType of input.globalFilters) {
    const neighbors = preFilterSources.flatMap((source) => matchExpansionNeighbors(edges, source, relationType));
    directNeighborsByFilter.set(relationType, neighbors);
    for (const neighbor of neighbors) {
      if (visible.has(neighbor)) continue;
      addProvenance(visible, neighbor, { kind: 'filter', relationType });
    }
  }

  for (const relationType of input.globalFilters) {
    const crossSources = input.globalFilters
      .filter((other) => other !== relationType)
      .flatMap((other) => directNeighborsByFilter.get(other) ?? []);
    for (const source of crossSources) {
      for (const neighbor of matchExpansionNeighbors(edges, source, relationType)) {
        if (visible.has(neighbor)) continue;
        addProvenance(visible, neighbor, { kind: 'filter', relationType });
      }
    }
  }

  const visibleSubjects = new Set(visible.keys());
  const relevantEdges = edges.filter(
    (edge) => visibleSubjects.has(edge.source) && visibleSubjects.has(edge.target)
  );

  return { visible, connections: buildLogicalConnections(relevantEdges) };
}
