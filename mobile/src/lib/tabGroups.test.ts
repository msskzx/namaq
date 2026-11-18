import { describe, expect, it } from 'vitest';
import { openPage, tapOnOpen } from './tabGroups';

describe('tab groups', () => {
  it('names the open tab and the page on top of it', () => {
    expect(openPage(['(tabs)', '(quran)', 'branches'])).toEqual({ tab: '(quran)', page: 'branches' });
    expect(openPage(['(tabs)', '(quran)', 'quran'])).toEqual({ tab: '(quran)', page: 'quran' });
    expect(openPage(['(tabs)', '(home)', 'search'])).toEqual({ tab: '(home)', page: 'search' });
    expect(openPage(['(tabs)', '(library)', 'book'])).toEqual({ tab: '(library)', page: 'book' });
    expect(openPage(['(tabs)', '(home)', 'utilities'])).toEqual({ tab: '(home)', page: 'utilities' });
    expect(openPage(['(tabs)', 'read'])).toEqual({ tab: 'read', page: 'read' });
  });

  it('takes a stack with no page named as its first page', () => {
    expect(openPage(['(tabs)', '(home)'])).toEqual({ tab: '(home)', page: 'index' });
    expect(openPage(['(tabs)', '(quran)'])).toEqual({ tab: '(quran)', page: 'quran' });
    expect(openPage(['(tabs)', '(library)'])).toEqual({ tab: '(library)', page: 'books' });
    expect(openPage(['(tabs)'])).toEqual({ tab: '(home)', page: 'index' });
  });

  it('takes home from the search or the utilities, and the library from a book, as a way back, not a re-tap', () => {
    expect(tapOnOpen('search')).toBe('back');
    expect(tapOnOpen('utilities')).toBe('back');
    expect(tapOnOpen('book')).toBe('back');
    expect(tapOnOpen('hadith-unit')).toBe('back');
    expect(tapOnOpen('hadith-forty')).toBe('back');
    expect(tapOnOpen('hadith')).toBe('retap');
    expect(tapOnOpen('index')).toBe('retap');
    expect(tapOnOpen('branches')).toBe('retap');
  });
});
