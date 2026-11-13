import { describe, expect, it } from 'vitest';
import { searchApp } from './searchAll';

const group = (query: string, kind: string) => searchApp(query).find(found => found.kind === kind)?.hits ?? [];

describe('the app search on the bundled data', () => {
  it('lists the surah first when the query names one', () => {
    const groups = searchApp('البقرة');
    expect(groups[0].kind).toBe('surah');
    expect(groups[0].hits[0]).toMatchObject({ number: 2 });
  });

  it('finds ayat, the word, trees and prophets\' events for «فرعون»', () => {
    expect(group('فرعون', 'ayah').length).toBeGreaterThan(3);
    expect(group('فرعون', 'word')).toContainEqual(expect.objectContaining({ name: 'فِرْعَوْن', count: 74 }));
    expect(group('فرعون', 'tree').length).toBeGreaterThan(0);
    expect(group('فرعون', 'event')).toContainEqual(expect.objectContaining({ slug: 'musa', title: 'إغراق فرعون وجنوده' }));
  });

  it('finds compare pages by story name and Tuhfa verses by their words', () => {
    expect(group('موسى وفرعون', 'compare')).toContainEqual(expect.objectContaining({ a: 7, b: 26 }));
    expect(group('الإظهار', 'tuhfa').length).toBeGreaterThan(0);
  });
});

describe('trees in the app search', () => {
  it('keeps to trees that hold the words as typed when there are some', () => {
    const trees = group('فرعون', 'tree') as { text: string }[];
    expect(trees.length).toBeGreaterThan(0);
    expect(trees.every(tree => tree.text.includes('فِرْعَوْن'))).toBe(true);
  });
});
