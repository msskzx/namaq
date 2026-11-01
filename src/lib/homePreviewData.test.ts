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
});
