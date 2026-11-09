import { expect, it } from 'vitest';
import artifact from '../../data/quran/mutashabih.json';
import { canonicalGroups, comparisonId, groupHasId } from './identity';
import type { Group } from './types';

const groups: Group[] = JSON.parse(JSON.stringify(artifact));

it('keeps comparison IDs stable when passage order changes and distinct when a selected span changes', () => {
  const places = [{ key: '17:61', start: 0, end: 8 }, { key: '18:50', start: 0, end: 8 }];
  expect(comparisonId(places)).toBe(comparisonId([...places].reverse()));
  expect(comparisonId(places)).not.toBe(comparisonId(places.map(place => ({ ...place, start: 1 }))));
  expect(comparisonId(places)).not.toBe(comparisonId([{ ...places[0], through: '17:62' }, places[1]]));
});

it('assigns unique short IDs to the current selections and preserves every legacy URL', () => {
  const identified = canonicalGroups(groups);
  expect(new Set(identified.map(group => group.id)).size).toBe(identified.length);
  for (const [index, group] of identified.entries()) {
    expect(group.id).toMatch(/^cmp:[a-z0-9]{14}$/);
    expect(groupHasId(group, groups[index].id)).toBe(true);
    expect(group.tree.id).toBe(group.id);
    expect(group.places).toEqual(groups[index].places);
  }
  expect(canonicalGroups(identified)).toEqual(identified);
});
