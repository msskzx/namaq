import { describe, expect, it } from 'vitest';
import { holdsTerms, searchAll, SEARCH_ORDER, type SearchSources } from './searchAll';

const surahs = [{ number: 2, name: 'البقرة' }, { number: 7, name: 'الأعراف' }, { number: 20, name: 'طه' }];
const sources: SearchSources = {
  surahs,
  ayat: query => (query.includes('بقر') ? [{ kind: 'ayah', key: '2:67', words: ['إِنَّ', 'ٱللَّهَ'], from: 0, to: 0 }] : []),
  words: () => [{ kind: 'word', id: 1, name: 'بَقَرَة', count: 9 }],
  compare: [{ a: 2, b: 7, title: 'سورة البقرة وسورة الأعراف' }],
  events: [{ slug: 'musa', event: 20, title: 'البقرة', prophet: 'موسى عليه السلام' }, { slug: 'musa', event: 9, title: 'إغراق فرعون وجنوده', prophet: 'موسى عليه السلام' }],
  tuhfa: [{ chapter: 0, verse: 1, first: 'يَقُولُ رَاجِي رَحْمَةِ الْغَفُورِ', second: 'دَوْمًا سُلَيْمَانُ هُوَ الْجَمْزُورِي' }],
  notes: [{ key: '2:67', text: 'قصة البقرة: السؤال بعد السؤال' }],
};

describe('one search across the app', () => {
  it('puts surah names first, then the other groups in a fixed order', () => {
    const groups = searchAll(sources, 'البقرة');
    expect(groups[0]).toEqual({ kind: 'surah', hits: [{ kind: 'surah', number: 2, name: 'البقرة' }] });
    expect(groups.map(group => group.kind)).toEqual(['surah', 'ayah', 'word', 'compare', 'event', 'note']);
    const order = groups.map(group => SEARCH_ORDER.indexOf(group.kind));
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it('hides empty groups and finds nothing for an empty query', () => {
    expect(searchAll(sources, '   ')).toEqual([]);
    const groups = searchAll({ surahs }, 'فرعون');
    expect(groups).toEqual([]);
  });

  it('finds a surah by its number', () => {
    expect(searchAll({ surahs }, '٢٠')[0].hits).toEqual([{ kind: 'surah', number: 20, name: 'طه' }]);
  });

  it('matches events, verses and notes by every typed word, ignoring marks and hamza seats', () => {
    expect(searchAll(sources, 'اغراق فرعون').find(group => group.kind === 'event')?.hits).toHaveLength(1);
    expect(searchAll(sources, 'فرعون موسى').find(group => group.kind === 'event')?.hits).toEqual([{ kind: 'event', slug: 'musa', event: 9, title: 'إغراق فرعون وجنوده', prophet: 'موسى عليه السلام' }]);
    expect(searchAll(sources, 'رحمة الغفور').find(group => group.kind === 'tuhfa')?.hits).toHaveLength(1);
    expect(holdsTerms('السؤال بعد السؤال', 'السوال')).toBe(false);
    expect(holdsTerms('إِنَّ ٱللَّهَ', 'ان الله')).toBe(true);
    expect(holdsTerms('وَالثَّانِ إِدْغَامٌ بِسِتَّةٍ', 'الإدغام')).toBe(true);
  });

  it('runs the text finders only for two letters or more', () => {
    let calls = 0;
    searchAll({ surahs, ayat: () => { calls++; return []; } }, 'ب');
    expect(calls).toBe(0);
  });
});
