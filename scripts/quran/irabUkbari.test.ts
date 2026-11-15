import { describe, expect, it } from 'vitest';
import { matchHeading, skeleton } from './irabUkbari';

const ikhlas4 = ['وَلَمۡ', 'يَكُن', 'لَّهُۥ', 'كُفُوًا', 'أَحَدُۢ'];

describe("al-'Ukbari's headings on the mushaf's words", () => {
  it('finds a heading of two words in the ayah', () => {
    expect(matchHeading(ikhlas4, 'كُفُوًا أَحَدٌ')).toEqual([3, 4]);
  });

  it('meets the rasm where the book spells a word fully (الصلاة, open tanwin marks)', () => {
    expect(skeleton('ٱلصَّلَوٰةَ')).toBe(skeleton('الصَّلَاةَ'));
    expect(matchHeading(['مُّحَمَّدࣱ', 'رَّسُولُ', 'ٱللَّهِۚ'], 'مُحَمَّدٌ')).toEqual([0, 0]);
  });

  it('forgives a ف the heading leaves out, and drops the ayah number in it', () => {
    expect(matchHeading(['فَسَبِّحۡ', 'بِٱسۡمِ', 'رَبِّكَ'], 'سَبِّحْ بِاسْمِ')).toEqual([0, 1]);
    expect(matchHeading(['الٓمٓ'], 'الم (١)')).toEqual([0, 0]);
  });

  it('names no place for words the ayah does not hold', () => {
    expect(matchHeading(ikhlas4, 'الرَّحْمَنِ')).toBeNull();
    expect(matchHeading(ikhlas4, '')).toBeNull();
  });
});
