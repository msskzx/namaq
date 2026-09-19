import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type Cited, type Provenance } from '@/lib/catalog/types';
import person from './abdur-rahman-ibn-awf';
import badr from '../battles/badr';
import uhud from '../battles/uhud';
import khandaq from '../battles/khandaq';
import abyssinia from '../events/first-hijra-to-abyssinia';
import medina from '../events/hijra-to-medina';
import hajj from '../events/hajj-of-thirteen';
import shura from '../events/shura-after-umar';

// Read rather than fixtured, so editing the module or the batch alone fails.
const batch = JSON.parse(
  readFileSync('data/history/batches/abdur-rahman-ibn-awf/batch.json', 'utf8'),
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

describe('Abd al-Rahman ibn Awf in the catalog', () => {
  it('supports every value with a claim the batch actually declares', () => {
    const unknown = everyProvenance.flatMap(([where, claims]) =>
      claims === legacyUnreviewed ? [] : claims.filter((key) => !claimByKey.has(key)).map((key) => `${where}: ${key}`),
    );

    expect(unknown).toEqual([]);
  });

  // The entry speaks to every field and both of his relations. The one carried
  // value on the profile is the verse the old seed guessed at.
  it('carries nothing uncited but the verse the seed guessed at', () => {
    const carried = everyProvenance.filter(([, claims]) => claims === legacyUnreviewed);

    expect(carried.map(([where]) => where)).toEqual(['ayah 9:100']);
  });

  it('points a single-claim field at a claim about that same field', () => {
    const mismatched = citedFields.flatMap(([name, cited]) => {
      if (cited.claims === legacyUnreviewed || cited.claims.length !== 1) return [];
      const claim = claimByKey.get(cited.claims[0]);
      return claim?.field && claim.field !== name ? [`${name}: ${claim.key} states ${claim.field}`] : [];
    });

    expect(mismatched).toEqual([]);
  });

  // The seed gave him three titles; the naming line counts him among
  // السابقين البدريين, which the seed never did.
  it('adds al-sabiqoon, which the seed never gave him', () => {
    expect(person.titles.map((title) => title.title)).toContain('al-sabiqoon');
  });

  // Uhud is what made him أهتم and أعرج, so the wounds are both his appearance
  // and his status there, and the same claim carries them.
  it('takes his limp and his status at Uhud from one report', () => {
    const at = uhud.participants.find((participant) => participant.person === person.slug);

    expect(at?.status).toEqual(['INJURED']);
    expect(at?.claims).toEqual(['awf/uhud']);
    expect(person.fields.appearance.claims).toContain('awf/appearance');
  });

  it('records Badr from the entry and leaves Khandaq carried', () => {
    const atBadr = badr.participants.find((participant) => participant.person === person.slug);
    const atKhandaq = khandaq.participants.find((participant) => participant.person === person.slug);

    expect(atBadr?.claims).toEqual(['awf/badr']);
    expect(atKhandaq?.claims).toBe(legacyUnreviewed);
  });

  // Uthman's word about الهجرتين جميعا is what puts him on both, and the Shura
  // and the hajj are events this batch authors outright.
  it('puts both hijras, the hajj and the Shura on his timeline', () => {
    const linked = [abyssinia, medina, hajj, shura].map((event) => [
      event.slug,
      event.people.find((entry) => entry.person === person.slug)?.claims,
    ]);

    expect(linked).toEqual([
      ['first-hijra-to-abyssinia', ['awf/hijra-habasha']],
      ['hijra-to-medina', ['awf/hijra-madinah']],
      ['hajj-of-thirteen', ['awf/hajj-thirteen']],
      ['shura-after-umar', ['awf/shura']],
    ]);
  });

  // al-Sha'bi dates the hajj; nothing in the entry dates the Shura.
  it('dates the hajj and leaves the Shura undated', () => {
    expect(hajj.fields.hijriYear.value).toBe(13);
    expect(Object.keys(shura.fields)).not.toContain('hijriYear');
  });
});
