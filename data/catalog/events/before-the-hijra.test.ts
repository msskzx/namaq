import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type CatalogEvent, type Provenance } from '@/lib/catalog/types';
import { validateCatalog } from '@/lib/catalog/validateCatalog';
import isra from './al-isra-wal-miraj';
import abuTalib from './death-of-abu-talib';
import khadijah from './death-of-khadijah';
import boycott from './boycott-of-banu-hashim';

type Claim = { key: string; confidence: string; field?: string };
const BATCHES = 'data/history/batches';
const claimByKey = new Map(
  readdirSync(BATCHES)
    .flatMap((dir) => (JSON.parse(readFileSync(`${BATCHES}/${dir}/batch.json`, 'utf8')) as { claims: Claim[] }).claims)
    .map((claim) => [claim.key, claim]),
);
const keysOf = (provenance: Provenance | undefined): readonly string[] =>
  provenance === undefined || provenance === legacyUnreviewed ? [] : provenance;

const before: [string, CatalogEvent, number][] = [
  ['al-isra-wal-miraj', isra, -1],
  ['death-of-abu-talib', abuTalib, -3],
  ['death-of-khadijah', khadijah, -3],
  ['boycott-of-banu-hashim', boycott, -3],
];

describe('events the sira dates against the hijra', () => {
  it.each(before)('%s carries the year the sira counts back to', (_slug, event, year) => {
    expect(event.fields.hijriYear?.value).toBe(year);
  });

  // The two deaths and the exit from the shi'b are one sentence in al-Waqidi,
  // so they must not drift apart by being cited separately.
  it('dates both deaths and the boycott from the one sentence that dates them', () => {
    for (const [, event] of before.slice(1)) {
      expect(keysOf(event.fields.hijriYear?.claims)).toEqual(['sira/shib-exit-year']);
    }
  });

  // Ibn Sa'd's eighteen months reaches into the year before al-Zuhri's, and
  // the model holds one year, so it has to stay a claim rather than a value.
  it("keeps Ibn Sa'd's eighteen months as a DISPUTED claim no field takes", () => {
    expect(claimByKey.get('sira/isra-year-alt')?.confidence).toBe('DISPUTED');
    expect(keysOf(isra.fields.hijriYear?.claims)).toEqual(['sira/isra-year']);
  });

  it('rejects a year zero, which the era does not have', () => {
    const issues = validateCatalog(
      { people: [], battles: [], utterances: [], events: [{ ...isra, people: [], fields: { hijriYear: { value: 0, claims: ['sira/isra-year'] } } }] },
      { people: new Set(), titles: new Set(), battles: new Set(), claims: new Set(['sira/isra-year']) },
    );

    expect(issues).toEqual([{ path: 'events/al-isra-wal-miraj.hijriYear', message: 'there is no hijri year zero' }]);
  });
});
