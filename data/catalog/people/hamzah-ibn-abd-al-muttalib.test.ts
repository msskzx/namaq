import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type Provenance } from '@/lib/catalog/types';
import { RECIPROCAL_INVERSES } from '@/lib/relationship/categories';
import { catalogRelations } from '@/lib/catalog/relations';
import hamzah from './hamzah-ibn-abd-al-muttalib';
import abuSalamah from './abu-salamah';
import prophet from './prophet-muhammad';
import uhud from '../battles/uhud';

type Claim = { key: string; field?: string; relationshipType?: string; relatedSubjectSlug?: string };
const BATCHES = 'data/history/batches';
const claimByKey = new Map(
  readdirSync(BATCHES)
    .flatMap((dir) => (JSON.parse(readFileSync(`${BATCHES}/${dir}/batch.json`, 'utf8')) as { claims: Claim[] }).claims)
    .map((claim) => [claim.key, claim]),
);
const keysOf = (provenance: Provenance | undefined): readonly string[] =>
  provenance === undefined || provenance === legacyUnreviewed ? [] : provenance;

describe('Hamzah ibn Abd al-Muttalib in the catalog', () => {
  // The book calls him عمه in three places and never gives it a section, so it
  // went unrecorded while the battles he fought in did not.
  it('makes him the Prophet’s paternal uncle', () => {
    const uncle = hamzah.relations.find((relation) => relation.type === 'PATERNAL_UNCLE');

    expect(uncle?.to).toBe('prophet-muhammad');
    expect(uncle?.inverse).toBe('PATERNAL_NEPHEW');
  });

  // Thuwaybah nursed the three of them together, so the tie is between the
  // nurslings and the wet nurse needs no subject for it to exist.
  it('ties him and Abu Salamah to the Prophet by milk', () => {
    for (const person of [hamzah, abuSalamah]) {
      const milk = person.relations.find((relation) => relation.type === 'MILK_BROTHER');
      expect(milk?.to).toBe('prophet-muhammad');
    }
    expect(RECIPROCAL_INVERSES.MILK_BROTHER).toEqual(['MILK_BROTHER', 'MILK_SISTER']);
  });

  // A milk sibling's reciprocal depends on the far end's sex, which is why
  // MILK_SISTER exists at all even though nobody holds it yet.
  it('writes both directions of the milk tie', () => {
    const edges = catalogRelations({ people: [hamzah, prophet], battles: [], events: [], utterances: [] });
    const milk = edges.filter((edge) => edge.type === 'MILK_BROTHER');

    expect(milk).toContainEqual({ from: 'hamzah-ibn-abd-al-muttalib', to: 'prophet-muhammad', type: 'MILK_BROTHER' });
    expect(milk).toContainEqual({ from: 'prophet-muhammad', to: 'hamzah-ibn-abd-al-muttalib', type: 'MILK_BROTHER' });
  });

  // He called himself this at Uhud; the book does not assign it to him.
  it('gives him asadu-allah from his own words', () => {
    expect(hamzah.titles.map((title) => title.title)).toEqual(['asadu-allah']);
    expect(claimByKey.get('hamzah/asadu-allah')?.field).toBe('titles');
  });

  it('keeps his Uhud death where it already was', () => {
    const there = uhud.participants.find((entry) => entry.person === 'hamzah-ibn-abd-al-muttalib');
    expect(there?.status).toEqual(['MARTYRED']);
  });

  it('backs every value with a claim some batch declares', () => {
    const keys = [
      ...Object.values(hamzah.fields).flatMap((cited) => keysOf(cited?.claims)),
      ...hamzah.titles.flatMap((title) => keysOf(title.claims)),
      ...[...hamzah.relations, ...abuSalamah.relations].flatMap((relation) => keysOf(relation.claims)),
    ];

    expect(keys.filter((key) => !claimByKey.has(key))).toEqual([]);
  });
});
