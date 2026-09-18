import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type Cited, type Provenance } from '@/lib/catalog/types';
import person from './talhah-ibn-ubaydullah';
import badr from '../battles/badr';
import uhud from '../battles/uhud';
import jamal from '../battles/jamal';

// Read rather than fixtured, so editing the module or the batch alone fails.
const batch = JSON.parse(
  readFileSync('data/history/batches/talhah-ibn-ubaydullah/batch.json', 'utf8'),
) as {
  claims: { key: string; field?: string; relationshipType?: string; relatedSubjectSlug?: string; citations: unknown[] }[];
};
const claimByKey = new Map(batch.claims.map((claim) => [claim.key, claim]));

const citedFields = Object.entries(person.fields) as [string, Cited<string>][];
const everyProvenance: [string, Provenance][] = [
  ...citedFields.map(([name, cited]): [string, Provenance] => [name, cited.claims]),
  ...person.titles.map((title): [string, Provenance] => [`title ${title.title}`, title.claims]),
  ...person.relations.map((relation): [string, Provenance] => [`relation ${relation.type}`, relation.claims]),
];

describe('Talhah ibn Ubaydullah in the catalog', () => {
  it('supports every cited value with a claim the batch actually declares', () => {
    const unknown = everyProvenance.flatMap(([where, claims]) =>
      claims === legacyUnreviewed ? [] : claims.filter((key) => !claimByKey.has(key)).map((key) => `${where}: ${key}`),
    );

    expect(unknown).toEqual([]);
  });

  it('points a single-claim field at a claim about that same field', () => {
    const mismatched = citedFields.flatMap(([name, cited]) => {
      if (cited.claims === legacyUnreviewed || cited.claims.length !== 1) return [];
      const claim = claimByKey.get(cited.claims[0]);
      return claim?.field && claim.field !== name ? [`${name}: ${claim.key} states ${claim.field}`] : [];
    });

    expect(mismatched).toEqual([]);
  });

  // The entry never seats him among the six, and a batch that says nothing
  // about a value leaves it owed rather than borrowing another claim for it.
  it('leaves the shura title on the legacy marker, because the entry is silent', () => {
    const shura = person.titles.find((title) => title.title === 'the-six-of-the-shura');

    expect(shura?.claims).toBe(legacyUnreviewed);
  });

  it('records the appearance as disputed, carrying both reported complexions', () => {
    expect(person.fields.appearance?.claims).toEqual(['talhah/appearance']);
    expect(claimByKey.get('talhah/appearance')?.citations).toHaveLength(2);
  });

  // The old seed had him at Badr with no status. The entry says he was away
  // trading in Syria, so the link stays as an absence rather than disappearing.
  it('links him to Badr as an absence, and to Uhud and Jamal as a participant', () => {
    const at = (battle: {
      participants: readonly { person: string; relation?: string; status?: readonly string[]; claims: Provenance }[];
    }) => battle.participants.find((participant) => participant.person === person.slug);

    expect(at(badr)?.relation).toBe('ABSENT_FROM');
    expect(at(badr)?.status).toEqual(['ABSENT_EXCUSED']);
    expect(at(badr)?.claims).toEqual(['talhah/badr']);

    expect(at(uhud)?.relation).toBeUndefined();
    expect(at(uhud)?.status).toEqual(['INJURED']);
    expect(at(jamal)?.status).toEqual(['MARTYRED']);
  });

  // The entry dates the killing, not the battle. Jamal is dated through it,
  // the way the pilot dates the plague through the death it caused.
  it('dates Jamal from the killing it caused, on the same claims', () => {
    expect(jamal.fields?.hijriYear?.claims).toContain('talhah/death-year');
    expect(person.fields.deathYearHijri?.claims).toEqual(['talhah/death-year']);
    expect(jamal.fields?.hijriYear?.value).toBe(36);
  });

  // The book's wording, not ours, and cited like any other value.
  it('carries each participation summary from the entry, with its claim', () => {
    const summaries = [badr, uhud, jamal].map(
      (battle) => battle.participants.find((participant) => participant.person === person.slug)?.summary,
    );

    summaries.forEach((summary) => {
      expect(summary?.value).toBeTruthy();
      expect(summary?.claims).not.toBe(legacyUnreviewed);
    });
    expect(summaries[0]?.value).toContain('بِسَهْمِهِ');
  });
});
