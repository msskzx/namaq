import { describe, expect, it } from 'vitest';
import { catalogRelations } from './relations';
import type { Catalog, CatalogPerson } from './types';

const person = (over: Partial<CatalogPerson> = {}): CatalogPerson => ({
  kind: 'PERSON',
  slug: 'someone',
  name: 'فلان',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [],
  ...over,
});

const catalog = (people: CatalogPerson[]): Catalog => ({ people, battles: [], events: [] });

describe('catalogRelations', () => {
  it('writes both directions of a declared relation', () => {
    const subject = person({ relations: [{ type: 'SON', inverse: 'FATHER', to: 'his-father', claims: ['x'] }] });

    expect(catalogRelations(catalog([subject]))).toEqual([
      { from: 'someone', to: 'his-father', type: 'SON' },
      { from: 'his-father', to: 'someone', type: 'FATHER' },
    ]);
  });

  it('takes the only reciprocal when the author did not pick one', () => {
    const subject = person({ relations: [{ type: 'COMPANION_OF', to: 'prophet-muhammad', claims: ['x'] }] });

    expect(catalogRelations(catalog([subject]))).toContainEqual({
      from: 'prophet-muhammad',
      to: 'someone',
      type: 'ACCOMPANIED_BY',
    });
  });

  // An ambiguous reciprocal is validateCatalog's to reject; this only declines
  // to guess, so a catalog that slipped through writes one direction, not a
  // wrong one.
  it('writes one direction when the reciprocal is ambiguous and unstated', () => {
    const subject = person({ relations: [{ type: 'SON', to: 'a-parent', claims: ['x'] }] });

    expect(catalogRelations(catalog([subject]))).toEqual([{ from: 'someone', to: 'a-parent', type: 'SON' }]);
  });
});
