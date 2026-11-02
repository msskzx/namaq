// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { isBookmarked, readBookmarks, subscribeBookmarks, toggleBookmark } from './bookmarks';

afterEach(() => localStorage.clear());

it('saves a tree once, newest first, and removes it on the second press', () => {
  const listener = vi.fn();
  const stop = subscribeBookmarks(listener);
  expect(toggleBookmark({ id: 'a', text: 'أ', href: '/quran/branches?o=a' })).toBe(true);
  expect(toggleBookmark({ id: 'b', text: 'ب', href: '/quran/branches?o=b' })).toBe(true);
  expect(readBookmarks().map(item => item.id)).toEqual(['b', 'a']);
  expect(toggleBookmark({ id: 'a', text: 'أ', href: '/quran/branches?o=a' })).toBe(false);
  expect(isBookmarked('a')).toBe(false);
  expect(listener).toHaveBeenCalledTimes(3);
  stop();
});

it('returns the same list until the stored one changes, and ignores broken data', () => {
  toggleBookmark({ id: 'a', text: 'أ', href: '/x' });
  expect(readBookmarks()).toBe(readBookmarks());
  localStorage.setItem('bookmarks', '{not json');
  expect(readBookmarks()).toEqual([]);
});
