import { describe, expect, it } from 'vitest';
import { profilePath } from './nodeProfile';

describe('profilePath', () => {
  it('sends a title to the people list filtered by it', () => {
    expect(profilePath('title', 'the-gatherer')).toBe('/people?title=the-gatherer');
  });

  it('keeps battles, events and people on their own pages', () => {
    expect(profilePath('battle', 'badr')).toBe('/battles/badr');
    expect(profilePath('event', 'hijra-to-medina')).toBe('/events/hijra-to-medina');
    expect(profilePath('person', 'abu-bakr-as-siddiq')).toBe('/people/abu-bakr-as-siddiq');
    expect(profilePath(undefined, 'abu-bakr-as-siddiq')).toBe('/people/abu-bakr-as-siddiq');
  });
});
