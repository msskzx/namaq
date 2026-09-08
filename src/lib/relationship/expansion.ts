import { RelationType, StoredEdge, SubjectId } from './types';

export type LineageActionId = 'ANCESTORS' | 'PATERNAL_LINEAGE' | 'DESCENDANTS';

export const LINEAGE_ACTIONS: readonly LineageActionId[] = ['ANCESTORS', 'PATERNAL_LINEAGE', 'DESCENDANTS'];

export type ExpansionRelationId = RelationType | LineageActionId;

const LINEAGE_RELATION_IDS: ReadonlySet<ExpansionRelationId> = new Set(LINEAGE_ACTIONS);

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

/**
 * Neighbors revealed by expanding `subject` along `relation`.
 *
 * A reciprocal relation is read incoming only, because its type names the
 * source's role toward the target: `X -FATHER-> subject` is the father, while
 * `subject -FATHER-> Y` is a child and must not answer a FATHER request.
 * A one-way relation is read both ways, since it names the source's action
 * and either end is a meaningful answer -- a person's titles, a title's
 * holders. That cannot double-count: there is no reverse edge to also match.
 */
export function matchExpansionNeighbors(
  edges: StoredEdge[],
  subject: SubjectId,
  relation: ExpansionRelationId
): SubjectId[] {
  if (LINEAGE_RELATION_IDS.has(relation)) return [];

  const readsBothWays = ONE_WAY_RELATIONS.has(relation);
  const neighbors = new Set<SubjectId>();
  for (const edge of edges) {
    if (edge.type !== relation) continue;
    if (edge.target === subject) neighbors.add(edge.source);
    else if (readsBothWays && edge.source === subject) neighbors.add(edge.target);
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
