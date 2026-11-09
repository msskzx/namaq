import { describe, expect, it } from 'vitest';
import { wordDiff } from './wordDiff';

describe('wordDiff', () => {
  it('marks nothing for equal sequences', () => {
    expect(wordDiff(['a', 'b'], ['a', 'b'])).toEqual({ a: [], b: [] });
  });

  it('marks a substitution on both sides', () => {
    expect(wordDiff(['a', 'b', 'c'], ['a', 'x', 'c'])).toEqual({ a: [1], b: [1] });
  });

  it('marks an insertion only on the longer side', () => {
    expect(wordDiff(['a', 'b'], ['a', 'x', 'y', 'b'])).toEqual({ a: [], b: [1, 2] });
  });
});
