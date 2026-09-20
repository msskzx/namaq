import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ENGAGEMENTS, legacyUnreviewed, type CatalogBattle, type Provenance } from '@/lib/catalog/types';
import translations from '@/components/language/translations';

const DIR = 'data/catalog/battles';
const slugs = readdirSync(DIR)
  .filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'))
  .map((name) => name.slice(0, -3));

const modules = await Promise.all(
  slugs.map(async (slug) => (await import(`./${slug}`)).default as CatalogBattle),
);

type Claim = { key: string; citations: { passageAnchor: string }[] };
const BATCHES = 'data/history/batches';
const claimByKey = new Map(
  readdirSync(BATCHES)
    .flatMap((dir) => (JSON.parse(readFileSync(`${BATCHES}/${dir}/batch.json`, 'utf8')) as { claims: Claim[] }).claims)
    .map((claim) => [claim.key, claim]),
);
const keysOf = (claims: Provenance): readonly string[] => (claims === legacyUnreviewed ? [] : claims);

describe('the engagement column', () => {
  it('is set on every battle, from the vocabulary', () => {
    const missing = modules.filter((battle) => !battle.fields?.engagement).map((battle) => battle.slug);
    expect(missing).toEqual([]);

    const outside = modules
      .filter((battle) => !ENGAGEMENTS.includes(battle.fields!.engagement!.value))
      .map((battle) => battle.slug);
    expect(outside).toEqual([]);
  });

  // The projector creates a Battle row when the seed never had one, and it
  // needs a name to do that.
  it('gives every battle a name the projector can create a row with', () => {
    expect(modules.filter((battle) => !battle.name?.trim()).map((battle) => battle.slug)).toEqual([]);
  });

  // The sira labels its own chapters غزوة or سرية or بعث, so the value is read
  // off the source rather than assigned. Anything the pass has not reached yet
  // stays on the legacy marker instead of being guessed.
  it('cites the engagement of every expedition it authored', () => {
    const expeditions = modules.filter((battle) => battle.slug.startsWith('sariyyah-') || battle.slug.startsWith('ghazwah-'));
    expect(expeditions.length).toBeGreaterThan(0);

    for (const battle of expeditions) {
      const claims = battle.fields!.engagement!.claims;
      expect(claims).not.toBe(legacyUnreviewed);
      expect(keysOf(claims).every((key) => claimByKey.has(key))).toBe(true);
    }
  });

  it('labels every value in both languages', () => {
    for (const value of ENGAGEMENTS) {
      expect(translations.en.battles.engagement[value]).toBeTruthy();
      expect(translations.ar.battles.engagement[value]).toBeTruthy();
    }
  });
});
