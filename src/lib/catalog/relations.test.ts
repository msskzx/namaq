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

const catalog = (people: CatalogPerson[]): Catalog => ({ people, battles: [], events: [], utterances: [] });

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

describe('an inverse that depends on sex', () => {
  const withSex = (slug: string, sex: 'MALE' | 'FEMALE'): CatalogPerson => ({
    kind: 'PERSON',
    slug,
    name: slug,
    hasProfile: true,
    fields: { sex: { value: sex, claims: ['pilot/one'] } },
    titles: [],
    relations: [],
  });

  // The bug this guards: the inverse turns on the TARGET's sex, not the
  // subject's. A father of a daughter is still a man, and reading his sex here
  // would write SON back from her.
  it('reads the sex of the person the inverse points at, not the subject', () => {
    const father: CatalogPerson = {
      ...withSex('father', 'MALE'),
      relations: [{ type: 'FATHER', to: 'daughter', claims: ['pilot/one'] }],
    };

    expect(catalogRelations(catalog([father, withSex('daughter', 'FEMALE')]))).toEqual([
      { from: 'father', to: 'daughter', type: 'FATHER' },
      { from: 'daughter', to: 'father', type: 'DAUGHTER' },
    ]);
  });

  it('takes the other branch for a son', () => {
    const father: CatalogPerson = {
      ...withSex('father', 'MALE'),
      relations: [{ type: 'FATHER', to: 'son', claims: ['pilot/one'] }],
    };

    expect(catalogRelations(catalog([father, withSex('son', 'MALE')]))).toContainEqual({
      from: 'son',
      to: 'father',
      type: 'SON',
    });
  });

  // SON reverses to FATHER or MOTHER, again by the target.
  it('reverses a son to the right parent', () => {
    const child: CatalogPerson = {
      ...withSex('child', 'MALE'),
      relations: [{ type: 'SON', to: 'mother', claims: ['pilot/one'] }],
    };

    expect(catalogRelations(catalog([child, withSex('mother', 'FEMALE')]))).toContainEqual({
      from: 'mother',
      to: 'child',
      type: 'MOTHER',
    });
  });

  // An explicit inverse is the author's decision and outranks the column.
  it('lets a stated inverse win over the sex', () => {
    const father: CatalogPerson = {
      ...withSex('father', 'MALE'),
      relations: [{ type: 'FATHER', inverse: 'SON', to: 'daughter', claims: ['pilot/one'] }],
    };

    expect(catalogRelations(catalog([father, withSex('daughter', 'FEMALE')]))).toContainEqual({
      from: 'daughter',
      to: 'father',
      type: 'SON',
    });
  });

  // Unset sex is the normal state for anyone the sources have not stated it
  // for, and it must not guess: one direction is better than a wrong pair.
  it('writes one direction when the target has no sex', () => {
    const father: CatalogPerson = {
      ...withSex('father', 'MALE'),
      relations: [{ type: 'FATHER', to: 'unknown', claims: ['pilot/one'] }],
    };

    expect(catalogRelations(catalog([father]))).toEqual([{ from: 'father', to: 'unknown', type: 'FATHER' }]);
  });
});
