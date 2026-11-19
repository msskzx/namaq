import { describe, expect, it } from 'vitest';
import forty from './data/hadith/forty.json';
import { searchForty, type AppForty } from './hadith';

const ENTRIES = (forty as AppForty).entries;

describe('searchForty', () => {
  it('finds a hadith by its words whatever their marks or hamzas, and by its Companion', () => {
    const niyyat = searchForty(ENTRIES, 'انما الاعمال بالنيات');
    expect(niyyat.map(entry => entry.n)).toContain(1);
    expect(searchForty(ENTRIES, 'عمر بن الخطاب').length).toBeGreaterThan(0);
    expect(searchForty(ENTRIES, 'كلمة لا توجد في الأربعين ابدا')).toEqual([]);
  });

  it('lists them all while nothing is typed', () => {
    expect(searchForty(ENTRIES, '  ')).toHaveLength(ENTRIES.length);
  });
});
