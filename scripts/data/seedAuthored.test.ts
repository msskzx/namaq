import { describe, expect, it } from 'vitest';
import { seedAuthoredPeople } from './seedAuthored';

// Read from the real seed files, because what this answers is a fact about
// them: who the catalog may overwrite and who it may only add to.
describe('seedAuthoredPeople', () => {
  const seeded = seedAuthoredPeople();

  it('leaves the two migrated subjects to the catalog', () => {
    expect(seeded.has('talhah-ibn-ubaydullah')).toBe(false);
    expect(seeded.has('abu-ubaydah-ibn-al-jarrah')).toBe(false);
  });

  // Ali's module carries only his kunya. If he read as catalog-owned, a project
  // run would take his titles away for no better reason than that his module
  // does not repeat them.
  it('keeps a subject the seeds still describe, however little the catalog says', () => {
    expect(seeded.has('ali-ibn-abi-talib')).toBe(true);
    expect(seeded.has('prophet-muhammad')).toBe(true);
  });

  it('reads the dormant seed file too, since a dormant author is still an author', () => {
    expect(seeded.size).toBeGreaterThan(100);
  });
});
