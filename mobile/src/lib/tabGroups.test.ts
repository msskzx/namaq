import { describe, expect, it } from 'vitest';
import { buttonOf, isRetap, noteRoute, pageOf } from './tabGroups';

describe('tab groups', () => {
  it('lights the Quran button on its hub and on every tool it opens', () => {
    for (const route of ['quran', 'branches', 'compare', 'prophets', 'tuhfa', 'words', 'oaths']) expect(buttonOf(route)).toBe('quran');
    for (const route of ['index', 'read', 'quizzes', 'utilities']) expect(buttonOf(route)).toBe(route);
    expect(buttonOf('search')).toBe('index');
  });

  it('takes home from the search page as a way home, not a re-tap', () => {
    expect(isRetap('search', 'index')).toBe(false);
    expect(isRetap('index', 'index')).toBe(true);
    noteRoute('branches');
    expect(isRetap('branches', 'quran')).toBe(true);
    noteRoute('quran');
  });

  it('brings the Quran button back to the Quran page open last', () => {
    expect(pageOf('quran')).toBe('quran');
    noteRoute('compare');
    noteRoute('read');
    expect(pageOf('quran')).toBe('compare');
    expect(pageOf('read')).toBe('read');
    noteRoute('quran');
    expect(pageOf('quran')).toBe('quran');
  });
});
