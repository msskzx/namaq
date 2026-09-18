import { RECIPROCAL_INVERSES } from '@/lib/relationship/categories';
import type { SeedRelation } from '../../../neo4j/seedRelations';
import type { Catalog } from './types';

/**
 * The person-to-person edges a catalog implies, in the shape the graph stores
 * them: both directions, since a module declares only one.
 *
 * Edges another sync owns are left out. Companionship is written by
 * people:sync-companions from the companion title, so a catalog claim about it
 * is evidence for an edge that script maintains, not a second author of it.
 */
export function catalogRelations(catalog: Catalog): SeedRelation[] {
  const edges: SeedRelation[] = [];

  for (const person of catalog.people) {
    for (const relation of person.relations) {
      edges.push({ from: person.slug, to: relation.to, type: relation.type });

      const reciprocals = RECIPROCAL_INVERSES[relation.type] ?? [];
      const inverse = relation.inverse ?? (reciprocals.length === 1 ? reciprocals[0] : undefined);
      if (inverse) edges.push({ from: relation.to, to: person.slug, type: inverse });
    }
  }

  return edges;
}
