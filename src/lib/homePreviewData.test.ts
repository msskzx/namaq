import { describe, expect, it } from 'vitest';
import { getHomePreviews } from './homePreviewData';
import { keys } from './quran/branches';

describe('homepage preview data', () => {
  it('provides three real Quran examples without loading unrelated content', async () => {
    const data = await getHomePreviews();
    expect(keys(data.branches.tree).sort()).toEqual(['15:45', '51:15', '52:17']);
    expect(data.branches.tree.words.join(' ')).toContain('ٱلْمُتَّقِينَ');
    expect(Object.keys(data)).toEqual(['branches']);
  });
});
