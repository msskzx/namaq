import { describe, expect, it } from 'vitest';
import { branchInventory, withoutSmallerTrees, type BranchPiece } from './branchInventory';
import { ALL_KINDS, searchSharedPhrases } from './branchSearch';
import { idsOf } from './branchVerdicts';

const piece = (id: string, text: string, keys: string[]): BranchPiece => {
  const phrase = { id, text, occurrences: keys.map(key => ({ key, start: 0, end: text.split(' ').length })) };
  const opening = { id, text, count: keys.length };
  return { ...opening, legacyId: `old-${id}`, keys, phrase, opening };
};

describe('withoutSmallerTrees', () => {
  it('keeps only the bigger card when it holds all of a smaller card\'s ayat', () => {
    const big = piece('big', 'ذلك بما قدمت', ['3:182', '8:51', '22:10']);
    const pair = piece('pair', 'ذلك بما قدمت أيديكم', ['3:182', '8:51']);
    const other = piece('other', 'قال رب', ['3:182', '7:1']);
    expect(withoutSmallerTrees([pair, big, other]).map(kept => kept.id)).toEqual(['big', 'other']);
    expect(big.legacyIds).toEqual(['pair', 'old-pair']);
    expect(big.absorbed).toEqual(['ذلك بما قدمت أيديكم']);
  });

  it('keeps two cards with the same ayat, and a card whose bigger card does not count', () => {
    const a = piece('a', 'قال', ['1:1', '1:2']);
    const b = piece('b', 'رب', ['1:1', '1:2']);
    const big = piece('big', 'قال رب', ['1:1', '1:2', '1:3']);
    expect(withoutSmallerTrees([a, b])).toEqual([a, b]);
    expect(withoutSmallerTrees([a, big], card => card !== big)).toEqual([a, big]);
  });

  it('moves a card under the biggest card through a chain', () => {
    const small = piece('small', 'a b c', ['1:1', '1:2']);
    const middle = piece('middle', 'a b', ['1:1', '1:2', '1:3']);
    const big = piece('big', 'a', ['1:1', '1:2', '1:3', '1:4']);
    expect(withoutSmallerTrees([small, middle, big])).toEqual([big]);
    expect(big.legacyIds).toEqual(expect.arrayContaining(['small', 'middle']));
  });
});

describe('the default list of trees', () => {
  const list = branchInventory({}, null);

  it('has no card whose ayat all sit inside a bigger card', () => {
    const inside = list.filter(small => list.some(big => big.keys.length > small.keys.length && small.keys.every(key => big.keys.includes(key))));
    expect(inside.map(card => card.id)).toEqual([]);
  });

  it('opens the bigger tree from the smaller card\'s link and from a search for its phrase', () => {
    const big = list.find(card => card.id === 'cmp:1qybkxb00jnpnz')!;
    expect(big.keys).toEqual(['3:182', '8:51', '22:10']);
    expect(list.some(card => card.id === 'cmp:1nwj2hp1e489mj')).toBe(false);
    expect(idsOf(big)).toContain('cmp:1nwj2hp1e489mj');
    expect(searchSharedPhrases(list, 'ذلك بما قدمت أيديكم وأن الله ليس').map(card => card.id)).toContain(big.id);
  });

  it('leaves the list of every kind of tree as it was', () => {
    expect(branchInventory({ categories: ALL_KINDS }, null).some(card => card.id === 'cmp:1nwj2hp1e489mj')).toBe(true);
  });
});
