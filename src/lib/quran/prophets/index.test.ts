import { describe, expect, it } from 'vitest';
import { AYAT } from '@/app/quran/prophets/ayat';
import { findProphet, PROPHETS } from '.';
import { STORIES } from './stories';
import { buildStory } from './story';

describe('PROPHETS', () => {
  it('gives each prophet one slug, and a story and stored ayat to each', () => {
    const slugs = PROPHETS.map(p => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(Object.keys(STORIES).sort()).toEqual([...slugs].sort());
    expect(Object.keys(AYAT).sort()).toEqual([...slugs].sort());
  });

  it.each(PROPHETS)('$slug has stored ayat for every event', ({ slug }) => {
    expect(buildStory(STORIES[slug].events, AYAT[slug])).toHaveLength(STORIES[slug].events.length);
  });

  it.each(PROPHETS)('$slug puts every event in a phase, in order, and leaves no phase empty', ({ slug }) => {
    const phases = STORIES[slug].events.map(e => e.phase);
    expect(phases).toEqual([...phases].sort((a, b) => a - b));
    expect([...new Set(phases)]).toEqual(STORIES[slug].phases.map((_, i) => i));
  });
});

describe('findProphet', () => {
  it('finds a prophet by slug and nothing else', () => {
    expect(findProphet('musa')?.name).toBe('موسى');
    expect(findProphet('pharaoh')).toBeUndefined();
  });
});
