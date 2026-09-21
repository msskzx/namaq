import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type CatalogBattle, type Provenance } from '@/lib/catalog/types';
import badrModule from './badr';
import uhudModule from './uhud';
import bahranModule from './ghazwah-bahran';

type Claim = { key: string; confidence: string; field?: string };
const BATCHES = 'data/history/batches';
const claims = readdirSync(BATCHES).flatMap(
  (dir) => (JSON.parse(readFileSync(`${BATCHES}/${dir}/batch.json`, 'utf8')) as { claims: Claim[] }).claims,
);
const claimByKey = new Map(claims.map((claim) => [claim.key, claim]));
const keysOf = (provenance: Provenance | undefined): readonly string[] =>
  provenance === undefined || provenance === legacyUnreviewed ? [] : provenance;

const badr: CatalogBattle = badrModule;
const uhud: CatalogBattle = uhudModule;
const bahran: CatalogBattle = bahranModule;

const COUNTS = ['muslimForceCount', 'nonMuslimForceCount', 'muslimDeathCount', 'nonMuslimDeathCount'] as const;

describe('the four counts a battle can carry', () => {
  it('records both sides at Badr and both tolls', () => {
    expect(badr.fields?.muslimForceCount?.value).toBe(313);
    expect(badr.fields?.nonMuslimForceCount?.value).toBe(950);
    expect(badr.fields?.muslimDeathCount?.value).toBe(14);
    expect(badr.fields?.nonMuslimDeathCount?.value).toBe(70);
  });

  // The count chapter five could not record. Seventy is al-Dhahabi's own
  // verdict, not the largest figure on the page.
  it('records seventy Muslim dead at Uhud', () => {
    expect(uhud.fields?.muslimDeathCount?.value).toBe(70);
    expect(uhud.fields?.muslimForceCount?.value).toBe(700);
    expect(uhud.fields?.nonMuslimForceCount?.value).toBe(3000);
  });

  // Nobody counted the Meccan dead at Uhud, so the column stays empty. Leaving
  // an unknown unset is the rule ADR 0008 states; a zero would read as a
  // finding.
  it('leaves the Meccan toll at Uhud unset rather than zero', () => {
    expect(uhud.fields?.nonMuslimDeathCount).toBeUndefined();
  });

  // One side counted and the other not is the ordinary case for an expedition.
  it('records only the force al-Waqidi counted at Bahran', () => {
    expect(bahran.fields?.muslimForceCount?.value).toBe(300);
    expect(bahran.fields?.nonMuslimForceCount).toBeUndefined();
  });

  it('cites each count with a claim about that same column', () => {
    for (const battle of [badr, uhud, bahran]) {
      for (const column of COUNTS) {
        const cited = battle.fields?.[column];
        if (!cited) continue;
        expect(keysOf(cited.claims).map((key) => claimByKey.get(key)?.field)).toEqual([column]);
      }
    }
  });

  // A competing figure is evidence, not noise: it must stay in the batch and
  // it must not be what a column took.
  it('keeps every competing figure as a DISPUTED claim no column cites', () => {
    const taken = new Set(
      [badr, uhud, bahran].flatMap((battle) => COUNTS.flatMap((column) => keysOf(battle.fields?.[column]?.claims))),
    );
    const competing = claims.filter((claim) => claim.field && COUNTS.includes(claim.field as never) && !taken.has(claim.key));

    expect(competing.length).toBeGreaterThan(0);
    expect(competing.filter((claim) => claim.confidence !== 'DISPUTED')).toEqual([]);
  });
});
