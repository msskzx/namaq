// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import QuranComparePage from './page';

const redirect = vi.hoisted(() => vi.fn((url: string) => { throw new Error(`redirect ${url}`); }));
vi.mock('next/navigation', () => ({ redirect, useRouter: () => ({ push: () => {} }) }));
vi.mock('./TextCompare', () => ({ default: () => <div data-testid="text" /> }));
vi.mock('./SimilarAyat', () => ({ default: (p: object) => <div data-testid="similar">{JSON.stringify(p)}</div>, similarSurahPairs: () => [[56, 69], [56, 56]] }));
vi.mock('@/lib/quran/topicEngine', () => ({ getTopicSurahPairs: async () => [[16, 43]] }));
vi.mock('@/lib/prisma', () => ({ prisma: { surah: { findMany: async () => [{ number: 16, name: 'النحل' }, { number: 112, name: 'الإخلاص' }] } } }));
vi.mock('./SurahPairs', () => ({ SurahPairs: ({ groups, ...p }: { groups: { surah: number }[] }) => <div data-testid="list">{JSON.stringify({ ...p, surahs: groups.map(g => g.surah) })}</div> }));
vi.mock('./ThemesCompare', () => ({ default: () => <div data-testid="themes" /> }));
vi.mock('./Repetition', () => ({
  RepetitionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SurahRepetition: ({ surah }: { surah: number }) => <div data-testid="surah">{surah}</div>,
}));

afterEach(() => {
  cleanup();
  redirect.mockClear();
});

const page = async (query: Record<string, string>) => render(await QuranComparePage({ searchParams: Promise.resolve(query) }));

describe('QuranComparePage', () => {
  it('sends an old pair link, s and t, to the comparison of that pair', async () => {
    await expect(page({ s: '2', t: '18' })).rejects.toThrow('redirect /quran/compare?a=2&b=18');
  });

  it('shows the surah named in s instead of a comparison', async () => {
    await page({ s: '7' });
    expect(screen.getByTestId('surah').textContent).toBe('7');
    expect(screen.queryByTestId('text')).toBeNull();
    expect(JSON.parse(screen.getByTestId('list').textContent!)).toMatchObject({ surah: 7 });
  });

  it('treats s equal to t as that surah', async () => {
    await page({ s: '3', t: '3' });
    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('surah').textContent).toBe('3');
  });

  it('lists surahs by their similar ayat in the text comparison, with the defaults when none is given', async () => {
    await page({});
    expect(screen.getByTestId('text')).toBeTruthy();
    expect(JSON.parse(screen.getByTestId('list').textContent!)).toMatchObject({ a: 56, b: 69, mode: 'text', surahs: [16, 56, 69, 112], names: { 16: 'النحل', 112: 'الإخلاص' } });
  });

  it('lists the similar ayat of the surah named in s', async () => {
    await page({ s: '74' });
    expect(JSON.parse(screen.getByTestId('similar').textContent!)).toEqual({ surah: 74 });
  });

  it('shows the topic comparison and lists surahs by their shared topics', async () => {
    await page({ mode: 'themes' });
    expect(screen.getByTestId('themes')).toBeTruthy();
    expect(JSON.parse(screen.getByTestId('list').textContent!)).toMatchObject({ a: 16, b: 43, mode: 'themes', surah: null, surahs: [16, 43, 112] });
  });
});
