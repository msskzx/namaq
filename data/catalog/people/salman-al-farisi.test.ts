import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { CatalogBattle } from '@/lib/catalog/types';
import badr from '../battles/badr';
import uhud from '../battles/uhud';
import khandaq from '../battles/khandaq';
import islam from '../events/islam-of-salman-al-farisi';

const batch = JSON.parse(readFileSync('data/history/batches/prophet-muhammad-sira/batch.json', 'utf8')) as {
  claims: { key: string; relationshipType?: string; relatedSubjectSlug?: string }[];
};
const claimByKey = new Map(batch.claims.map((claim) => [claim.key, claim]));

const SLUG = 'salman-al-farisi';

describe('Salman al-Farisi from the sira', () => {
  // ADR 0013: being there is the relation, what happened there is the status.
  // One sentence of his own account settles all three battles.
  it('marks Badr and Uhud absences and Khandaq a participation', () => {
    const at = (battle: CatalogBattle) => battle.participants.find((participant) => participant.person === SLUG);
    const atBadr = at(badr);
    const atUhud = at(uhud);
    const atKhandaq = at(khandaq);

    expect(atBadr?.relation).toBe('ABSENT_FROM');
    expect(atBadr?.status).toEqual(['ABSENT_EXCUSED']);
    expect(atUhud?.relation).toBe('ABSENT_FROM');
    expect(atUhud?.status).toEqual(['ABSENT_EXCUSED']);
    expect(atKhandaq?.relation).toBeUndefined();
    expect(atKhandaq?.status).toBeUndefined();
  });

  it('takes each battle from a claim naming that battle', () => {
    expect(claimByKey.get('salman/badr')).toMatchObject({ relationshipType: 'ABSENT_FROM', relatedSubjectSlug: 'badr' });
    expect(claimByKey.get('salman/uhud')).toMatchObject({ relationshipType: 'ABSENT_FROM', relatedSubjectSlug: 'uhud' });
    expect(claimByKey.get('salman/khandaq')).toMatchObject({
      relationshipType: 'PARTICIPATED_IN',
      relatedSubjectSlug: 'khandaq',
    });
  });

  // The sira places his Islam at Medina and dates it by nothing, so the event
  // carries a description and no year.
  it('adds his Islam as an undated event', () => {
    expect(islam.people).toEqual([{ person: SLUG, claims: ['salman/islam'] }]);
    expect(Object.keys(islam.fields)).toEqual(['description']);
  });
});
