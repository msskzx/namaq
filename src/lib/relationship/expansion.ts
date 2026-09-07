import { RelationType, StoredEdge, SubjectId } from './types';

export type ExpansionRelationId = RelationType | 'ANCESTORS' | 'PATERNAL_LINEAGE' | 'DESCENDANTS';

const LINEAGE_RELATION_IDS: ReadonlySet<ExpansionRelationId> = new Set([
  'ANCESTORS',
  'PATERNAL_LINEAGE',
  'DESCENDANTS',
]);

export function matchExpansionNeighbors(
  edges: StoredEdge[],
  subject: SubjectId,
  relation: ExpansionRelationId
): SubjectId[] {
  if (LINEAGE_RELATION_IDS.has(relation)) return [];

  const neighbors = new Set<SubjectId>();
  for (const edge of edges) {
    if (edge.type === relation && edge.target === subject) {
      neighbors.add(edge.source);
    }
  }
  return Array.from(neighbors);
}

export function directRelationCounts(
  edges: StoredEdge[],
  subject: SubjectId | SubjectId[],
  eligibleRelations: ExpansionRelationId[]
): Map<ExpansionRelationId, number> {
  const counts = new Map<ExpansionRelationId, number>();
  for (const relation of eligibleRelations) {
    counts.set(relation, new Set((Array.isArray(subject) ? subject : [subject]).flatMap(id => matchExpansionNeighbors(edges, id, relation))).size);
  }
  return counts;
}
