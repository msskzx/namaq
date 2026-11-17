import { describe, expect, it } from 'vitest';
import data from '../../data/quran/trees.json';
import corpus from './corpus';

describe('the trees with their words from the pages', () => {
  it('titles a subtree with as many words as its path holds, across an ayah end when the path runs on', () => {
    const stored = (data.subtrees as { id: string; length: number }[]);
    expect(corpus.subtrees.filter((subtree, i) => subtree.text.split(' ').length !== stored[i].length).map(subtree => subtree.id)).toEqual([]);
    expect(corpus.subtrees.find(subtree => subtree.id === 'الله غفور رحيم ۝ يايها')!.text.normalize('NFC')).toBe('ٱللَّهَ غَفُورٞ رَّحِيمٞ ۝ يَٰٓأَيُّهَا'.normalize('NFC'));
  });

  it('gives no two subtrees of a tree the same title', () => {
    const titles = corpus.subtrees.map(subtree => `${subtree.parent}|${subtree.text}`);
    expect(titles.filter((title, i) => titles.indexOf(title) !== i)).toEqual([]);
  });
});
