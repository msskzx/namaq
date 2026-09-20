import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';
import uhud from './uhud';

type Claim = { key: string; confidence?: string; disputed?: boolean; citations: { passageAnchor: string }[] };
const BATCHES = 'data/history/batches';
const claimByKey = new Map(
  readdirSync(BATCHES)
    .flatMap((dir) => (JSON.parse(readFileSync(`${BATCHES}/${dir}/batch.json`, 'utf8')) as { claims: Claim[] }).claims)
    .map((claim) => [claim.key, claim]),
);

const battle: CatalogBattle = uhud;
const at = (slug: string) => battle.participants.find((participant) => participant.person === slug);

/** The heading سنة ثلاث من الهجرة, which dates chapter five. */
const YEAR_THREE_ANCHOR = '1/375-p1';

describe('Uhud after chapter five', () => {
  it('backs every participation with a claim some batch declares', () => {
    const unknown = battle.participants
      .flatMap((participant) =>
        participant.claims === legacyUnreviewed ? [] : participant.claims.map((key) => [participant.person, key] as const),
      )
      .filter(([, key]) => !claimByKey.has(key));

    expect(unknown).toEqual([]);
  });

  // Like Badr's, both values were carried from the old seed with no citation.
  // Chapter five is what let them off the marker.
  it('takes its year and its engagement off the legacy marker', () => {
    expect(uhud.fields?.hijriYear?.claims).toEqual(['sira/uhud']);
    expect(uhud.fields?.hijriYear?.value).toBe(3);
    expect(uhud.fields?.engagement?.claims).toEqual(['sira/uhud']);
    expect(uhud.fields?.engagement?.value).toBe('GHAZWAH');

    const anchors = claimByKey.get('sira/uhud')?.citations.map((citation) => citation.passageAnchor) ?? [];
    expect(anchors).toContain(YEAR_THREE_ANCHOR);
  });

  // Qatadah says Saturday the eleventh of Shawwal, Ibn Ishaq the fifteenth.
  // The model holds no day, so the second is DISPUTED and lives in prose.
  it("keeps Ibn Ishaq's date as a disputed claim rather than a second year", () => {
    expect(claimByKey.get('sira/uhud-date-alt')?.confidence).toBe('DISPUTED');
    expect(claimByKey.get('sira/uhud-date-alt')?.disputed).toBe(true);
  });

  // ADR 0013 again: the Prophet was wounded but present, Salman was absent with
  // a reason, and the dead carry MARTYRED without a relation.
  it('separates being wounded from being absent from being killed', () => {
    expect(at('prophet-muhammad')?.status).toEqual(['INJURED']);
    expect(at('prophet-muhammad')?.relation).toBeUndefined();

    expect(at('salman-al-farisi')?.relation).toBe('ABSENT_FROM');
    expect(at('salman-al-farisi')?.status).toEqual(['ABSENT_EXCUSED']);

    const martyrs = battle.participants
      .filter((participant) => participant.status?.includes('MARTYRED'))
      .map((participant) => participant.person);
    expect(martyrs).toContain('hamzah-ibn-abd-al-muttalib');
    expect(martyrs).toContain('musab-ibn-umayr');
    expect(martyrs.every((slug) => at(slug)?.relation === undefined)).toBe(true);
  });

  // Three of the dead had no subject in the app until this chapter.
  it('creates the subjects Uhud needed', () => {
    for (const slug of ['hanzalah-ibn-abi-amir', 'abdullah-ibn-jubayr', 'anas-ibn-an-nadr']) {
      expect(at(slug)?.status).toEqual(['MARTYRED']);
    }
  });
});
