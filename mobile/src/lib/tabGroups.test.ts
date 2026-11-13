import { describe, expect, it } from 'vitest';
import { buttonOf, noteRoute, pageOf } from './tabGroups';

describe('tab groups', () => {
  it('lights the Quran button on its hub and on every tool it opens', () => {
    for (const route of ['quran', 'branches', 'compare', 'prophets', 'tuhfa', 'words']) expect(buttonOf(route)).toBe('quran');
    for (const route of ['index', 'read', 'quizzes', 'utilities']) expect(buttonOf(route)).toBe(route);
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
