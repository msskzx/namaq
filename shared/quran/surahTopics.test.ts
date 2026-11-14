import { describe, expect, it } from 'vitest';
import surahRows from '../data/quran/surahs.json';
import { surahTopicsCredit, surahTopicsOf, sectionAt, sectionsStartingAt, type TopicSection } from './surahTopics';

const flat = (list: TopicSection[]): TopicSection[] => list.flatMap(s => [s, ...flat(s.parts ?? [])]);

describe('surah topics', () => {
  it('cover every surah, each with its volume and page', () => {
    const missing = surahRows.filter(s => !surahTopicsOf(s.number)).map(s => s.number);
    expect(missing).toEqual([]);
    for (const { number } of surahRows.filter(s => !missing.includes(s.number))) {
      const topics = surahTopicsOf(number)!;
      expect(topics.volume).toBeGreaterThanOrEqual(1);
      expect(topics.volume).toBeLessThanOrEqual(9);
      expect(topics.sections.length).toBeGreaterThan(0);
      for (const s of flat(topics.sections)) expect(s.title, `${number}`).toMatch(/^(?![\d.]|\([٠-٩])\S/);
    }
  });

  it('fills al-Shura and al-Dukhan from the printed book, covering every ayah once', () => {
    expect(surahTopicsOf(42)).toMatchObject({ volume: 7, page: 61 });
    expect(surahTopicsOf(42)!.sections.map(s => [s.from, s.to])).toEqual([[1, 6], [7, 12], [13, 14], [15, 19], [20, 26], [27, 35], [36, 43], [44, 46], [47, 50], [51, 53]]);
    expect(surahTopicsOf(44)).toMatchObject({ volume: 7, page: 140 });
    expect(surahTopicsOf(44)!.sections.map(s => [s.from, s.to])).toEqual([[1, 9], [10, 16], [17, 33], [34, 39], [40, 50], [51, 59]]);
    expect(surahTopicsOf(44)!.sections[0].title).toBe('إعجاز القرآن وإنزاله في ليلة مباركة');
    // Al-Fatiha's seven topics sit on the words they come from: two on ayah 5, two on ayah 7.
    expect(surahTopicsOf(1)!.sections.map(s => s.from)).toEqual([2, 4, 5, 5, 6, 7, 7]);
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
    expect(sectionsStartingAt(78, 6)).toEqual([1]);
    expect(sectionsStartingAt(78, 7)).toEqual([]);
    expect(sectionsStartingAt(1, 1)).toEqual([]);
    expect(sectionsStartingAt(1, 5)).toEqual([2, 3]);
    expect(sectionAt(78, 20)).toBe(2);
    expect(sectionAt(1, 1)).toBe(-1);
    // Several sections at one ayah: the first of them. A heading that only groups parts starts at its first part.
    expect(sectionAt(1, 5)).toBe(2);
    expect(sectionAt(8, 1)).toBe(0);
    expect(sectionsStartingAt(8, 1)).toEqual([0]);
    expect(surahTopicsCredit(surahTopicsOf(78)!)).toBe('التفسير الموضوعي لسور القرآن الكريم، جامعة الشارقة، ج ٩ ص ٤');
  });
});
