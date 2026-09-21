import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadCatalog } from '@/lib/catalog/loadCatalog';
import { validateCatalog } from '@/lib/catalog/validateCatalog';
import { legacyUnreviewed, UTTERANCE_KINDS, type CatalogUtterance, type Provenance } from '@/lib/catalog/types';

type Claim = { key: string; field?: string };
const BATCHES = 'data/history/batches';
const claimByKey = new Map(
  readdirSync(BATCHES)
    .flatMap((dir) => (JSON.parse(readFileSync(`${BATCHES}/${dir}/batch.json`, 'utf8')) as { claims: Claim[] }).claims)
    .map((claim) => [claim.key, claim]),
);
const keysOf = (provenance: Provenance | undefined): readonly string[] =>
  provenance === undefined || provenance === legacyUnreviewed ? [] : provenance;

const catalog = await loadCatalog();
const utterances = catalog.utterances;

const known = {
  people: new Set(['abu-talib', 'prophet-muhammad']),
  titles: new Set<string>(),
  battles: new Set(['uhud']),
  claims: new Set(claimByKey.keys()),
};

const base: CatalogUtterance = {
  kind: 'UTTERANCE',
  slug: 'test-utterance',
  utteranceKind: 'SAYING',
  speaker: 'prophet-muhammad',
  textArabic: { value: 'قول', claims: ['prophet/saying-ghifar'] },
  fields: {},
};
const only = (utterance: CatalogUtterance) =>
  validateCatalog({ people: [], battles: [], events: [], utterances: [utterance] }, known);

describe('the utterance catalog', () => {
  it('has both kinds in use', () => {
    const kinds = new Set(utterances.map((utterance) => utterance.utteranceKind));
    expect([...kinds].sort()).toEqual([...UTTERANCE_KINDS].sort());
  });

  it('backs every value with a claim about an utterance', () => {
    for (const utterance of utterances) {
      const keys = [
        ...keysOf(utterance.textArabic.claims),
        ...Object.values(utterance.fields).flatMap((cited) => keysOf(cited?.claims)),
      ];
      expect(keys.length).toBeGreaterThan(0);
      expect(keys.map((key) => claimByKey.get(key)?.field)).toEqual(keys.map(() => 'utterance'));
    }
  });

  // A poet the chapter names once is a name, not a subject. Both halves of the
  // rule matter: no speaker at all loses the attribution, and both at once
  // means two different answers to one question.
  it('takes one speaker, either a subject or a name', () => {
    expect(only({ ...base, speaker: undefined })).toEqual([
      { path: 'utterances/test-utterance', message: 'no speaker: name a subject or record the name as text' },
    ]);
    expect(
      only({ ...base, fields: { speakerName: { value: 'فلان', claims: ['prophet/saying-ghifar'] } } }),
    ).toEqual([{ path: 'utterances/test-utterance', message: 'two speakers: a subject and a name' }]);
    expect(only({ ...base, speaker: undefined, fields: { speakerName: { value: 'فلان', claims: ['prophet/saying-ghifar'] } } })).toEqual([]);
  });

  it('rejects a kind outside the vocabulary', () => {
    expect(only({ ...base, utteranceKind: 'HADITH' as never })).toEqual([
      { path: 'utterances/test-utterance', message: 'unknown utterance kind HADITH' },
    ]);
  });

  it('rejects an unknown speaker, event or battle', () => {
    expect(only({ ...base, speaker: 'nobody' })[0].message).toBe('unknown person nobody');
    expect(only({ ...base, event: 'no-such-event' })[0].message).toBe('unknown event no-such-event');
    expect(only({ ...base, battle: 'no-such-battle' })[0].message).toBe('unknown battle no-such-battle');
  });

  // The grading is a quotation, so it has to read as one: a word the source
  // wrote, not a verdict the app reached.
  it('carries a grading only as the source words it', () => {
    const graded = utterances.filter((utterance) => utterance.fields.grading);
    expect(graded.map((utterance) => utterance.fields.grading?.value)).toEqual(['أخرجه مسلم', 'إسناده حسن']);
  });

  // A poet with no subject is the common case in the sira's verse, and keeping
  // him out of the people catalog is the point of speakerName.
  it('keeps the unnamed poets as text rather than as subjects', () => {
    const byName = utterances.filter((utterance) => utterance.fields.speakerName);
    const authored = new Set(catalog.people.map((person) => person.slug));

    expect(byName.length).toBeGreaterThan(0);
    for (const utterance of byName) {
      expect(utterance.speaker).toBeUndefined();
      expect(authored.has(utterance.fields.speakerName!.value)).toBe(false);
    }
  });
});
