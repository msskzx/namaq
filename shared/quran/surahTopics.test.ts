import { describe, expect, it } from 'vitest';
import surahRows from '../data/quran/surahs.json';
import { surahTopicsCredit, surahTopicsOf, topicsStartingAt, type TopicSection } from './surahTopics';

const flat = (list: TopicSection[]): TopicSection[] => list.flatMap(s => [s, ...flat(s.parts ?? [])]);

describe('surah topics', () => {
  it('cover every surah but the three the book’s list doesn’t reach, each with its volume and page', () => {
    const missing = surahRows.filter(s => !surahTopicsOf(s.number)).map(s => s.number);
    expect(missing).toEqual([1, 42, 44]);
    for (const { number } of surahRows.filter(s => !missing.includes(s.number))) {
      const topics = surahTopicsOf(number)!;
      expect(topics.volume).toBeGreaterThanOrEqual(1);
      expect(topics.volume).toBeLessThanOrEqual(9);
      expect(topics.sections.length).toBeGreaterThan(0);
      for (const s of flat(topics.sections)) expect(s.title, `${number}`).toMatch(/^(?![\d.]|\([٠-٩])\S/);
    }
  });

  it('keeps the book’s headings and ranges', () => {
    expect(surahTopicsOf(78)).toEqual({ volume: 9, page: 4, sections: [
      { title: 'تساؤل المشركين عن النبأ', from: 1, to: 5 }, { title: 'الآيات الكونية', from: 6, to: 16 },
      { title: 'أحداث يوم القيامة', from: 17, to: 30 }, { title: 'جزاء المتقين', from: 31, to: 40 },
    ] });
    expect(surahTopicsOf(2)!.sections).toHaveLength(4);
    expect(flat(surahTopicsOf(2)!.sections)).toHaveLength(18);
  });

  it('finds the section that starts at an ayah, and credits the book', () => {
    expect(topicsStartingAt(78, 6).map(s => s.title)).toEqual(['الآيات الكونية']);
    expect(topicsStartingAt(78, 7)).toEqual([]);
    expect(topicsStartingAt(1, 1)).toEqual([]);
    expect(surahTopicsCredit(surahTopicsOf(78)!)).toBe('التفسير الموضوعي لسور القرآن الكريم، جامعة الشارقة، ج ٩ ص ٤');
  });
});
