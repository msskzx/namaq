import { describe, expect, it } from 'vitest';
import breaks from '@shared/data/quran/bookPages.json';
import { readerBook } from './readerBook';

describe('readerBook', () => {
  it.each(['sadi', 'kashshaf', 'ukbari'] as const)('reads %s from disk with one page per page break', async id => {
    const { entries, pages } = await readerBook(id);
    expect(entries.length).toBeGreaterThan(500);
    expect(pages).toHaveLength((breaks as Record<string, unknown[]>)[id].length);
    expect(entries[0].surah).toBe(1);
  });
});
