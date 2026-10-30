import { describe, expect, it } from 'vitest';
import { getHomePreviews } from './homePreviewData';
import { keys } from './quran/branches';

describe('homepage preview data', () => {
  it('provides every ayah in the example and its full tree controls data', async () => {
    const data = await getHomePreviews();
    expect(keys(data.branches.tree).sort()).toEqual(['15:45', '44:51', '51:15', '52:17', '54:54', '77:41']);
    expect(data.branches.prefixes.flatMap(prefix => prefix.keys).sort()).toEqual(keys(data.branches.tree).sort());
    expect(Object.keys(data.branches.offsets).sort()).toEqual(keys(data.branches.tree).sort());
    expect(data.branches.tree.words.join(' ')).toContain('ٱلْمُتَّقِينَ');
    expect(Object.keys(data)).toEqual(['branches']);
  });
  it('selects another complete tree and keeps its controls data', async () => {
    const initial = await getHomePreviews();
    for (const random of [0, 0.5, 0.999999]) {
      const { branches } = await getHomePreviews(initial.branches.id, () => random);
      expect(branches.id).not.toBe(initial.branches.id);
      expect(branches.count).toBe(keys(branches.tree).length);
      expect(branches.count).toBeGreaterThanOrEqual(2);
      expect(branches.count).toBeLessThanOrEqual(8);
      expect(Object.keys(branches.offsets).sort()).toEqual(keys(branches.tree).sort());
    }
  });
});
