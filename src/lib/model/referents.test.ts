import { describe, expect, it } from 'vitest';
import { standingAgent } from './referents';

describe('standingAgent', () => {
  it('resolves the Messenger of Allah and the Prophet however the vowels are written', () => {
    for (const text of [
      'رَسُولُ اللهِ',
      'رَسُوْلُ اللهِ',
      'رَسُولِ اللَّهِ',
      'النَّبِيُّ',
      'النَّبِيِّ',
    ]) {
      expect(standingAgent(text)).toBe('prophet-muhammad');
    }
  });

  it('leaves names that more than one person bear, and generic words, unresolved', () => {
    for (const text of ['سُفْيَانُ', 'حَمَّادٌ', 'نَبِيٍّ', 'رَسُولُ مَلِكٍ', 'ابْنُ عَمَّتِهِ']) {
      expect(standingAgent(text)).toBeUndefined();
    }
  });
});
