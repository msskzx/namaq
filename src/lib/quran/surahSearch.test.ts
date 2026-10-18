import { describe, expect, it } from 'vitest';
import { searchSurahs, surahMatch } from './surahSearch';

const surahs = [
  { number: 2, name: 'البَقَرَةِ' },
  { number: 3, name: 'آلِ عِمۡرَانَ' },
  { number: 20, name: 'طه' },
  { number: 23, name: 'المُؤۡمِنُونَ' },
  { number: 55, name: 'الرَّحۡمَٰنِ' },
  { number: 56, name: 'الوَاقِعَةِ' },
];
const names = (q: string) => searchSurahs(surahs, q).map(s => s.number);

describe('surahSearch', () => {
  it('finds a surah by its name without diacritics, hamzah forms or the article', () => {
    expect(names('البقرة')).toEqual([2]);
    expect(names('بقره')).toEqual([2]);
    expect(names('ال عمران')).toEqual([3]);
    expect(names('مومنون')).toEqual([23]);
    expect(names('الرحمن')).toEqual([55]);
  });

  it('finds a surah by its number in Latin or Arabic digits, exact before prefix', () => {
    expect(names('2')).toEqual([2, 20, 23]);
    expect(names('٢٣')).toEqual([23]);
    expect(names('٥٦')).toEqual([56]);
  });

  it('ranks a whole name before a prefix before a match inside the name', () => {
    expect(names('ال')).toEqual([2, 3, 23, 55, 56]);
    expect(surahMatch('طه', 20, 'طه')).toBe(0);
    expect(surahMatch('واق', 56, 'الوَاقِعَةِ')).toBe(1);
    expect(surahMatch('قعه', 56, 'الوَاقِعَةِ')).toBe(2);
  });

  it('keeps every surah for an empty query and none for a miss', () => {
    expect(names('  ')).toEqual([2, 3, 20, 23, 55, 56]);
    expect(names('يوسف')).toEqual([]);
  });
});
