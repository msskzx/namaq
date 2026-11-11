import { describe, expect, it } from 'vitest';
import { FILTER_KEYS } from '../quran/mutashabih/browse';
import { parseTreeScope, quizFilters, SCOPE_KEYS, treeScopeParams } from './scopeParams';

describe('quiz tree scope', () => {
  it('knows every branches filter but sort', () => {
    expect([...SCOPE_KEYS]).toEqual(FILTER_KEYS.filter(key => key !== 'sort'));
  });

  it('asks the متشابهات unless other kinds are picked, and drops sort', () => {
    expect(quizFilters({ sort: 'closest', differences: 'taqdim' })).toEqual({ differences: 'taqdim', categories: 'mutashabeh' });
  });

  it('goes through query parameters and back', () => {
    const scope = { filters: { categories: 'mutashabeh,words', surahs: '2,36' }, saved: ['a', 'b'] };
    expect(parseTreeScope(new URLSearchParams(treeScopeParams(scope)))).toEqual(scope);
    expect(treeScopeParams({})).toEqual([]);
  });
});
