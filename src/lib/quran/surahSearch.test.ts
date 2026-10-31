import { describe, expect, it } from 'vitest';
import { matchesSurah, searchSurahs, surahRank } from './surahSearch';

const surahMatch = (query: string, number: number, name: string) => surahRank({ number, name }, query);

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

  it('matches dagger-alif names by their normal spelling (one search with the ayah search)', () => {
    const named = [{ number: 6, name: 'سُورَةُ ٱلْأَنْعَـٰمِ' }, { number: 14, name: 'سُورَةُ إِبْرَٰهِيمَ' }, { number: 37, name: 'سُورَةُ ٱلصَّـٰٓفَّـٰتِ' }];
    expect(searchSurahs(named, 'الأنعام').map(s => s.number)).toEqual([6]);
    expect(searchSurahs(named, 'انعم').map(s => s.number)).toEqual([6]);
    expect(searchSurahs(named, 'ابراهيم').map(s => s.number)).toEqual([14]);
    expect(searchSurahs(named, 'الصافات').map(s => s.number)).toEqual([37]);
    expect(searchSurahs(surahs, 'آل عمران').map(s => s.number)).toEqual([3]);
  });

  it('ranks transliterations too when the surah carries one', () => {
    const latin = [{ number: 2, name: 'البقرة', nameTransliterated: 'Al-Baqara' }, { number: 3, name: 'آل عمران', nameTransliterated: 'Aal-i-Imraan' }];
    expect(searchSurahs(latin, 'baqarah').map(s => s.number)).toEqual([2]);
    expect(searchSurahs(latin, 'imran').map(s => s.number)).toEqual([3]);
    expect(matchesSurah(latin[0], 'nisa')).toBe(false);
    const yasin = [...latin, { number: 36, name: 'يس', nameTransliterated: 'Yaseen' }];
    expect(searchSurahs(yasin, 'al').map(s => s.number)).toEqual([2, 3]);
    expect(searchSurahs(yasin, 'Al-').map(s => s.number)).toEqual([2, 3]);
  });

  it('matches nothing for digits with punctuation, as typed on the way to 2:255', () => {
    for (const query of ['2:', '114.', '1-5']) expect(searchSurahs(surahs, query), query).toEqual([]);
  });

  it('reads stored names that carry the word surah or a tatweel', () => {
    const stored = [{ number: 2, name: 'سُورَةُ البَقَرَةِ' }, { number: 5, name: 'سُورَةُ المَائـِدَةِ' }, { number: 34, name: 'سُورَةُ سَبَإٍ' }];
    expect(surahMatch('البقرة', 2, stored[0].name)).toBe(0);
    expect(surahMatch('سورة البقرة', 2, stored[0].name)).toBe(0);
    expect(searchSurahs(stored, 'المائدة').map(s => s.number)).toEqual([5]);
    expect(searchSurahs(stored, 'س').map(s => s.number)).toEqual([34]);
    expect(searchSurahs(stored, 'سورة ').map(s => s.number)).toEqual([2, 5, 34]);
  });
});
