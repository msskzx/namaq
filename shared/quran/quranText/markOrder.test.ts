import { describe, expect, it } from 'vitest';
import { MUSHAF } from '../../data/quran/mushaf';
import { ayahWordsOf, wordsOnly } from './ayahWords';
import { mushafMarkOrder, outOfMushafOrder } from './markOrder';

const canonicalOrder = (word: string) => word.replace(/\p{M}+/gu, marks => `\u0628${marks}`.normalize('NFD').slice(1));

const words = [...new Set(Object.values(ayahWordsOf(MUSHAF)).flatMap(wordsOnly))];

describe('the mushaf order of marks (shadda and hamza before the vowel), which the Hafs font needs on iOS', () => {
  it('leaves every word of the Madina mushaf as it is', () => {
    expect(words.length).toBeGreaterThan(0);
    expect(words.filter(word => mushafMarkOrder(word) !== word)).toEqual([]);
  });

  it('gives back the mushaf word from the same word in Unicode order, as books and typed text hold it', () => {
    const reordered = words.filter(word => canonicalOrder(word) !== word);
    expect(reordered.length).toBeGreaterThan(0);
    expect(reordered.filter(word => mushafMarkOrder(canonicalOrder(word)) !== word)).toEqual([]);
    expect(reordered.filter(word => !outOfMushafOrder(canonicalOrder(word)))).toEqual([]);
  });
});

describe('the check and the reorder agree', () => {
  const marks = ['ۧ', 'ّ', 'ٔ', 'ٕ', 'ِ', 'َ', 'ٰ'];
  const pairs = marks.flatMap(a => marks.map(b => `ب${a}${b}`));

  it('finds a string out of order exactly when the reorder would change it, and the result passes the check', () => {
    expect(pairs.filter(text => outOfMushafOrder(text) !== (mushafMarkOrder(text) !== text))).toEqual([]);
    expect(pairs.filter(text => outOfMushafOrder(mushafMarkOrder(text)))).toEqual([]);
  });

  it('never swaps two marks Unicode stacks in the same class, which would change how they stack', () => {
    expect(mushafMarkOrder('هٔۧ')).toBe('هٔۧ');
    expect(mushafMarkOrder('هۧٔ')).toBe('هۧٔ');
  });
});
