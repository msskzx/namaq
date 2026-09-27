import { describe, expect, it } from 'vitest';
import { sampleDistinct, shuffleChoices } from './random';

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

describe('shuffleChoices', () => {
  it('includes the correct choice among the shuffled distractors, exactly once', () => {
    const random = sequence([0.9, 0.1, 0.5]);
    const choices = shuffleChoices('correct', ['a', 'b'], random);
    expect(choices).toHaveLength(3);
    expect(choices.filter((c) => c === 'correct')).toHaveLength(1);
    expect(new Set(choices)).toEqual(new Set(['correct', 'a', 'b']));
  });

  it('is deterministic for a given random sequence', () => {
    const runOnce = () => shuffleChoices('correct', ['a', 'b'], sequence([0.9, 0.1, 0.5]));
    expect(runOnce()).toEqual(runOnce());
  });
});
