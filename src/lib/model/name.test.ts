import { describe, expect, it } from 'vitest';
import { joinName } from './name';

describe('joinName', () => {
  it('drops the alif of ابْنِ and the sukun on its ba when the part continues a lineage', () => {
    expect(joinName(['العَوَّامِ', 'ابْنِ قُصَيِّ بنِ كِلاَبِ'])).toBe(
      'العَوَّامِ بنِ قُصَيِّ بنِ كِلاَبِ',
    );
  });

  it('leaves the first part as the book prints it, and parts that do not start with ابن', () => {
    expect(joinName(['ابْنُ عَبَّاسٍ'])).toBe('ابْنُ عَبَّاسٍ');
    expect(joinName(['عَبْدُ اللهِ', 'ابْنُ عُمَرَ'])).toBe('عَبْدُ اللهِ بنُ عُمَرَ');
    expect(joinName(['أَبُو بَكْرٍ', 'الصِّدِّيقُ'])).toBe('أَبُو بَكْرٍ الصِّدِّيقُ');
  });

  it('also handles an alif carrying a vowel', () => {
    expect(joinName(['عَبْدُ اللهِ', 'اِبْنُ عُمَرَ'])).toBe('عَبْدُ اللهِ بنُ عُمَرَ');
  });

  it('does not touch words that merely start with the same letters', () => {
    expect(joinName(['فُلاَنٌ', 'ابْنَةُ فُلاَنٍ'])).toBe('فُلاَنٌ ابْنَةُ فُلاَنٍ');
  });
});
