import { describe, expect, it } from 'vitest';
import { branchList, EMPTY_LIST } from './branchList';
import sizes from './treeSizes.json';

describe('the tree sizes the app ships', () => {
  it('has every tree, both ways, with and without the surrounding ayat (else run `npm run tree-sizes` in mobile/)', () => {
    const known = sizes as Record<string, number[]>;
    const missing = branchList(EMPTY_LIST).flatMap(piece => [piece.id, `${piece.id}+`]).filter(key => !(known[key]?.length === 5 && known[key].every(value => value > 0)));
    expect(missing).toEqual([]);
  });
});
