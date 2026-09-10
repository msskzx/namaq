import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { RECIPROCAL_INVERSES } from '@/lib/relationship/categories';
import { legacyUnreviewed, type Cited, type Provenance } from '@/lib/catalog/types';
import person from './abu-ubaydah-ibn-al-jarrah';

// The catalog states values; the batch states the evidence. These tests hold
// the two together, so editing one without the other fails rather than drifts.
const batch = JSON.parse(
  readFileSync('data/history/batches/abu-ubaydah-pilot/batch.json', 'utf8'),
) as {
  claims: { key: string; field?: string; relationshipType?: string; relatedSubjectSlug?: string }[];
};
const claimByKey = new Map(batch.claims.map((claim) => [claim.key, claim]));

const citedFields = Object.entries(person.fields) as [string, Cited<string>][];
const everyProvenance: [string, Provenance][] = [
  ...citedFields.map(([name, cited]): [string, Provenance] => [name, cited.claims]),
  ...person.titles.map((title): [string, Provenance] => [`title ${title.title}`, title.claims]),
  ...person.relations.map((relation): [string, Provenance] => [`relation ${relation.type}`, relation.claims]),
];

describe('Abu Ubaydah ibn al-Jarrah in the catalog', () => {
  it('supports every value with a claim the pilot batch actually declares', () => {
    const unknown = everyProvenance.flatMap(([where, claims]) =>
      claims === legacyUnreviewed ? [] : claims.filter((key) => !claimByKey.has(key)).map((key) => `${where}: ${key}`),
    );

    expect(unknown).toEqual([]);
  });

  it('carries nothing on the legacy marker, because this subject was authored from a source', () => {
    expect(everyProvenance.filter(([, claims]) => claims === legacyUnreviewed)).toEqual([]);
  });

  it('points a single-claim field at a claim about that same field', () => {
    // A value stitched from several passages may cite claims filed under other
    // fields: the virtues text draws on the passage the amin-al-ummah claim
    // cites. A value resting on one claim has no such excuse, so that claim
    // must name this field or name none.
    const mismatched = citedFields.flatMap(([name, cited]) => {
      if (cited.claims === legacyUnreviewed || cited.claims.length !== 1) return [];
      const claim = claimByKey.get(cited.claims[0]);
      return claim?.field && claim.field !== name ? [`${name}: ${claim.key} states ${claim.field}`] : [];
    });

    expect(mismatched).toEqual([]);
  });

  it('takes the death year al-Dhahabi prefers and leaves the other in the batch', () => {
    expect(person.fields.deathYearHijri?.claims).toEqual(['abu-ubaydah/death-year-18']);
    expect(claimByKey.has('abu-ubaydah/death-year-17')).toBe(true);
  });

  it('declares only relationships the reciprocal map can invert', () => {
    // The projector derives the opposite edge rather than having it declared,
    // so a type with no inverse would reach Neo4j one-directional.
    const uninvertible = person.relations.filter((relation) => !(relation.type in RECIPROCAL_INVERSES));

    expect(uninvertible).toEqual([]);
    expect(RECIPROCAL_INVERSES.SON).toContain('FATHER');
    expect(RECIPROCAL_INVERSES.COMPANION_OF).toEqual(['ACCOMPANIED_BY']);
  });

  it('matches the batch on who he accompanied', () => {
    const claim = claimByKey.get('abu-ubaydah/companion-of-prophet');
    const relation = person.relations.find((candidate) => candidate.type === 'COMPANION_OF');

    expect(relation?.to).toBe(claim?.relatedSubjectSlug);
  });
});
