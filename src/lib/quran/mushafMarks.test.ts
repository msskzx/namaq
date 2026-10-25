import { describe, expect, it } from 'vitest';
import { isSajda, juzName, quarterLabel } from './mushafMarks';

describe('juzName', () => {
  it('names each juz as the printed mushaf heads its pages', () => {
    expect([1, 10, 11, 17, 18, 20, 21, 25, 30].map(juzName)).toEqual([
      'الأول', 'العاشر', 'الحادي عشر', 'السابع عشر', 'الثامن عشر', 'العشرون', 'الحادي والعشرون', 'الخامس والعشرون', 'الثلاثون',
    ]);
  });
});

describe('quarterLabel', () => {
  it('names the juz where one opens, then the hizb and its quarter', () => {
    expect(quarterLabel(137)).toEqual(['الجزء ١٨', 'الحزب ٣٥']);
    expect(quarterLabel(138)).toEqual(['ربع الحزب ٣٥']);
    expect(quarterLabel(139)).toEqual(['نصف الحزب ٣٥']);
    expect(quarterLabel(140)).toEqual(['ثلاثة أرباع الحزب ٣٥']);
    expect(quarterLabel(141)).toEqual(['الحزب ٣٦']);
  });
});

describe('isSajda', () => {
  it('finds the sajda sign on a word of the line', () => {
    expect(isSajda(['يَسۡجُدُونَۤ۩', 206])).toBe(true);
    expect(isSajda(['يَسۡجُدُونَ', 7])).toBe(false);
  });
});
