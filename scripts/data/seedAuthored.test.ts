import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { seedAuthoredPeople } from './seedAuthored';

// Read from the real seed files, because what this answers is a fact about
// them: who the catalog may overwrite and who it may only add to. Every
// prisma/personSeedData*.ts file, dormant or wired, has now been migrated
// into the catalog and deleted, and neo4j/graphSeedData.ts is an empty stub,
// so nothing declares a person outside the catalog any more.
describe('seedAuthoredPeople', () => {
  it('is empty now that every person seed, dormant or not, is migrated', () => {
    expect(readdirSync('prisma').filter((name) => /^personSeedData\d*\.ts$/.test(name))).toEqual([]);
    expect(seedAuthoredPeople()).toEqual(new Set());
  });
});
