import { describe, expect, it } from 'vitest';
import { validateCanonicalPeople } from '../src/lib/canonicalPeople';
import { getActiveSeedPeople } from '../scripts/people/activeSeedData';

describe('active person seed data', () => {
  it('has no duplicate or missing slugs across every batch file wired into personSeed.ts', async () => {
    const people = await getActiveSeedPeople();
    expect(validateCanonicalPeople(people)).toEqual([]);
  });
});
