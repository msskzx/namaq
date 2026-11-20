import { describe, expect, it } from 'vitest';
import breaks from '@shared/data/quran/bookPages.json';
import kirmani from '@shared/data/quran/mutashabihKirmani';
import iskafi from '@shared/data/quran/mutashabihIskafi';
import zubayr from '@shared/data/quran/mutashabihZubayr';
import { readerBook } from './readerBook';

describe('readerBook', () => {
  it.each(['sadi', 'kashshaf', 'ukbari'] as const)('reads %s from disk with one page per page break', async id => {
    const { entries, pages } = await readerBook(id);
    expect(entries.length).toBeGreaterThan(500);
    expect(pages).toHaveLength((breaks as Record<string, unknown[]>)[id].length);
    expect(entries[0].surah).toBe(1);
  });

  it.each([['kirmani', kirmani], ['iskafi', iskafi], ['zubayr', zubayr]] as const)('reads the book of mutashabih %s from disk, paged by its own breaks', async (id, data) => {
    const { entries, pages } = await readerBook(id);
    expect(entries).toHaveLength(data.entries.length);
    expect(pages).toHaveLength(data.breaks.length);
  });
});
