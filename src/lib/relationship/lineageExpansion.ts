import { ExpansionAction } from './exploration';
import { ExpansionRelationId, matchExpansionNeighbors } from './expansion';
import { RelationType, StoredEdge, SubjectId } from './types';

type LineageRelation = 'ANCESTORS' | 'PATERNAL_LINEAGE' | 'DESCENDANTS';

const LINEAGE_HOPS: Record<LineageRelation, RelationType[]> = {
  ANCESTORS: ['FATHER', 'MOTHER'],
  PATERNAL_LINEAGE: ['FATHER'],
  DESCENDANTS: ['SON', 'DAUGHTER'],
};

function isLineageRelation(relation: ExpansionRelationId): relation is LineageRelation {
  return relation === 'ANCESTORS' || relation === 'PATERNAL_LINEAGE' || relation === 'DESCENDANTS';
}

export function flattenLineageExpansions(edges: StoredEdge[], expansions: ExpansionAction[]): ExpansionAction[] {
  const flattened: ExpansionAction[] = [];

  for (const action of expansions) {
    if (!isLineageRelation(action.relation)) {
      flattened.push(action);
      continue;
    }

    const hopTypes = LINEAGE_HOPS[action.relation];
    const visited = new Set<SubjectId>([action.subject]);
    let frontier: SubjectId[] = [action.subject];

    while (frontier.length > 0) {
      const next: SubjectId[] = [];
      for (const subject of frontier) {
        for (const hopType of hopTypes) {
          const neighbors = matchExpansionNeighbors(edges, subject, hopType);
          if (neighbors.length === 0) continue;
          flattened.push({ subject, relation: hopType });
          for (const neighbor of neighbors) {
            if (visited.has(neighbor)) continue;
            visited.add(neighbor);
            next.push(neighbor);
          }
        }
      }
      frontier = next;
    }
  }

  return flattened;
}
