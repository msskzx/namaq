import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type Cited, type Provenance } from '@/lib/catalog/types';
import person from './prophet-muhammad';
import birth from '../events/birth-prophet-muhammad';

const batch = JSON.parse(
  readFileSync('data/history/batches/prophet-muhammad-lineage-and-birth/batch.json', 'utf8'),
) as { claims: { key: string; field?: string; confidence?: string; subjectSlug: string }[] };
const claimByKey = new Map(batch.claims.map((claim) => [claim.key, claim]));

const everyProvenance: [string, Provenance][] = [
  ...(Object.entries(person.fields) as [string, Cited<string>][]).map(
    ([name, cited]): [string, Provenance] => [name, cited.claims],
  ),
  ...person.titles.map((title): [string, Provenance] => [`title ${title.title}`, title.claims]),
  ...person.relations.map((relation): [string, Provenance] => [`relation ${relation.type}`, relation.claims]),
  ...(person.ayat ?? []).map((ayah): [string, Provenance] => [`ayah ${ayah.surah}:${ayah.ayah}`, ayah.claims]),
];

describe('the Prophet in the catalog', () => {
  it('supports every value with a claim the batch actually declares', () => {
    const unknown = everyProvenance.flatMap(([where, claims]) =>
      claims === legacyUnreviewed ? [] : claims.filter((key) => !claimByKey.has(key)).map((key) => `${where}: ${key}`),
    );

    expect(unknown).toEqual([]);
  });

  // The sira runs to page 1154 and this batch read 13 pages of it, so he must
  // stay seed-authored: that is what keeps catalog:project additive for him and
  // stops a partial module deleting the values it has not reached yet.
  it('stays seed-authored, so the catalog only adds to him', () => {
    const seed = readFileSync('prisma/personSeedData.ts', 'utf8');

    expect(seed).toContain("slug: 'prophet-muhammad'");
  });

  // Nothing carries the marker, because the seed is still the author of every
  // value this batch did not reach.
  it('carries no legacy marker, unlike the migrated companions', () => {
    expect(everyProvenance.filter(([, claims]) => claims === legacyUnreviewed)).toEqual([]);
  });

  // Two of the seed's twelve titles are not in these pages and are left alone.
  it('claims ten titles and leaves the two it found nothing for', () => {
    const held = person.titles.map((title) => title.title);

    expect(held).toHaveLength(10);
    expect(held).not.toContain('the-intercessor');
    expect(held).not.toContain('master-of-children-of-adam');
  });

  // عام الفيل is neither a hijri nor a Gregorian year, so no year is written.
  it('writes no birth year, since the entry gives only عام الفيل', () => {
    expect(Object.keys(person.fields)).not.toContain('birthYearHijri');
    expect(Object.keys(person.fields)).not.toContain('birthYearGregorian');
    expect(Object.keys(birth.fields)).not.toContain('hijriYear');
  });

  // The day is disputed and the model holds it, so both readings are authored
  // and the competing one is a claim about the event, not about him.
  it('keeps the competing birth day as a DISPUTED claim on the event', () => {
    expect(birth.fields.description.claims).toEqual(['prophet/birth-year', 'prophet/birth-day']);
    expect(claimByKey.get('prophet/birth-day-alt')?.confidence).toBe('DISPUTED');
    expect(claimByKey.get('prophet/birth-day-alt')?.subjectSlug).toBe('birth-prophet-muhammad');
  });
});
