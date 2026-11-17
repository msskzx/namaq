import { describe, expect, it } from 'vitest';
import corpus from './quranText/corpus';
import { branchQuestions } from '../quiz/branchQuestions';
import { keys, withStarts, type BranchAyah, type Variant } from './branches';

const prefix = (word: string, keys: string[]): Variant => ({ word, conj: '', keys, id: 't' });

describe('withStarts', () => {
  it('adds the ayat that open with the trunk when others have words before it', () => {
    expect(withStarts([prefix('إِنَّ', ['47:32', '47:34'])], ['47:1', '47:32', '47:34'])).toEqual([prefix('إِنَّ', ['47:32', '47:34']), { word: '', words: [], conj: '', keys: ['47:1'], id: 't' }]);
  });

  it('leaves the list alone when no ayah has words before the trunk, or every ayah is listed', () => {
    const none = [prefix('', ['1:1', '1:2'])];
    expect(withStarts(none, ['1:1', '1:2', '1:3'])).toBe(none);
    const listed = [prefix('إِنَّ', ['47:32']), prefix('', ['47:1'])];
    expect(withStarts(listed, ['47:1', '47:32'])).toBe(listed);
  });

  it('gives every quiz tree with words before its trunk an entry for each of its ayat', () => {
    const questions = branchQuestions(corpus.ayat as BranchAyah[]).filter(question => question.prefixes.some(p => p.word));
    const short = questions.filter(question => withStarts(question.prefixes, keys(question.tree)) !== question.prefixes);
    expect(short.length).toBeGreaterThan(100);
    for (const question of short) expect(withStarts(question.prefixes, keys(question.tree)).flatMap(p => p.keys).sort()).toEqual(keys(question.tree).sort());
  }, 60000);
});
