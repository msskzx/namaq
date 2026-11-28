import { describe, expect, it } from 'vitest';
import data from '../data/quran/itqanBalagha';
import { itqanAt, itqanCredit, itqanPage, type ItqanData } from './itqanBalagha';

describe("al-Itqan's balagha", () => {
  it('holds the seven kinds, 52 to 58', () => {
    expect(Object.keys(data.kinds).map(Number)).toEqual([52, 53, 54, 55, 56, 57, 58]);
  });

  it("finds his iltifat paragraph on al-Fatiha 4, the ayah's words lit", () => {
    const iltifat = itqanAt(data, '1:4').find(paragraph => paragraph.heading === 'الِالْتِفَاتُ');
    expect(iltifat && itqanCredit(iltifat)).toBe('الإتقان للسيوطي ٣/٢٩٢–٢٩٣');
    expect(iltifat?.words.length).toBeGreaterThan(0);
  });

  it('lights only the words quoted in the ayah asked for, and keeps the count of places and the ayat a quote that names none fits', () => {
    const tiny: ItqanData = { source: { book: 1, sha: '' }, kinds: { 58: 'kind' }, entries: [[58, '', 3, 5, 5, 900, 'text', [[1, 1, 0, 1, 1, 0], [2, 3, 4, 6, 2, 1], [2, 3, 7, 7, 2, 1]]]] };
    expect(itqanAt(tiny, '2:3')).toEqual([{ kind: 'kind', heading: '', part: 3, pages: [5, 5], id: 900, text: 'text', words: [[4, 7]], places: 2, matches: ['2:3'] }]);
    expect(itqanAt(tiny, '9:9')).toEqual([]);
    const two: ItqanData = { ...tiny, entries: [[58, '', 3, 5, 5, 900, 'text', [[17, 1, 12, 20, 1, 0], [17, 1, 0, 3, 3, 1]]]] };
    expect(itqanAt(two, '17:1')[0]).toMatchObject({ words: [[0, 3], [12, 20]], places: 1, matches: [] });
    const unnamed: ItqanData = { ...tiny, entries: [[58, '', 3, 5, 5, 900, 'text', [[5, 1, 0, 1, 2, 0], [2, 3, 4, 5, 2, 0], [7, 1, 0, 0, 2, 1], [8, 1, 0, 0, 2, 1]]]] };
    expect(itqanAt(unnamed, '5:1')[0].matches).toEqual(['2:3', '5:1']);
    expect(itqanAt(unnamed, '8:1')[0].matches).toEqual(['7:1', '8:1']);
    expect(itqanPage({ id: 900 })).toBe('https://shamela.ws/book/11728/900');
  });
});
