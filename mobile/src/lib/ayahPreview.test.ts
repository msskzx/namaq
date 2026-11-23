import { describe, expect, it } from 'vitest';
import { compareOfAyah, PREVIEW_MAX, treePiecesOfAyah } from './ayahPreview';

describe('the reader\'s ayah previews', () => {
  it('lists the trees that hold the ayah, at most a few', () => {
    const trees = treePiecesOfAyah('1:2');
    expect(trees.length).toBeGreaterThan(0);
    expect(trees.length).toBeLessThanOrEqual(PREVIEW_MAX);
    for (const tree of trees) expect(tree.keys).toContain('1:2');
  });

  it('shows the other ayah of each compare card, with the words it shares marked', () => {
    const pairs = compareOfAyah('37:182');
    // 37:182 is kept with 6:45 and with 1:2 (owner 2026-11-23); the one with al-An'am is checked here.
    const anam = pairs.find(pair => pair.partner === '6:45')!;
    expect(anam.target).toMatchObject({ lead: 37, other: 6, ayat: [182, 45] });
    // «والحمد لله رب العالمين» is shared; «فقطع دابر القوم الذين ظلموا» is not.
    expect(anam.words.filter(word => word.shared)).toHaveLength(4);
    expect(anam.words[0].shared).toBe(false);
  });

  it('has nothing for an ayah it does not know', () => {
    expect(treePiecesOfAyah('999:1')).toEqual([]);
  });
});
