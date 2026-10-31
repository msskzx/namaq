import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
  redirect: (url: string) => {
    throw new Error(`REDIRECT ${url}`);
  },
}));
vi.mock('@/lib/quran/surahList', () => ({
  surahList: async () => [{ number: 1, page: 1 }, { number: 2, page: 2 }, { number: 114, page: 604 }],
}));

import AyahRedirect from './page';

const open = (surah: string, ayah: string) => AyahRedirect({ params: Promise.resolve({ surah, ayah }) });

describe('/quran/read/ayah/[surah]/[ayah]', () => {
  it('sends a reference to the page the ayah starts on, with the ayah to mark', async () => {
    await expect(open('2', '255')).rejects.toThrow('REDIRECT /quran/read/42?a=2:255');
    await expect(open('114', '1')).rejects.toThrow('REDIRECT /quran/read/604?a=114:1');
  });

  it.each([['0', '1'], ['115', '1'], ['1', '8'], ['2', 'x'], ['2', '0']])('answers 404 for %s:%s', async (surah, ayah) => {
    await expect(open(surah, ayah)).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
