import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));
vi.mock('@/lib/prisma', () => ({ prisma: { surah: { findMany: async () => [] } } }));

import QuranReadPage from './page';

const open = (page: string) => QuranReadPage({ params: Promise.resolve({ page }) });

describe('/quran/read/[page]', () => {
  it.each(['0', '605', 'abc', '05', '1e1', '0x10', ' 7', '7.0', '-1'])('answers 404 for %s', async (page) => {
    await expect(open(page)).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it.each(['1', '2', '604'])('renders page %s', async (page) => {
    await expect(open(page)).resolves.toBeTruthy();
  });
});
