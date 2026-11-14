import { describe, expect, it } from 'vitest';
import { openPage, tapOnOpen } from './tabGroups';

describe('tab groups', () => {
  it('names the open tab and the page on top of it', () => {
    expect(openPage(['(tabs)', '(quran)', 'branches'])).toEqual({ tab: '(quran)', page: 'branches' });
    expect(openPage(['(tabs)', '(quran)', 'quran'])).toEqual({ tab: '(quran)', page: 'quran' });
    expect(openPage(['(tabs)', '(home)', 'search'])).toEqual({ tab: '(home)', page: 'search' });
    expect(openPage(['(tabs)', 'read'])).toEqual({ tab: 'read', page: 'read' });
  });

  it('takes a stack with no page named as its first page', () => {
    expect(openPage(['(tabs)', '(home)'])).toEqual({ tab: '(home)', page: 'index' });
    expect(openPage(['(tabs)', '(quran)'])).toEqual({ tab: '(quran)', page: 'quran' });
    expect(openPage(['(tabs)'])).toEqual({ tab: '(home)', page: 'index' });
  });

  it('takes home from the search page as a way back home, not a re-tap', () => {
    expect(tapOnOpen('search')).toBe('back');
    expect(tapOnOpen('index')).toBe('retap');
    expect(tapOnOpen('branches')).toBe('retap');
  });
});
