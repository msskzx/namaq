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
  });

  // Someone the seeds describe and the catalog says little or nothing about
  // must stay theirs: reading them as catalog-owned would have a project run
  // take away every value the catalog does not repeat.
  it('keeps a subject the seeds still describe, however little the catalog says', () => {
    expect(seeded.has('ali-ibn-abi-talib')).toBe(true);
    expect(seeded.has('prophet-muhammad')).toBe(true);
  });

  it('reads the dormant seed file too, since a dormant author is still an author', () => {
    expect(seeded.size).toBeGreaterThan(100);
  });
});
