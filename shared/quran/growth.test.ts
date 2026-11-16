import { describe, expect, it } from 'vitest';
import type { Branch } from './branches';
import { byMushaf, cardWords, growthPlan, growthWords } from './growth';

const leaf = (words: string[], ayat: string[]): Branch => ({ words, ayat, children: [] });

// إِنَّ ٱلْمُتَّقِينَ فِى → جَنَّـٰتٍ → (وَعُيُونٍ | وَنَعِيمٍ) and مَقَامٍ أَمِينٍ
const tree: Branch = {
  words: ['إِنَّ', 'ٱلْمُتَّقِينَ', 'فِى'],
  ayat: [],
  children: [
    { words: ['جَنَّـٰتٍ'], ayat: [], children: [leaf(['وَعُيُونٍ'], ['51:15', '15:45']), leaf(['وَنَعِيمٍ'], ['52:17'])] },
    leaf(['مَقَامٍ', 'أَمِينٍ'], ['44:51']),
  ],
};

describe('growthPlan', () => {
  it('grows one ayah at a time in tree order, depth first', () => {
    expect(growthPlan(tree).map(step => step.key)).toEqual(['15:45', '51:15', '52:17', '44:51']);
  });

  it('numbers nodes as the tree does: root -1, then depth first', () => {
    expect(growthPlan(tree).map(step => step.nodes)).toEqual([[-1, 0, 1], [-1, 0, 1], [-1, 0, 2], [-1, 3]]);
  });

  it('starts each ayah\'s new branch where it splits from what is already drawn', () => {
    expect(growthPlan(tree).map(step => step.fresh)).toEqual([1, 3, 2, 1]);
  });

  it('starts at an empty root and finishes each subtree, including ayat ending at an internal node', () => {
    const forest: Branch = { words: [], ayat: [], children: [
      { words: ['أ'], ayat: ['90:1'], children: [leaf(['ب'], ['90:2'])] },
      leaf(['ج'], ['1:1']),
    ] };
    expect(growthPlan(forest)).toEqual([
      { key: '90:1', nodes: [-1, 0], fresh: 1 },
      { key: '90:2', nodes: [-1, 0, 1], fresh: 2 },
      { key: '1:1', nodes: [-1, 2], fresh: 1 },
    ]);
  });

  it('visits rendered starts in their order and finishes each start before the next', () => {
    expect(growthPlan(tree, [['44:51', '52:17'], ['15:45', '51:15']]).map(step => step.key))
      .toEqual(['52:17', '44:51', '15:45', '51:15']);
  });

  it('orders keys by surah then ayah, numerically', () => {
    expect(['9:2', '10:1', '9:10'].sort(byMushaf)).toEqual(['9:2', '9:10', '10:1']);
  });
});

describe('growthWords', () => {
  it('counts each growing ayah\'s card words with its boxes, from the words before the phrase', () => {
    const plan = growthPlan(tree);
    expect(growthWords(tree, plan, { offsets: { '51:15': 2 } }).map(step => step.nodes)).toEqual([[3, 4, 5], [5, 6, 7], [3, 4, 5], [3, 5]]);
  });

  it('holds the words before the phrase back until their own box is drawn', () => {
    const [first] = growthWords(tree, growthPlan(tree), { offsets: { '15:45': 4 }, prefixed: ['15:45'] });
    expect(first).toMatchObject({ start: 0, prefix: 4 });
    expect(first.nodes[0]).toBe(7);
  });

  it('leaves ayah numbers out, and a basmala that opens the next surah', () => {
    expect(cardWords(['رَبِّ', 'ٱلْعَـٰلَمِينَ', '﴿٢﴾', 'بِسْمِ', 'ٱللَّهِ', 'ٱلرَّحْمَـٰنِ', 'ٱلرَّحِيمِ', 'الٓمٓ'], false)).toEqual({ count: 3, afterEnd: false });
  });
});
