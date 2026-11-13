import { describe, expect, it } from 'vitest';
import { mixQuestions, questionAyat } from './choiceKinds';

describe('mixQuestions', () => {
  it('takes from each list in turn, so a big list does not crowd out a small one', () => {
    const mixed = mixQuestions([['a1', 'a2', 'a3', 'a4'], ['b1'], [], ['c1', 'c2']], 5, () => 0.5);
    expect(mixed.sort()).toEqual(['a1', 'a2', 'b1', 'c1', 'c2']);
  });

  it('stops when the lists run out', () => {
    expect(mixQuestions([['a'], ['b']], 5, Math.random)).toHaveLength(2);
  });

  it('skips a question about an ayah already asked', () => {
    const mixed = mixQuestions([[{ id: 'a', ayahKey: '2:34' }], [{ id: 'b', ayahKey: '2:34' }, { id: 'c', ayahKey: '2:35' }]], 5, () => 0.5, questionAyat);
    expect(mixed.map(item => item.id).sort()).toEqual(['a', 'c']);
  });
});
