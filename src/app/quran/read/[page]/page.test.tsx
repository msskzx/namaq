import type React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
  redirect: (to: string) => {
    throw new Error(`NEXT_REDIRECT ${to}`);
  },
}));
vi.mock('../font', () => ({ garamond: { variable: 'garamond' } }));
vi.mock('@/lib/prisma', () => ({
  prisma: {
    surah: {
      findMany: async ({ where }: { where: { number: { in: number[] } } }) => where.number.in.map(number => ({ number, name: `سورة ${number}` })),
      findFirst: async ({ where }: { where: { page: { lt: number } } }) =>
        where.page.lt > 106 ? { number: 5, name: 'سورة المائدة' } : where.page.lt > 1 ? { number: 2, name: 'سورة البقرة' } : null,
    },
  },
}));

import QuranReadPage from './page';

const open = (page: string) => QuranReadPage({ params: Promise.resolve({ page }) });

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
    expect(element.props.names[2]).toBe('سورة البقرة');
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

  it('marks the ayah named in the query, and ignores a repeated one', async () => {
    const open = (a: string | string[]) => QuranReadPage({ params: Promise.resolve({ page: '42' }), searchParams: Promise.resolve({ a }) }) as Promise<React.ReactElement<{ mark?: { surah: number; ayah: number } }>>;
    expect((await open('2:255')).props.mark).toEqual({ surah: 2, ayah: 255 });
    expect((await open(['2:255', '1:1'])).props.mark).toEqual({ surah: 2, ayah: 255 });
    expect((await open('x')).props.mark).toBeUndefined();
  });

  it('sends a link whose ayah is not on the page to the page that holds it', async () => {
    const open = (page: string, a: string) => QuranReadPage({ params: Promise.resolve({ page }), searchParams: Promise.resolve({ a }) });
    await expect(open('120', '5:78')).rejects.toThrow('NEXT_REDIRECT /quran/read/ayah/5/78');
    await expect(open('121', '5:78')).resolves.toBeTruthy();
  });
});
