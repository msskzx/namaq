import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type Catalog, type CatalogPerson } from './types';
import { validateCatalog, type KnownSlugs } from './validateCatalog';

const known: KnownSlugs = {
  people: new Set(['prophet-muhammad']),
  titles: new Set(['companion']),
  battles: new Set(['badr']),
  claims: new Set(['pilot/one']),
};

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

const catalog = (over: Partial<Catalog> = {}): Catalog => ({ people: [], battles: [], events: [], ...over });

describe('validateCatalog', () => {
  it('passes a catalog whose every reference resolves', () => {
    const subject = person({
      fields: { fullName: { value: 'فلان بن فلان', claims: ['pilot/one'] } },
      titles: [{ title: 'companion', claims: ['pilot/one'] }],
      relations: [{ type: 'COMPANION_OF', to: 'prophet-muhammad', claims: ['pilot/one'] }],
    });

    expect(validateCatalog(catalog({ people: [subject] }), known)).toEqual([]);
  });

  // The partition ADR 0013 draws: attendance is the relation's, outcome the
  // status's, and Postgres cannot reject a crossing because status is an array.
  it('rejects a status the relation cannot carry', () => {
    const battle = {
      kind: 'BATTLE',
      slug: 'badr',
      participants: [{ person: 'prophet-muhammad', isMuslim: true, status: ['ABSENT_EXCUSED'], claims: ['pilot/one'] }],
    } as const;

    expect(validateCatalog(catalog({ battles: [battle] }), known)).toEqual([
      { path: 'battles/badr.prophet-muhammad', message: 'PARTICIPATED_IN cannot carry status ABSENT_EXCUSED' },
    ]);
  });

  it('accepts an outcome on a participation and an excuse on an absence', () => {
    const badr = {
      kind: 'BATTLE',
      slug: 'badr',
      participants: [
        { person: 'prophet-muhammad', isMuslim: true, status: ['INJURED'], claims: ['pilot/one'] },
        {
          person: 'someone',
          isMuslim: true,
          relation: 'ABSENT_FROM',
          status: ['ABSENT_EXCUSED'],
          summary: { value: 'كان في تجارة له بالشام', claims: ['pilot/one'] },
          claims: ['pilot/one'],
        },
      ],
    } as const;

    expect(validateCatalog(catalog({ people: [person()], battles: [badr] }), known)).toEqual([]);
  });

  it('rejects a claim key no approved batch declares', () => {
    const subject = person({ fields: { virtues: { value: 'مناقب', claims: ['pilot/absent'] } } });

    expect(validateCatalog(catalog({ people: [subject] }), known)).toEqual([
      { path: 'people/someone.virtues', message: 'no batch declares claim pilot/absent' },
    ]);
  });

  it('accepts the legacy marker, which stands in for evidence that was never recorded', () => {
    const subject = person({ fields: { appearance: { value: 'وصف', claims: legacyUnreviewed } } });

    expect(validateCatalog(catalog({ people: [subject] }), known)).toEqual([]);
  });

  it('rejects a relationship with no reciprocal, which would reach the graph one-directional', () => {
    const subject = person({
      relations: [{ type: 'MENTIONED_IN' as never, to: 'prophet-muhammad', claims: ['pilot/one'] }],
    });

    expect(validateCatalog(catalog({ people: [subject] }), known)).toContainEqual({
      path: 'people/someone.relations.MENTIONED_IN',
      message: 'MENTIONED_IN has no reciprocal',
    });
  });

  it('resolves a relationship to a person the catalog itself authors', () => {
    const pair = [
      person({ slug: 'one', relations: [{ type: 'SON', inverse: 'FATHER', to: 'two', claims: ['pilot/one'] }] }),
      person({ slug: 'two' }),
    ];

    expect(validateCatalog(catalog({ people: pair }), known)).toEqual([]);
  });

  it('reports every problem in one pass rather than stopping at the first', () => {
    const subject = person({
      titles: [{ title: 'unheard-of', claims: ['pilot/absent'] }],
      relations: [{ type: 'SON', inverse: 'FATHER', to: 'nobody', claims: ['pilot/one'] }],
    });

    expect(validateCatalog(catalog({ people: [subject] }), known)).toHaveLength(3);
  });

  // The projector writes both directions, and SON's reciprocal is FATHER or
  // MOTHER depending on a parent's sex, which nothing here records.
  it('asks for the reciprocal when the relation has more than one', () => {
    const subject = person({ relations: [{ type: 'SON', to: 'prophet-muhammad', claims: ['pilot/one'] }] });

    expect(validateCatalog(catalog({ people: [subject] }), known)).toEqual([
      { path: 'people/someone.relations.SON', message: 'SON needs inverse: one of FATHER, MOTHER' },
    ]);
  });

  it('takes the only reciprocal without being told', () => {
    const subject = person({ relations: [{ type: 'COMPANION_OF', to: 'prophet-muhammad', claims: ['pilot/one'] }] });

    expect(validateCatalog(catalog({ people: [subject] }), known)).toEqual([]);
  });

  it('refuses a reciprocal that is not one', () => {
    const subject = person({ relations: [{ type: 'SON', inverse: 'WIFE', to: 'prophet-muhammad', claims: ['pilot/one'] }] });

    expect(validateCatalog(catalog({ people: [subject] }), known)).toEqual([
      { path: 'people/someone.relations.SON', message: 'WIFE is not a reciprocal of SON' },
    ]);
  });

  it('checks battle and event references the same way', () => {
    const subject = catalog({
      battles: [{ kind: 'BATTLE', slug: 'not-a-battle', participants: [{ person: 'prophet-muhammad', isMuslim: true, claims: ['pilot/one'] }] }],
      events: [{ kind: 'EVENT', slug: 'somewhere', name: 'حدث', type: 'OTHER', fields: {}, people: [{ person: 'ghost', claims: ['pilot/one'] }] }],
    });

    expect(validateCatalog(subject, known)).toEqual([
      { path: 'battles/not-a-battle', message: 'unknown battle' },
      { path: 'events/somewhere', message: 'unknown person ghost' },
    ]);
  });
});
