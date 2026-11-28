import { describe, expect, it } from 'vitest';
import { MUSHAF } from '../../data/quran/mushaf';
import { ayahWordsOf, wordsOnly } from './ayahWords';
import { mushafMarkOrder, outOfMushafOrder } from './markOrder';

const CLASS: Record<string, number> = {
  'ً': 27, 'ٌ': 28, 'ٍ': 29, 'َ': 30, 'ُ': 31, 'ِ': 32, 'ّ': 33, 'ْ': 34, 'ٰ': 35,
  'ٕ': 220, 'ٖ': 220, 'ٜ': 220, 'ٟ': 220, 'ۣ': 220, '۪': 220, 'ۭ': 220,
};
const classOf = (char: string) => CLASS[char] ?? (/[ؐ-ؚٓ-ٞۖ-ۜ۟-ۤۧۨ۫۬]/.test(char) ? 230 : 0);

function canonicalOrder(word: string): string {
  const out: string[] = [];
  let marks: string[] = [];
  for (const char of [...word, '']) {
    if (char && classOf(char)) { marks.push(char); continue; }
    out.push(...marks.sort((a, b) => classOf(a) - classOf(b)), char);
    marks = [];
  }
  return out.join('');
}

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
