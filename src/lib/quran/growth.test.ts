import { describe, expect, it } from 'vitest';
import type { Branch } from './branches';
import { byMushaf, growthPlan } from './growth';

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
  it('grows one ayah at a time in mushaf order, depth first', () => {
    expect(growthPlan(tree).map(step => step.key)).toEqual(['15:45', '44:51', '51:15', '52:17']);
  });

  it('numbers nodes as the tree does: root -1, then depth first', () => {
    expect(growthPlan(tree).map(step => step.nodes)).toEqual([[-1, 0, 1], [-1, 3], [-1, 0, 1], [-1, 0, 2]]);
  });

  it('starts each ayah\'s new branch where it splits from what is already drawn', () => {
    expect(growthPlan(tree).map(step => step.fresh)).toEqual([1, 1, 3, 2]);
  });

  it('gives an ayah identical to an earlier one nothing new to grow', () => {
    const step = growthPlan(tree).find(step => step.key === '51:15')!;
    expect(step.fresh).toBe(step.nodes.length);
  });

  it('draws every node of the tree exactly once', () => {
    const grown = growthPlan(tree).flatMap(step => step.nodes.slice(step.fresh));
    expect(grown.sort()).toEqual([0, 1, 2, 3]);
  });

  it('orders keys by surah then ayah, numerically', () => {
    expect(['9:2', '10:1', '9:10'].sort(byMushaf)).toEqual(['9:2', '9:10', '10:1']);
  });
});
