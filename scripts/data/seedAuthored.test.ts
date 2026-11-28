import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { seedAuthoredPeople } from './seedAuthored';

describe('seedAuthoredPeople', () => {
  it('is empty now that every person seed, dormant or not, is migrated', () => {
    expect(readdirSync('prisma').filter((name) => /^personSeedData\d*\.ts$/.test(name))).toEqual([]);
    expect(seedAuthoredPeople()).toEqual(new Set());
  });
});
