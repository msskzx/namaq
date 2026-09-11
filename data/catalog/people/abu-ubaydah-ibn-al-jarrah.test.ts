import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { RECIPROCAL_INVERSES } from '@/lib/relationship/categories';
import { legacyUnreviewed, type Cited, type Provenance } from '@/lib/catalog/types';
import person from './abu-ubaydah-ibn-al-jarrah';

// Read rather than fixtured, so editing the module or the batch alone fails.
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
    // Single-claim only: a value stitched from several passages legitimately
    // cites claims filed elsewhere, as virtues does through amin-al-ummah.
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
