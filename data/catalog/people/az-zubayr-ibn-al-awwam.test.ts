import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type Cited, type Provenance } from '@/lib/catalog/types';
import person from './az-zubayr-ibn-al-awwam';
import badr from '../battles/badr';
import yarmuk from '../battles/yarmuk';
import jamal from '../battles/jamal';

// Read rather than fixtured, so editing the module or the batch alone fails.
const batch = JSON.parse(
  readFileSync('data/history/batches/az-zubayr-ibn-al-awwam/batch.json', 'utf8'),
) as {
  claims: { key: string; field?: string; relationshipType?: string; relatedSubjectSlug?: string; citations: unknown[] }[];
};
const claimByKey = new Map(batch.claims.map((claim) => [claim.key, claim]));

const citedFields = Object.entries(person.fields) as [string, Cited<string>][];
const everyProvenance: [string, Provenance][] = [
  ...citedFields.map(([name, cited]): [string, Provenance] => [name, cited.claims]),
  ...person.titles.map((title): [string, Provenance] => [`title ${title.title}`, title.claims]),
  ...person.relations.map((relation): [string, Provenance] => [`relation ${relation.type}`, relation.claims]),
  ...(person.ayat ?? []).map((ayah): [string, Provenance] => [`ayah ${ayah.surah}:${ayah.ayah}`, ayah.claims]),
];

describe('al-Zubayr ibn al-Awwam in the catalog', () => {
  it('supports every value with a claim the batch actually declares', () => {
    const unknown = everyProvenance.flatMap(([where, claims]) =>
      claims === legacyUnreviewed ? [] : claims.filter((key) => !claimByKey.has(key)).map((key) => `${where}: ${key}`),
    );

    expect(unknown).toEqual([]);
  });

  // Nothing on his profile was carried uncited: his entry speaks to all of it.
  it('carries no value on the legacy marker', () => {
    expect(everyProvenance.filter(([, claims]) => claims === legacyUnreviewed)).toEqual([]);
  });

  it('points a single-claim field at a claim about that same field', () => {
    const mismatched = citedFields.flatMap(([name, cited]) => {
      if (cited.claims === legacyUnreviewed || cited.claims.length !== 1) return [];
      const claim = claimByKey.get(cited.claims[0]);
      return claim?.field && claim.field !== name ? [`${name}: ${claim.key} states ${claim.field}`] : [];
    });

    expect(mismatched).toEqual([]);
  });

  // The old seed gave him four titles; the entry adds a fifth in al-Dhahabi's
  // own voice, so it is evidence-led rather than carried.
  it('adds al-sabiqoon, which the seed never gave him', () => {
    expect(person.titles.map((title) => title.title)).toContain('al-sabiqoon');
    expect(claimByKey.get('zubayr/titles')?.citations).toHaveLength(3);
  });

  // Both parents, both named in the entry, and the reciprocal each needs:
  // SON answers to FATHER for one and MOTHER for the other.
  it('names both parents with the reciprocal each takes', () => {
    const parents = person.relations.filter((relation) => relation.type === 'SON');

    expect(parents.map((relation) => [relation.to, relation.inverse])).toEqual([
      ['al-awwam-ibn-khuwaylid', 'FATHER'],
      ['safiyyah-bint-abd-al-muttalib', 'MOTHER'],
    ]);
  });

  it('records the wounds the entry counts, at Badr and at Yarmuk', () => {
    const at = (battle: { participants: readonly { person: string; status?: readonly string[] }[] }) =>
      battle.participants.find((participant) => participant.person === person.slug);

    expect(at(badr)?.status).toEqual(['INJURED']);
    expect(at(yarmuk)?.status).toEqual(['INJURED']);
    expect(at(jamal)?.status).toEqual(['MARTYRED']);
  });

  // The verse the old seed guessed at, now resting on Aisha naming him in it.
  it('cites the Qur\'an link the seed carried uncited', () => {
    expect(person.ayat).toEqual([{ surah: 3, ayah: 172, claims: ['zubayr/ayah-al-imran'] }]);
  });
});
