import { describe, expect, it } from 'vitest';
import { wordTokens } from './compare';

describe('wordTokens', () => {
  it('treats numbered lemmas of one word as the same word, as فإذا in Al-Shu\'ara 45 and Al-A\'raf 117', () => {
    expect(wordTokens(['فاذا'], 'p:<i*aA2')).toEqual(['p:<i*aA']);
  });

  it('keeps the word itself where the corpus gives no key, and every word when the counts differ', () => {
    expect(wordTokens(['من', 'خلف'], ' r:xlf')).toEqual(['من', 'r:xlf']);
    expect(wordTokens(['من', 'خلف'], 'r:xlf')).toEqual(['من', 'خلف']);
    expect(wordTokens(['من'], undefined)).toEqual(['من']);
  });
});
