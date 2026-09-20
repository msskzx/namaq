import { RECIPROCAL_INVERSES } from '@/lib/relationship/categories';
import type { RelationType } from '@/lib/relationship/types';
import type { SeedRelation } from '../../../neo4j/seedRelations';
import type { Catalog, Sex } from './types';

/**
 * The inverse to write when a relation has more than one, keyed by the sex of
 * the person the inverse edge points at. Only the types whose reciprocal turns
 * on sex are here; everything else is settled by RECIPROCAL_INVERSES having a
 * single entry.
 */
const BY_SEX: Partial<Record<RelationType, Record<Sex, RelationType>>> = {
  FATHER: { MALE: 'SON', FEMALE: 'DAUGHTER' },
  MOTHER: { MALE: 'SON', FEMALE: 'DAUGHTER' },
  SON: { MALE: 'FATHER', FEMALE: 'MOTHER' },
  DAUGHTER: { MALE: 'FATHER', FEMALE: 'MOTHER' },
  STEP_FATHER: { MALE: 'STEP_SON', FEMALE: 'STEP_DAUGHTER' },
  STEP_MOTHER: { MALE: 'STEP_SON', FEMALE: 'STEP_DAUGHTER' },
  GRANDFATHER: { MALE: 'GRANDSON', FEMALE: 'GRANDDAUGHTER' },
  GRANDMOTHER: { MALE: 'GRANDSON', FEMALE: 'GRANDDAUGHTER' },
};

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
  const sexOf = new Map(
    catalog.people.flatMap((person) => (person.fields.sex ? [[person.slug, person.fields.sex.value] as const] : [])),
  );

  for (const person of catalog.people) {
    for (const relation of person.relations) {
      edges.push({ from: person.slug, to: relation.to, type: relation.type });

      const reciprocals = RECIPROCAL_INVERSES[relation.type] ?? [];
      // An explicit inverse always wins. Failing that, a single reciprocal is
      // unambiguous, and an ambiguous one is settled by the TARGET's sex, not
      // the subject's: X --FATHER--> Y reverses to Y --SON--> X or
      // Y --DAUGHTER--> X according to what Y is.
      const bySex = BY_SEX[relation.type];
      const targetSex = sexOf.get(relation.to);
      const inverse =
        relation.inverse ??
        (reciprocals.length === 1 ? reciprocals[0] : undefined) ??
        (bySex && targetSex ? bySex[targetSex] : undefined);
      if (inverse) edges.push({ from: relation.to, to: person.slug, type: inverse });
    }
  }

  return edges;
}
