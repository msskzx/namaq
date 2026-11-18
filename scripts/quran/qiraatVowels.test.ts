import { describe, expect, it } from 'vitest';
import data from '../../shared/data/quran/qiraat.json';
import hand from './qiraatVowels.json';
import { fullyVowelled, pageForm } from './qiraatVowels';

const ayat = (data as unknown as { ayat: Record<string, { at: [number, number]; readings: { text: string }[] }[]> }).ayat;

describe('fullyVowelled', () => {
  it('asks a mark of every letter the Madina page marks', () => {
    expect(fullyVowelled('يَعۡمَلُونَ')).toBe(true);
    expect(fullyVowelled('ٱلشَّمۡسُ')).toBe(true);
    expect(fullyVowelled('قُل رَّبِّ')).toBe(true);
    expect(fullyVowelled('كُنتُمۡ')).toBe(true);
    expect(fullyVowelled('يعملون')).toBe(false);
    expect(fullyVowelled('يُكَذِّبون')).toBe(false);
  });
});

describe('pageForm', () => {
  it('writes a riwaya text the way the page does', () => {
    expect(pageForm('اَ۬للَّهُ')).toBe('ٱللَّهُ');
    expect(pageForm('مَرَضࣰ')).toBe('مَرَضٗ');
  });
});

describe('the readings in qiraat.json', () => {
  it('are all fully vowelled, but those the letters cannot write', () => {
    const kept = new Set(Object.entries(hand as Record<string, string>).filter(([, v]) => v.startsWith('KEEP')).map(([id]) => id));
    const bare = Object.entries(ayat).flatMap(([key, words]) => words.flatMap(word => word.readings.slice(1)
      .filter(reading => !fullyVowelled(reading.text) && !kept.has(`${key}:${word.at[0]}:${reading.text}`))
      .map(reading => `${key} ${reading.text}`)));
    expect(bare).toEqual([]);
  });
});
