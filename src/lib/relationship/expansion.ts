import { RelationType, StoredEdge, SubjectId } from './types';

export type ExpansionRelationId = RelationType | 'ANCESTORS' | 'PATERNAL_LINEAGE' | 'DESCENDANTS';

const LINEAGE_RELATION_IDS: ReadonlySet<ExpansionRelationId> = new Set([
  'ANCESTORS',
  'PATERNAL_LINEAGE',
  'DESCENDANTS',
]);

// Relations the graph stores in one direction only, with no reciprocal edge:
// a person is always the source of HOLDS_TITLE, never its target. Every
// person-to-person relation is stored reciprocally instead (FATHER one way,
// SON the other), which is why the two are read differently below. See
// docs/graph-expansion-controls-plan.md.
const ONE_WAY_RELATIONS: ReadonlySet<ExpansionRelationId> = new Set([
  'HOLDS_TITLE',
  'PARTICIPATED_IN',
  'INVOLVED_IN',
  'PART_OF',
]);

// The two recorded directions of companionship, which share one toggle (see
// governingRelationType in categories.ts). Rule 3 of
// docs/graph-exploration-review-plan.md makes that toggle answer for both,
// so unlike a family role neither direction names an answer of its own.
const COMPANION_RELATIONS: ReadonlySet<ExpansionRelationId> = new Set(['COMPANION_OF', 'ACCOMPANIED_BY']);

/**
 * Edges that answer expanding `subject` along `relation`.
 *
 * A reciprocal relation is read incoming only, because its type names the
 * source's role toward the target: `X -FATHER-> subject` is the father, while
 * `subject -FATHER-> Y` is a child and must not answer a FATHER request.
 * A one-way relation is read both ways, since it names the source's action
 * and either end is a meaningful answer -- a person's titles, a title's
 * holders. That cannot double-count: there is no reverse edge to also match.
 */
export function matchExpansionEdges(
  edges: StoredEdge[],
  subject: SubjectId,
  relation: ExpansionRelationId
): StoredEdge[] {
  if (LINEAGE_RELATION_IDS.has(relation)) return [];

  if (COMPANION_RELATIONS.has(relation)) {
    return edges.filter(
      (edge) => COMPANION_RELATIONS.has(edge.type) && (edge.source === subject || edge.target === subject)
    );
  }

  const readsBothWays = ONE_WAY_RELATIONS.has(relation);
  return edges.filter(
    (edge) => edge.type === relation && (edge.target === subject || (readsBothWays && edge.source === subject))
  );
}

export function matchExpansionNeighbors(
  edges: StoredEdge[],
  subject: SubjectId,
  relation: ExpansionRelationId
): SubjectId[] {
  const neighbors = new Set<SubjectId>();
  for (const edge of matchExpansionEdges(edges, subject, relation)) {
    neighbors.add(edge.source === subject ? edge.target : edge.source);
  }
  neighbors.delete(subject);
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
