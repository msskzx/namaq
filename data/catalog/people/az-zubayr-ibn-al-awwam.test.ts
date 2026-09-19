import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type Cited, type Provenance } from '@/lib/catalog/types';
import person from './az-zubayr-ibn-al-awwam';
import badr from '../battles/badr';
import yarmuk from '../battles/yarmuk';
import uhud from '../battles/uhud';
import abyssinia from '../events/first-hijra-to-abyssinia';
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

  // His entry speaks to every value on the profile itself. The one carried
  // value is a relation the graph seeds held before his rows there were
  // retired, and the entry never states it.
  it('carries nothing uncited but the cousin the seeds held', () => {
    const carried = everyProvenance.filter(([, claims]) => claims === legacyUnreviewed);

    expect(carried.map(([where]) => where)).toEqual(['relation PATERNAL_COUSIN']);
    expect(person.relations.find((relation) => relation.claims === legacyUnreviewed)?.to).toBe('hakim-ibn-hizam');
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

  // The verse Aisha applies to him says the wound struck the respondents
  // themselves, so the pursuit places him at the battle it followed.
  it('cites Uhud through the seventy who rode out after it', () => {
    const at = uhud.participants.find((participant) => participant.person === person.slug);

    expect(at?.claims).toEqual(['zubayr/uhud']);
    expect(claimByKey.get('zubayr/uhud')?.citations).toHaveLength(2);
    expect(at?.status).toBeUndefined();
  });

  it('records the wounds the entry counts, at Badr and at Yarmuk', () => {
    const at = (battle: { participants: readonly { person: string; status?: readonly string[] }[] }) =>
      battle.participants.find((participant) => participant.person === person.slug);

    expect(at(badr)?.status).toEqual(['INJURED']);
    expect(at(yarmuk)?.status).toEqual(['INJURED']);
    expect(at(jamal)?.status).toEqual(['MARTYRED']);
  });

  // Events are what put a person on the profile timeline, and the entry states
  // this one outright. The unqualified هاجر at 44-p11 names no destination, so
  // no second hijra is authored from it.
  it('links him to the hijra to Abyssinia the entry states', () => {
    const at = abyssinia.people.find((entry) => entry.person === person.slug);

    expect(at?.claims).toEqual(['zubayr/hijra-habasha']);
    expect(claimByKey.get('zubayr/hijra-habasha')?.relatedSubjectSlug).toBe('first-hijra-to-abyssinia');
  });

  // The verse the old seed guessed at, now resting on Aisha naming him in it.
  it('cites the Qur\'an link the seed carried uncited', () => {
    expect(person.ayat).toEqual([{ surah: 3, ayah: 172, claims: ['zubayr/ayah-al-imran'] }]);
  });
});
