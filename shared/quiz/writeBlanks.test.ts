import { describe, expect, it } from 'vitest';
import { blankBoxes, blankText, boxesOf, writeBlank } from './writeBlanks';
import { compareCorrections } from './compareAnswers';
import { LEAF_WORDS } from './branchAnswers';

const leaf = writeBlank(3, ['﴿١٧﴾', 'غِلْمَانٌ', 'لَهُمْ', 'كَأَنَّهُمْ']);
const inner = writeBlank(1, ['وِلْدَانٌ', 'مُخَلَّدُونَ', 'إِذَا'], true);

describe('quiz blanks in recite mode boxes', () => {
  it('writes a leaf\'s words enough to grade it and every word of a node above leaves, never a sign', () => {
    expect(leaf.words).not.toContain('﴿١٧﴾');
    expect(leaf.write).toBe(LEAF_WORDS);
    expect(inner.write).toBe(inner.words.length);
  });

  it('puts every blank\'s boxes in one run and reads each blank\'s text back from its own boxes', () => {
    const { words, first } = blankBoxes([leaf, inner]);
    expect(words).toEqual([...leaf.words.slice(0, leaf.write), ...inner.words]);
    const typed = { [first[1]]: 'ولدان', [first[1] + 1]: 'مخلدون' };
    expect(blankText(inner, first[1], typed)).toBe('ولدان مخلدون');
    expect(blankText(leaf, first[0], typed)).toBe('');
  });

  it('stops a blank\'s text at its first empty box, so a later word never grades as the first', () => {
    expect(blankText(leaf, 0, { 1: 'لهم' })).toBe('');
  });

  it('loads saved texts back into the boxes, word by word', () => {
    const { first } = blankBoxes([leaf, inner]);
    const typed = boxesOf([leaf, inner], first, ['غلمان لهم كأنهم', 'ولدان مخلدون']);
    expect([blankText(leaf, first[0], typed), blankText(inner, first[1], typed)]).toEqual(['غلمان لهم', 'ولدان مخلدون']);
  });
});

describe('typed words in the checked answer', () => {
  it('marks only the misspelled word wrong, not the right words after it', () => {
    const ask = { card: 'c', shown: { key: '1:1', words: ['أ'], tones: [] }, asked: { key: '57:12', words: ['يَسْعَىٰ', 'نُورُهُم', 'بَيْنَ', 'أَيْدِيهِمْ'], tones: [] }, blanks: [[0, 4]] as [number, number][] };
    const [row] = compareCorrections(ask, ['يسعى نوررهم بين أيديهم']);
    expect(row.marks).toEqual([true, false, true, true]);
  });
});
