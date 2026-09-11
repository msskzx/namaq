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
    const pair = [person({ slug: 'one', relations: [{ type: 'SON', to: 'two', claims: ['pilot/one'] }] }), person({ slug: 'two' })];

    expect(validateCatalog(catalog({ people: pair }), known)).toEqual([]);
  });

  it('reports every problem in one pass rather than stopping at the first', () => {
    const subject = person({
      titles: [{ title: 'unheard-of', claims: ['pilot/absent'] }],
      relations: [{ type: 'SON', to: 'nobody', claims: ['pilot/one'] }],
    });

    expect(validateCatalog(catalog({ people: [subject] }), known)).toHaveLength(3);
  });

  it('checks battle and event references the same way', () => {
    const subject = catalog({
      battles: [{ kind: 'BATTLE', slug: 'not-a-battle', participants: [{ person: 'prophet-muhammad', isMuslim: true, claims: ['pilot/one'] }] }],
      events: [{ kind: 'EVENT', slug: 'somewhere', name: 'حدث', type: 'OTHER', fields: {}, people: [{ person: 'ghost', claims: ['pilot/one'] }], battle: 'badr' }],
    });

    expect(validateCatalog(subject, known)).toEqual([
      { path: 'battles/not-a-battle', message: 'unknown battle' },
      { path: 'events/somewhere', message: 'unknown person ghost' },
    ]);
  });
});
