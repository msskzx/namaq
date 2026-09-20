import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type CatalogBattle, type Provenance } from '@/lib/catalog/types';
import badr from './badr';
import qiblah from '../events/change-of-the-qiblah';
import fasting from '../events/obligation-of-fasting-ramadan';
import marriage from '../events/marriage-of-ali-and-fatimah';
import deathRuqayyah from '../events/death-of-ruqayyah';
import deathIbnMazun from '../events/death-of-uthman-ibn-mazun';

type Claim = { key: string; citations: { passageAnchor: string }[] };
const BATCHES = 'data/history/batches';
const claimByKey = new Map(
  readdirSync(BATCHES)
    .flatMap((dir) => (JSON.parse(readFileSync(`${BATCHES}/${dir}/batch.json`, 'utf8')) as { claims: Claim[] }).claims)
    .map((claim) => [claim.key, claim]),
);
const keysOf = (claims: Provenance): readonly string[] => (claims === legacyUnreviewed ? [] : claims);

/** The heading سنة اثنتين من الهجرة, which dates chapter four. */
const YEAR_TWO_ANCHOR = '1/297-p1';

// Through the interface: `satisfies` narrows status to each entry's own literal
// tuple, so a bare .includes('MARTYRED') has nothing to compare against.
const battle: CatalogBattle = badr;
const at = (slug: string) => battle.participants.find((participant) => participant.person === slug);

describe('Badr after chapter four', () => {
  it('backs every participation with a claim some batch declares', () => {
    const unknown = battle.participants
      .flatMap((participant) => keysOf(participant.claims).map((key) => [participant.person, key] as const))
      .filter(([, key]) => !claimByKey.has(key));

    expect(unknown).toEqual([]);
  });

  // The year was carried from the old seed with no citation until this chapter
  // was read. It is the first legacy value this pass has promoted, so the test
  // asserts both that the marker is gone and what replaced it.
  it('takes its year off the legacy marker onto a cited claim', () => {
    expect(badr.fields?.hijriYear?.claims).not.toBe(legacyUnreviewed);
    expect(badr.fields?.hijriYear?.value).toBe(2);
    expect(badr.fields?.hijriYear?.claims).toEqual(['sira/badr']);

    const anchors = claimByKey.get('sira/badr')?.citations.map((citation) => citation.passageAnchor) ?? [];
    expect(anchors).toContain(YEAR_TWO_ANCHOR);
  });

  // ADR 0013: attendance is the relation, outcome is the status. Four of the
  // fourteen named martyrs have subjects; the absences carry their own reason.
  it('separates the martyrs from the excused absences', () => {
    const martyrs = battle.participants
      .filter((participant) => participant.status?.includes('MARTYRED'))
      .map((participant) => participant.person);
    expect(martyrs.sort()).toEqual(
      ['aqil-ibn-al-bukayr', 'saad-ibn-khaythamah', 'safwan-ibn-bayda', 'ubaydah-ibn-al-harith'].sort(),
    );
    expect(martyrs.every((slug) => at(slug)?.relation === undefined)).toBe(true);

    for (const slug of ['uthman-ibn-affan', 'saeed-ibn-zaid', 'talhah-ibn-ubaydullah', 'salman-al-farisi']) {
      expect(at(slug)?.relation).toBe('ABSENT_FROM');
      expect(at(slug)?.status).toEqual(['ABSENT_EXCUSED']);
    }
  });

  // Uthman's absence and Ruqayyah's death are the same fact seen twice, so the
  // two records have to agree about the year.
  it("ties Uthman's absence to the year Ruqayyah died", () => {
    expect(at('uthman-ibn-affan')?.claims).toEqual(['uthman/badr-absent']);
    expect(deathRuqayyah.fields.hijriYear?.value).toBe(2);
  });

  it('dates every new event of this chapter to year two', () => {
    for (const event of [qiblah, fasting, marriage, deathRuqayyah, deathIbnMazun]) {
      expect(event.fields.hijriYear?.value).toBe(2);

      const yearClaims = event.fields.hijriYear?.claims;
      const anchors = (yearClaims ? keysOf(yearClaims) : []).flatMap(
        (key) => claimByKey.get(key)?.citations.map((citation) => citation.passageAnchor) ?? [],
      );
      expect(anchors).toContain(YEAR_TWO_ANCHOR);
    }
  });
});
