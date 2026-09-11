import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type Catalog, type CatalogPerson } from './types';
import { awaitingEvidence, catalogProvenance } from './provenance';

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

describe('catalogProvenance', () => {
  it('finds a value however deeply it is nested', () => {
    const subject = person({
      fields: { fullName: { value: 'فلان بن فلان', claims: ['pilot/one'] } },
      titles: [{ title: 'companion', claims: legacyUnreviewed }],
      relations: [{ type: 'SON', to: 'other', claims: ['pilot/two'] }],
    });

    expect(catalogProvenance(catalog({ people: [subject] }))).toEqual([
      { subject: 'people/someone', path: 'fields.fullName', claims: ['pilot/one'] },
      { subject: 'people/someone', path: 'titles[0]', claims: legacyUnreviewed },
      { subject: 'people/someone', path: 'relations[0]', claims: ['pilot/two'] },
    ]);
  });

  it('reaches battle participants and event people too', () => {
    const subject = catalog({
      battles: [{ kind: 'BATTLE', slug: 'badr', participants: [{ person: 'someone', isMuslim: true, claims: legacyUnreviewed }] }],
      events: [{ kind: 'EVENT', slug: 'saqifah', name: 'حدث', type: 'OTHER', fields: { hijriYear: { value: 11, claims: ['pilot/one'] } }, people: [] }],
    });

    expect(catalogProvenance(subject).map((value) => `${value.subject}.${value.path}`)).toEqual([
      'battles/badr.participants[0]',
      'events/saqifah.fields.hijriYear',
    ]);
  });
});

describe('awaitingEvidence', () => {
  it('returns only the values whose evidence is still owed', () => {
    const subject = person({
      fields: {
        fullName: { value: 'فلان', claims: ['pilot/one'] },
        deathYearHijri: { value: '18 AH', claims: legacyUnreviewed },
      },
    });

    expect(awaitingEvidence(catalog({ people: [subject] }))).toEqual([
      { subject: 'people/someone', path: 'fields.deathYearHijri', claims: legacyUnreviewed },
    ]);
  });

  it('is empty when every value is cited', () => {
    const subject = person({ fields: { virtues: { value: 'مناقب', claims: ['pilot/one'] } } });

    expect(awaitingEvidence(catalog({ people: [subject] }))).toEqual([]);
  });
});
