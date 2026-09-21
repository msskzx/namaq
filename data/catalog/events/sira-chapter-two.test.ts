import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type CatalogEvent, type Provenance } from '@/lib/catalog/types';
import prophet from '../people/prophet-muhammad';
import abuBakr from '../people/abu-bakr-as-siddiq';
import asma from '../people/asma-bint-abi-bakr';
import habashaFirst from './first-hijra-to-abyssinia';
import habashaSecond from './second-hijra-to-abyssinia';
import madinah from './hijra-to-medina';
import aqabaFirst from './first-pledge-of-aqaba';
import aqabaSecond from './second-pledge-of-aqaba';
import isra from './al-isra-wal-miraj';
import moon from './splitting-of-the-moon';
import boycott from './boycott-of-banu-hashim';
import taif from './journey-to-taif';
import deathKhadijah from './death-of-khadijah';
import deathAbuTalib from './death-of-abu-talib';

type Claim = { key: string; confidence?: string; disputed?: boolean; citations: { passageAnchor: string }[] };

// Two of these events are shared: al-Zubayr and Abd al-Rahman reached them from
// their own entries, so their claims live in their own batches. Read every
// batch, the way validateCatalog does, or a shared event looks unbacked.
const BATCHES = 'data/history/batches';
const everyClaim = readdirSync(BATCHES).flatMap(
  (dir) => (JSON.parse(readFileSync(`${BATCHES}/${dir}/batch.json`, 'utf8')) as { claims: Claim[] }).claims,
);
const claimByKey = new Map(everyClaim.map((claim) => [claim.key, claim]));

/** Nothing in this chapter carries the marker, but Provenance allows it. */
const keysOf = (claims: Provenance): readonly string[] => (claims === legacyUnreviewed ? [] : claims);

const chapterTwo: CatalogEvent[] = [
  habashaSecond, aqabaFirst, aqabaSecond, isra, moon, boycott, taif, deathKhadijah, deathAbuTalib,
];

describe('chapter two of the sira in the catalog', () => {
  it('backs every event value with a claim the batch declares', () => {
    const unknown = [...chapterTwo, habashaFirst, madinah].flatMap((event) => [
      ...Object.entries(event.fields).flatMap(([name, cited]) =>
        keysOf(cited?.claims ?? []).map((key) => [`${event.slug}.${name}`, key] as const),
      ),
      ...event.people.flatMap((entry) =>
        keysOf(entry.claims).map((key) => [`${event.slug}.${entry.person}`, key] as const),
      ),
    ]).filter(([, key]) => !claimByKey.has(key));

    expect(unknown).toEqual([]);
  });

  // Chapter two is printed 1/146 to 1/276, so every citation it authored has to
  // sit in volume one. A 2/ anchor would mean a later chapter was read ahead.
  it('cites volume one only', () => {
    const anchors = chapterTwo.flatMap((event) =>
      event.people.flatMap((entry) =>
        keysOf(entry.claims).flatMap((key) => claimByKey.get(key)?.citations.map((c) => c.passageAnchor) ?? []),
      ),
    );

    expect(anchors.length).toBeGreaterThan(0);
    expect(anchors.every((anchor) => anchor.startsWith('1/'))).toBe(true);
  });

  // Neither is a new title; both are newly cited for their holder. Later
  // chapters add more to Abu Bakr, so this asserts that his is present rather
  // than that it is all he has.
  it('gives Abu Bakr as-siddiq and Asma dhat-an-nitaqayn', () => {
    expect(abuBakr.titles.map((t) => t.title)).toContain('siddiq-al-ummah');
    expect(asma.titles.map((t) => t.title)).toEqual(['dhat-an-nitaqayn']);
  });

  // Both married after Khadijah died and before the hijra.
  // Later chapters add more wives, so this asserts the three chapter two knows
  // about and their order, not the whole list.
  it('adds Aisha and Sawdah as wives without disturbing Khadijah', () => {
    const wives = prophet.relations.filter((r) => r.type === 'HUSBAND').map((r) => r.to);

    expect(wives.slice(0, 3)).toEqual(['khadijah-bint-khuwaylid', 'aisha-bint-abi-bakr', 'sawdah-bint-zamah']);
  });

  // A description is one value, so it names both orders and holds both claims.
  it('keeps both reports of whether Khadijah died before Abu Talib', () => {
    expect(deathKhadijah.fields.description?.claims).toContain('sira/death-khadijah');
    expect(deathKhadijah.fields.description?.claims).toContain('sira/death-khadijah-order-alt');
    expect(claimByKey.get('sira/death-khadijah-order-alt')?.confidence).toBe('DISPUTED');
    expect(claimByKey.get('sira/death-khadijah-order-alt')?.disputed).toBe(true);
  });

  // Dated against the hijra, which a negative year holds: the Isra' at -1, and
  // the exit from the shi'b with the two deaths at -3.
  it('dates the four events the chapter counts back to the hijra', () => {
    expect(isra.fields.hijriYear?.value).toBe(-1);
    expect(boycott.fields.hijriYear?.value).toBe(-3);
    expect(deathKhadijah.fields.hijriYear?.value).toBe(-3);
    expect(deathAbuTalib.fields.hijriYear?.value).toBe(-3);
  });

  // al-Waqidi dates the second hijra from the calling and the pledges are
  // dated from it too. A year from the mission is a different era, not a
  // negative hijri year, so those stay undated.
  it('leaves every event the chapter counts from the mission undated', () => {
    for (const event of [habashaSecond, aqabaFirst, aqabaSecond, moon, taif]) {
      expect(Object.keys(event.fields)).not.toContain('hijriYear');
    }
  });

  it('puts the Prophet and Abu Bakr on the hijra the cave belongs to', () => {
    const people = madinah.people.map((entry) => entry.person);

    expect(people).toContain('prophet-muhammad');
    expect(people).toContain('abu-bakr-as-siddiq');
    expect(madinah.people.find((e) => e.person === 'abu-bakr-as-siddiq')?.claims).toEqual(['abu-bakr/hijra-cave']);
  });
});
