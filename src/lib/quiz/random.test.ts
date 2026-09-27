import { describe, expect, it } from 'vitest';
import { placeAnswer, sampleDistinct } from './random';

function sequence(values: number[]) {
  let i = 0;
  return () => values[i++];
}

describe('sampleDistinct', () => {
  it('returns null when the pool is smaller than the requested count', () => {
    expect(sampleDistinct(['a', 'b'], 3, Math.random)).toBeNull();
  });

  it('picks distinct elements deterministically from an injected random', () => {
    const random = sequence([0, 0, 0]);
    expect(sampleDistinct(['a', 'b', 'c', 'd'], 3, random)).toEqual(['a', 'b', 'c']);
  });
});

describe('placeAnswer', () => {
  it('inserts the correct choice at the position the random draw picks', () => {
    const random = sequence([0.5]);
    const { choices, correctIndex } = placeAnswer('correct', ['a', 'b'], random);
    expect(correctIndex).toBe(1);
    expect(choices[correctIndex]).toBe('correct');
    expect(choices).toHaveLength(3);
  });
});
