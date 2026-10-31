import type React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));
vi.mock('../font', () => ({ garamond: { variable: 'garamond' } }));
vi.mock('@/lib/quran/surahList', () => ({
  surahList: async () => [1, 2, 50, 77, 106, 128].map((page, i) => ({ number: i + 1, name: `سورة ${i + 1}`, nameTransliterated: null, numberOfAyat: 1, page })),
}));

import QuranReadPage from './page';

const open = async (page: string) => ((await QuranReadPage({ params: Promise.resolve({ page }) })) as React.ReactElement<{ children: React.ReactElement }>).props.children;

describe('/quran/read/[page]', () => {
  it.each(['0', '605', 'abc', '05', '1e1', '0x10', ' 7', '7.0', '-1'])('answers 404 for %s', async (page) => {
    await expect(open(page)).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it.each(['1', '2', '604'])('renders page %s', async (page) => {
    await expect(open(page)).resolves.toBeTruthy();
  });

  type Props = { pages: { page: number; top?: number; data: { juz: number } }[]; names: Record<number, string> };

  it('names the surah a page continues, beside the ones it opens', async () => {
    const element = (await open('22')) as React.ReactElement<Props>;
    expect(element.props.pages.map(entry => entry.top)).toEqual([2, 2]);
    expect(element.props.names[2]).toBe('سورة 2');
    const first = (await open('1')) as React.ReactElement<Props>;
    expect(first.props.pages[0].top).toBeUndefined();
    expect(first.props.names[1]).toBe('سورة 1');
  });

  it('loads the facing page beside the one asked for, odd on the right', async () => {
    const pages = async (page: string) => ((await open(page)) as React.ReactElement<Props>).props.pages.map(entry => entry.page);
    expect(await pages('341')).toEqual([341, 342]);
    expect(await pages('342')).toEqual([341, 342]);
    expect(await pages('1')).toEqual([1, 2]);
    expect(await pages('604')).toEqual([603, 604]);
    expect(((await open('342')) as React.ReactElement<Props>).props.pages[1].data.juz).toBe(18);
  });

  it('is cached for a day and built on first visit, not at deploy', async () => {
    const { revalidate, generateStaticParams } = await import('./page');
    expect(revalidate).toBe(86400);
    expect(generateStaticParams()).toEqual([]);
  });
});
