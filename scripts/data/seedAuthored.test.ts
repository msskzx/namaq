import { describe, expect, it } from 'vitest';
import { seedAuthoredPeople } from './seedAuthored';

// Read from the real seed files, because what this answers is a fact about
// them: who the catalog may overwrite and who it may only add to.
describe('seedAuthoredPeople', () => {
  const seeded = seedAuthoredPeople();

  it('leaves the migrated subjects to the catalog', () => {
    expect(seeded.has('talhah-ibn-ubaydullah')).toBe(false);
    expect(seeded.has('abu-ubaydah-ibn-al-jarrah')).toBe(false);
    expect(seeded.has('az-zubayr-ibn-al-awwam')).toBe(false);
    expect(seeded.has('abdur-rahman-ibn-awf')).toBe(false);
    expect(seeded.has('saad-ibn-abi-waqqas')).toBe(false);
  });

  // Someone the seeds describe and the catalog says nothing about must stay
  // theirs: reading them as catalog-owned would have a project run take away
  // every value the catalog does not repeat. Every personSeedData*.ts file
  // that fed prisma/personSeed.ts has now been migrated, so the only
  // remaining author is the dormant personSeedData.ts — these three are in
  // it with no module of their own.
  it('keeps a subject the seeds still describe, which the catalog has not reached', () => {
    expect(seeded.has('al-qasim-ibn-muhammad')).toBe(true);
    expect(seeded.has('abdullah-ibn-muhammad')).toBe(true);
    expect(seeded.has('ibrahim-ibn-muhammad')).toBe(true);
  });

  it('reads the dormant seed file too, since a dormant author is still an author', () => {
    expect(seeded.size).toBeGreaterThan(15);
  });
});
