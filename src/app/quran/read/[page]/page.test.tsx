import type React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));
vi.mock('../font', () => ({ garamond: { variable: 'garamond' } }));
vi.mock('@/lib/prisma', () => ({
  prisma: {
    surah: {
      findMany: async ({ where }: { where: { number: { in: number[] } } }) => where.number.in.map(number => ({ number, name: `سورة ${number}` })),
      findFirst: async ({ where }: { where: { page: { lt: number } } }) => (where.page.lt > 1 ? { number: 2, name: 'سورة البقرة' } : null),
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

  it('names the surah a page continues, beside the ones it opens', async () => {
    const element = (await open('22')) as React.ReactElement<{ top?: number; names: Record<number, string> }>;
    expect(element.props.top).toBe(2);
    expect(element.props.names[2]).toBe('سورة البقرة');
    const first = (await open('1')) as React.ReactElement<{ top?: number; names: Record<number, string> }>;
    expect(first.props.top).toBeUndefined();
    expect(first.props.names[1]).toBe('سورة 1');
  });

  it('marks the ayah named in the query, and ignores a repeated one', async () => {
    const open = (a: string | string[]) => QuranReadPage({ params: Promise.resolve({ page: '42' }), searchParams: Promise.resolve({ a }) }) as Promise<React.ReactElement<{ mark?: { surah: number; ayah: number } }>>;
    expect((await open('2:255')).props.mark).toEqual({ surah: 2, ayah: 255 });
    expect((await open(['2:255', '1:1'])).props.mark).toEqual({ surah: 2, ayah: 255 });
    expect((await open('x')).props.mark).toBeUndefined();
  });
});
