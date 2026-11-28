import { describe, expect, it } from 'vitest';
import people from './data/tarajim/people.json';
import { TARAJIM_GROUPS } from './tarajimGroups';
import type { AppPerson } from './tarajim';

describe('the Tarajim hub groups', () => {
  it('names only titles the converted entries give to more than one person', () => {
    for (const group of TARAJIM_GROUPS) {
      const holders = (people as AppPerson[]).filter(person => person.titles.some(title => title.title === group.key));
      expect(holders.length, group.key).toBeGreaterThan(1);
    }
  });
});
