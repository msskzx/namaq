import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type CatalogBattle, type CatalogEvent, type CatalogPerson, type Provenance } from '@/lib/catalog/types';
import khadijahIslam from './islam-of-khadijah';
import umarIslam from './islam-of-umar';
import hamzahIslam from './islam-of-hamzah';
import abuDharrIslam from './islam-of-abu-dharr';
import dimadIslam from './islam-of-dimad';
import persecution from './persecution-of-the-early-muslims';
import zaydDeath from './death-of-zayd-ibn-amr';
import zaydMeeting from './meeting-of-the-prophet-and-zayd-ibn-amr';
import dhiAmar from '../battles/ghazwah-dhi-amar';
import bahran from '../battles/ghazwah-bahran';
import qaynuqa from '../battles/ghazwah-bani-qaynuqa';
import hamraAlAsad from '../battles/ghazwah-hamra-al-asad';
import zaydIbnAmr from '../people/zayd-ibn-amr-ibn-nufayl';
import sumayyah from '../people/sumayyah-bint-khayyat';
import dimad from '../people/dimad-al-azdi';
import abuBakr from '../people/abu-bakr-as-siddiq';

type Claim = { key: string; confidence: string; field?: string };
const BATCHES = 'data/history/batches';
const claimByKey = new Map(
  readdirSync(BATCHES)
    .flatMap((dir) => (JSON.parse(readFileSync(`${BATCHES}/${dir}/batch.json`, 'utf8')) as { claims: Claim[] }).claims)
    .map((claim) => [claim.key, claim]),
);

const keysOf = (claims: Provenance | undefined): readonly string[] =>
  claims === undefined || claims === legacyUnreviewed ? [] : claims;

const events: CatalogEvent[] = [
  khadijahIslam,
  umarIslam,
  hamzahIslam,
  abuDharrIslam,
  dimadIslam,
  persecution,
  zaydDeath,
  zaydMeeting,
];
const battles: CatalogBattle[] = [dhiAmar, bahran, qaynuqa, hamraAlAsad];
const created: CatalogPerson[] = [zaydIbnAmr, sumayyah, dimad];

describe('what the heading sweep added to the catalog', () => {
  // The seven the narration names, and every one of them has a subject. That
  // is unusual enough to pin: most rosters in this batch lose people to the
  // app not having them.
  it('puts all seven who first declared Islam on the persecution roster', () => {
    expect(persecution.people.map((entry) => entry.person).sort()).toEqual([
      'abu-bakr-as-siddiq',
      'al-miqdad-ibn-amr',
      'ammar-ibn-yasir',
      'bilal-ibn-rabah',
      'prophet-muhammad',
      'suhaib-ibn-sinan',
      'sumayyah-bint-khayyat',
    ]);
  });

  // Khadijah's precedence is إجماع and the first man is not, so the two claims
  // behind one description must not carry the same confidence.
  it('marks the first man contested and Khadijah settled', () => {
    expect(claimByKey.get('khadijah/first-believer')?.confidence).toBe('ESTABLISHED');
    expect(claimByKey.get('sira/first-man-to-believe')?.confidence).toBe('DISPUTED');
    expect(khadijahIslam.fields.description?.claims).toContain('sira/first-man-to-believe');
  });

  // Meeting and death are two occasions and the sira gives them two isnads, so
  // the claim about the food at Baldah must not hang off the death.
  it('keeps the meeting at Baldah apart from the death', () => {
    expect(zaydMeeting.type).toBe('MET');
    expect(zaydDeath.type).toBe('DEATH');
    expect(zaydMeeting.fields.description?.claims).toEqual(['zayd-amr/ansab']);
    expect(zaydDeath.fields.description?.claims).toEqual(['zayd-amr/ummah-wahdah']);
  });

  it('dates every year-three engagement from the chapter heading', () => {
    for (const battle of battles) {
      expect(battle.fields?.engagement?.value).toBe('GHAZWAH');
      expect(battle.fields?.hijriYear?.value).toBe(3);
    }
  });

  // None of the four ends in fighting the chapter records, and a status would
  // be the reader's inference rather than the book's word.
  it('gives no participant a status in an engagement that saw no fighting', () => {
    expect(battles.flatMap((battle) => battle.participants).filter((entry) => entry.status)).toEqual([]);
  });

  it('records a sex for every person it creates', () => {
    for (const person of created) {
      const sex = person.fields.sex;
      expect(sex?.value).toBeDefined();
      expect(keysOf(sex?.claims).map((key) => claimByKey.get(key)?.field)).toEqual(['sex']);
    }
  });

  // الروم ٢-٤ is quoted whole as what came down over the wager, so collapsing
  // it to one verse would drop two the chapter names.
  it('records Surah ar-Rum verse by verse for Abu Bakr', () => {
    expect(abuBakr.ayat).toEqual([
      { surah: 30, ayah: 2, claims: ['abu-bakr/ayah-ar-rum'] },
      { surah: 30, ayah: 3, claims: ['abu-bakr/ayah-ar-rum'] },
      { surah: 30, ayah: 4, claims: ['abu-bakr/ayah-ar-rum'] },
    ]);
  });

  it('backs every value it added with a claim some batch declares', () => {
    const keys = [
      ...events.flatMap((event) => [
        ...Object.values(event.fields).flatMap((cited) => keysOf(cited?.claims)),
        ...event.people.flatMap((entry) => keysOf(entry.claims)),
      ]),
      ...battles.flatMap((battle) => [
        ...Object.values(battle.fields ?? {}).flatMap((cited) => keysOf(cited?.claims)),
        ...battle.participants.flatMap((entry) => [...keysOf(entry.claims), ...keysOf(entry.summary?.claims)]),
      ]),
    ];

    expect(keys.filter((key) => !claimByKey.has(key))).toEqual([]);
  });
});
