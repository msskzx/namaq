import { expect, it } from 'vitest';
import artifact from '../../data/quran/mutashabih.json';
import corpus from '../../data/quran/trees.json';
import manifest from './categories.json';
import { groups } from './data';
import { groupHasId } from './identity';

it('assigns every generated comparison exactly once in the reviewed manifest', () => {
  const ids = manifest.rules.flatMap(rule => rule.groups);
  expect(new Set(ids).size).toBe(ids.length);
  expect([...ids].sort()).toEqual(artifact.map(group => group.id).sort());
  for (const rule of manifest.rules) {
    expect(rule.rationale.trim().length).toBeGreaterThan(0);
    expect(rule.categories.length).toBeGreaterThan(0);
    expect(rule.categories.every(category => ['mutashabeh', 'pondering', 'words'].includes(category))).toBe(true);
  }
});

it('admits reviewed uncited parallels and keeps the broad interrogative tree optional', () => {
  const rain = groups.find(group => groupHasId(group, 'group:22:63,35:27,39:21'))!;
  expect(rain.categories).toContain('mutashabeh');
  expect(rain.categories).toContain('pondering');
  expect(rain.citations).toHaveLength(0);
  expect(groups.find(group => groupHasId(group, 'الم تر كيف'))?.categories).toEqual(['words']);
});

it('preserves the exact Quran word selections of focused editorial comparisons', () => {
  const ayat = new Map(corpus.ayat.map(ayah => [ayah.key, ayah]));
  for (const comparison of manifest.extraComparisons) {
    const normalized = (text: string) => text.normalize('NFC');
    for (const place of comparison.places) {
      const words = ayat.get(place.key)!.words;
      expect(place.start).toBeGreaterThanOrEqual(0);
      expect(place.end).toBeLessThanOrEqual(words.length);
      expect(normalized(words.slice(place.start, place.end).join(' '))).toBe(normalized(comparison.text));
    }
  }
});
