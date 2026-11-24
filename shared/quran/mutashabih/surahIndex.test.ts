import { describe, expect, test } from 'vitest';
import { branchInventory } from '../branchInventory';
import { indexRows, placesCount, surahCounts } from './surahIndex';

const books = branchInventory({ categories: 'mutashabeh' }, null);

describe('the mutashabih index by surah', () => {
  test('each surah lists every card with a place in it once, as many as its bar counts, in mushaf order', () => {
    const counts = surahCounts(books);
    expect(counts.some(Boolean)).toBe(true);
    counts.forEach((count, at) => {
      const rows = indexRows(books, at + 1);
      expect(rows.length, `surah ${at + 1}`).toBe(count);
      expect(new Set(rows.map(row => row.piece.id)).size).toBe(rows.length);
      for (const row of rows) expect(row.lit.length, row.piece.id).toBeLessThan(row.place.end - row.place.start);
      const order = rows.map(row => Number(row.place.key.split(':')[1]) * 1000 + row.place.start);
      expect(order).toEqual([...order].sort((a, b) => a - b));
    });
  });

  test('al-Baqarah 126 is listed by its words there, the word it differs by lit, beside Ibrahim 35 and its three books', () => {
    const row = indexRows(books, 2).find(each => each.place.key === '2:126')!;
    expect(row.others).toEqual(['14:35']);
    expect(row.lit).toEqual(row.piece.group!.differences['2:126']);
    expect(row.lit.length).toBeGreaterThan(0);
    expect([...row.books].sort()).toEqual(['ابن الزبير', 'الإسكافي', 'الكرماني'].sort());
  });

  test('the count of places reads as Arabic counts them', () => {
    expect([1, 2, 3, 10, 11, 105].map(placesCount)).toEqual(['موضع واحد', 'موضعان', '٣ مواضع', '١٠ مواضع', '١١ موضعًا', '١٠٥ موضعًا']);
  });
});
