import { describe, expect, it } from 'vitest';
import forty from './data/hadith/forty.json';
import { recordedIn, searchForty, type AppForty } from './hadith';

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

describe('recordedIn («من أخرجه»)', () => {
  it('shows every book al-Nawawi names, marked as his, and marks no book he does not name', () => {
    for (const entry of ENTRIES) {
      const boxes = recordedIn(entry);
      for (const name of entry.named) expect(boxes.some(box => box.name === name && box.named), `${entry.n}: ${name}`).toBe(true);
      for (const box of boxes) expect(box.named, `${entry.n}: ${box.name}`).toBe(entry.named.includes(box.name));
    }
  });

  it('gives a Muslim number once, however many routes are printed under it', () => {
    const many = ENTRIES.find(entry => entry.records.filter(record => record.book === 'muslim').length > 1)!;
    const numbers = recordedIn(many).filter(box => box.name === 'مسلم').map(box => box.number);
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('says «بعضه» under the Sahihayn when al-Nawawi says only part of it is there (no. 33)', () => {
    const boxes = recordedIn(ENTRIES.find(entry => entry.n === 33)!);
    expect(boxes.filter(box => box.name === 'البخاري' || box.name === 'مسلم').every(box => box.notes.includes('بعضه'))).toBe(true);
    expect(boxes.find(box => box.name === 'البيهقي')!.notes).not.toContain('بعضه');
  });
});
