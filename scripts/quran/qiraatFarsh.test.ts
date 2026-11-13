import { describe, expect, it } from 'vitest';
import { farshGroups, readingForm, sameForm } from './qiraatFarsh';

const r = (text: string, ...rawis: number[]) => ({ text, rawis });

describe('readingForm', () => {
  it('takes the bracketed words, or the opening words up to the first vocalized one', () => {
    expect(readingForm('قرأ ((مَلِكِ)) بغير ألف')).toBe('مَلِكِ');
    expect(readingForm('يُخَادِعُونَ بألف')).toBe('يُخَادِعُونَ');
    expect(readingForm('بالإمالة')).toBeNull();
  });
});

describe('sameForm', () => {
  it('tells letter and vowel differences apart from performance', () => {
    expect(sameForm('مَلِكِ', 'مَالِكِ')).toBe(false);
    expect(sameForm('تَعْمَلُونَ', 'يَعْمَلُونَ')).toBe(false);
    expect(sameForm('وَأَرْجُلَكُمْ', 'وَأَرْجُلِكُمْ')).toBe(false);
    // hamza treatment, sila of the plural mim, ya' zawa'id
    expect(sameForm('يَأْتِي', 'يَاتِي')).toBe(true);
    expect(sameForm('عَلَيْهِمُ', 'عَلَيْهِمْ')).toBe(true);
    expect(sameForm('الدَّاعِ', 'الدَّاعِي')).toBe(true);
  });

  it('lets a letter merge into the next only when the reading says so', () => {
    expect(sameForm('لَبِثْتَ', 'لَبِتَّ', true)).toBe(true);
    expect(sameForm('لَبِثْتَ', 'لَبِتَّ')).toBe(false);
  });

  it('takes a silent ذ merged into the ت after it as performance, but not other doubled letters', () => {
    expect(sameForm('ٱتَّخَذۡتُمُ', 'اتَّخَذتُّمُ')).toBe(true);
    expect(sameForm('ٱسۡطَٰعُوٓاْ', 'اسْطَّاعُوا')).toBe(false);
    expect(sameForm('هَٰتَيۡنِ', 'هَاتَيْنِّ')).toBe(false);
  });
});

describe('farshGroups', () => {
  it('groups the riwayat of a word by reading', () => {
    expect(farshGroups([r('((مَالِكِ))', 9, 10), r('((مَلِكِ))', 1, 2), r('((مَلِكِ)) بالإمالة', 3)])).toEqual({
      kind: 'farsh',
      groups: [{ text: 'مَالِكِ', rawis: [9, 10] }, { text: 'مَلِكِ', rawis: [1, 2, 3] }],
    });
  });

  it('calls a word whose readings differ only in performance usul', () => {
    expect(farshGroups([r('((عَلَيْهِمُ))', 1), r('((عَلَيْهِمْ))', 10)])).toEqual({ kind: 'usul' });
    expect(farshGroups([r('بالإمالة', 11), r('بالفتح', 10)])).toEqual({ kind: 'usul' });
  });
});
