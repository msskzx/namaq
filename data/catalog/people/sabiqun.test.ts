import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type CatalogPerson, type Provenance } from '@/lib/catalog/types';
import { RECIPROCAL_INVERSES } from '@/lib/relationship/categories';
import abuBakr from './abu-bakr-as-siddiq';
import prophet from './prophet-muhammad';
import ali from './ali-ibn-abi-talib';
import uthman from './uthman-ibn-affan';
import zubayr from './az-zubayr-ibn-al-awwam';
import awf from './abdur-rahman-ibn-awf';
import talhah from './talhah-ibn-ubaydullah';
import saad from './saad-ibn-abi-waqqas';
import khabbab from './khabbab-ibn-al-aratt';
import ammar from './ammar-ibn-yasir';
import suhayb from './suhaib-ibn-sinan';
import amir from './amir-ibn-rabiah';

type Claim = { key: string; field?: string; relationshipType?: string; relatedSubjectSlug?: string };
const BATCHES = 'data/history/batches';
const claimByKey = new Map(
  readdirSync(BATCHES)
    .flatMap((dir) => (JSON.parse(readFileSync(`${BATCHES}/${dir}/batch.json`, 'utf8')) as { claims: Claim[] }).claims)
    .map((claim) => [claim.key, claim]),
);
const keysOf = (provenance: Provenance | undefined): readonly string[] =>
  provenance === undefined || provenance === legacyUnreviewed ? [] : provenance;

/** The five Ibn Ishaq says answered Abu Bakr, in the order he names them. */
const ANSWERED = ['uthman-ibn-affan', 'az-zubayr-ibn-al-awwam', 'abdur-rahman-ibn-awf', 'talhah-ibn-ubaydullah', 'saad-ibn-abi-waqqas'];
const EIGHT: [string, CatalogPerson][] = [
  ['prophet-muhammad', prophet],
  ['abu-bakr-as-siddiq', abuBakr],
  ['ali-ibn-abi-talib', ali],
  ['uthman-ibn-affan', uthman],
  ['az-zubayr-ibn-al-awwam', zubayr],
  ['abdur-rahman-ibn-awf', awf],
  ['talhah-ibn-ubaydullah', talhah],
  ['saad-ibn-abi-waqqas', saad],
];

describe('the first believers in the catalog', () => {
  it('runs the call from Abu Bakr to the five who answered', () => {
    const called = abuBakr.relations.filter((relation) => relation.type === 'CALLED_TO_ISLAM');

    expect(called.map((relation) => relation.to)).toEqual(ANSWERED);
    expect(called.every((relation) => relation.inverse === 'ANSWERED_CALL_OF')).toBe(true);
  });

  // The direction is Ibn Ishaq's own: فأسلم بدعائه. Reversed, the graph would
  // say the five brought Abu Bakr in.
  it('pairs the new relation with its reciprocal', () => {
    expect(RECIPROCAL_INVERSES.CALLED_TO_ISLAM).toEqual(['ANSWERED_CALL_OF']);
    expect(RECIPROCAL_INVERSES.ANSWERED_CALL_OF).toEqual(['CALLED_TO_ISLAM']);
  });

  it('gives al-sabiqoon to all eight the chapter counts', () => {
    for (const [slug, person] of EIGHT) {
      const titles = person.titles.map((title) => title.title);
      expect(titles, slug).toContain('al-sabiqoon');
    }
  });

  // One rope, one name: a title neither of them holds alone, so both modules
  // have to carry it or the pair reads as one man's epithet.
  it('gives al-qarinayn to both Abu Bakr and Talhah', () => {
    expect(abuBakr.titles.map((title) => title.title)).toContain('al-qarinayn');
    expect(talhah.titles.map((title) => title.title)).toContain('al-qarinayn');
  });

  // A حلف is how the roster tells forty names apart, so it is text on the
  // person and no Tribe node exists for it to point at.
  it('records a حلف as text on the person', () => {
    const affiliated: [string, CatalogPerson][] = [
      ['khabbab-ibn-al-aratt', khabbab],
      ['ammar-ibn-yasir', ammar],
      ['suhaib-ibn-sinan', suhayb],
      ['amir-ibn-rabiah', amir],
    ];

    for (const [slug, person] of affiliated) {
      const cited = person.fields.tribalAffiliation;
      expect(cited?.value, slug).toMatch(/حليف/);
      expect(keysOf(cited?.claims).map((key) => claimByKey.get(key)?.field)).toEqual(['tribalAffiliation']);
      expect(person.relations.every((relation) => relation.type !== 'CALLED_TO_ISLAM')).toBe(true);
    }
  });

  it('backs every value this section added with a claim some batch declares', () => {
    const keys = [
      ...abuBakr.relations.flatMap((relation) => keysOf(relation.claims)),
      ...EIGHT.flatMap(([, person]) => person.titles.flatMap((title) => keysOf(title.claims))),
      ...[khabbab, ammar, suhayb, amir].flatMap((person) => keysOf(person.fields.tribalAffiliation?.claims)),
    ];

    expect(keys.filter((key) => !claimByKey.has(key))).toEqual([]);
  });
});
