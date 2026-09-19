import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type Cited, type Provenance } from '@/lib/catalog/types';
import person from './saad-ibn-abi-waqqas';
import badr from '../battles/badr';
import uhud from '../battles/uhud';
import khandaq from '../battles/khandaq';
import jamal from '../battles/jamal';
import qadisiyyah from '../battles/qadisiyyah';
import ctesiphon from '../battles/fath-ctesiphon';

// Read rather than fixtured, so editing the module or the batch alone fails.
const batch = JSON.parse(readFileSync('data/history/batches/saad-ibn-abi-waqqas/batch.json', 'utf8')) as {
  claims: { key: string; field?: string; confidence?: string; citations: unknown[] }[];
};
const claimByKey = new Map(batch.claims.map((claim) => [claim.key, claim]));

const citedFields = Object.entries(person.fields) as [string, Cited<string>][];
const everyProvenance: [string, Provenance][] = [
  ...citedFields.map(([name, cited]): [string, Provenance] => [name, cited.claims]),
  ...person.titles.map((title): [string, Provenance] => [`title ${title.title}`, title.claims]),
  ...person.relations.map((relation): [string, Provenance] => [`relation ${relation.type}`, relation.claims]),
  ...(person.ayat ?? []).map((ayah): [string, Provenance] => [`ayah ${ayah.surah}:${ayah.ayah}`, ayah.claims]),
];

describe("Sa'd ibn Abi Waqqas in the catalog", () => {
  it('supports every value with a claim the batch actually declares', () => {
    const unknown = everyProvenance.flatMap(([where, claims]) =>
      claims === legacyUnreviewed ? [] : claims.filter((key) => !claimByKey.has(key)).map((key) => `${where}: ${key}`),
    );

    expect(unknown).toEqual([]);
  });

  it('carries nothing uncited but the verse the seed guessed at', () => {
    const carried = everyProvenance.filter(([, claims]) => claims === legacyUnreviewed);

    expect(carried.map(([where]) => where)).toEqual(['ayah 6:124']);
  });

  it('points a single-claim field at a claim about that same field', () => {
    const mismatched = citedFields.flatMap(([name, cited]) => {
      if (cited.claims === legacyUnreviewed || cited.claims.length !== 1) return [];
      const claim = claimByKey.get(cited.claims[0]);
      return claim?.field && claim.field !== name ? [`${name}: ${claim.key} states ${claim.field}`] : [];
    });

    expect(mismatched).toEqual([]);
  });

  // Two values the entry reports more than one way. The field takes the better
  // attested reading and the loser is held as its own claim, not dropped.
  it('keeps the competing build and death year as DISPUTED claims', () => {
    expect(person.fields.appearance.claims).toEqual(['saad/appearance']);
    expect(person.fields.deathYearHijri.value).toBe('55 AH');
    expect(claimByKey.get('saad/appearance-tall')?.confidence).toBe('DISPUTED');
    expect(claimByKey.get('saad/death-year-alt')?.confidence).toBe('DISPUTED');
    expect(claimByKey.get('saad/death-year-alt')?.field).toBe('deathYearHijri');
  });

  // Badr's spoils name two captives he brought in, which is the status.
  it('records Badr with CAPTURED and the two archery battles', () => {
    const at = (battle: { participants: readonly { person: string }[] }) =>
      battle.participants.find((participant) => participant.person === person.slug);

    expect(badr.participants.find((p) => p.person === person.slug)?.status).toEqual(['CAPTURED']);
    expect(at(uhud)).toBeDefined();
    expect(at(khandaq)).toBeDefined();
    expect(claimByKey.has('saad/uhud')).toBe(true);
    expect(claimByKey.has('saad/khandaq')).toBe(true);
  });

  // The first absence the evidence path produced rather than inherited. No
  // status: the entry states the withdrawal without excusing it.
  it('records Jamal as an absence with no status', () => {
    const at = jamal.participants.find((participant) => participant.person === person.slug);

    expect(at?.relation).toBe('ABSENT_FROM');
    expect(at?.status).toBeUndefined();
    expect(at?.claims).toEqual(['saad/jamal']);
  });

  // Qadisiyyah is new and is the only battle here whose year the entry dates.
  it('dates Qadisiyyah from the entry and leaves Ctesiphon carried', () => {
    expect(qadisiyyah.fields.hijriYear.value).toBe(15);
    expect(qadisiyyah.fields.hijriYear.claims).toEqual(['saad/qadisiyyah']);
    expect(ctesiphon.participants[0].claims).toBe(legacyUnreviewed);
  });
});
