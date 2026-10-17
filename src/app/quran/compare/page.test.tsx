// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import QuranComparePage from './page';

const redirect = vi.hoisted(() => vi.fn((url: string) => { throw new Error(`redirect ${url}`); }));
vi.mock('next/navigation', () => ({ redirect, useRouter: () => ({ push: () => {} }) }));
vi.mock('./TextCompare', () => ({ default: ({ shared }: { shared: React.ReactNode }) => <div data-testid="text">{shared}</div> }));
vi.mock('./SimilarAyat', () => ({ default: (p: object) => <div data-testid="similar">{JSON.stringify(p)}</div> }));
vi.mock('./ThemesCompare', () => ({ default: () => <div data-testid="themes" /> }));
vi.mock('./Repetition', () => ({
  RepetitionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  RepetitionList: (p: object) => <div data-testid="list">{JSON.stringify(p)}</div>,
  SurahRepetition: ({ surah }: { surah: number }) => <div data-testid="surah">{surah}</div>,
  SharedPassages: (p: object) => <div data-testid="shared">{JSON.stringify(p)}</div>,
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

  it('puts the shared passages of the compared pair inside the text comparison, with the defaults when none is given', async () => {
    await page({});
    expect(JSON.parse(within('text', 'shared'))).toEqual({ a: 56, b: 69 });
    cleanup();
    await page({ a: '10', b: '11' });
    expect(JSON.parse(within('text', 'shared'))).toEqual({ a: 10, b: 11 });
    expect(JSON.parse(within('text', 'similar'))).toEqual({ surah: 10, other: 11 });
  });

  it('lists the similar ayat of the surah named in s', async () => {
    await page({ s: '74' });
    expect(JSON.parse(screen.getByTestId('similar').textContent!)).toEqual({ surah: 74 });
  });

  it('shows the topic comparison with no shared passages, and marks the list as topic mode', async () => {
    await page({ mode: 'themes' });
    expect(screen.getByTestId('themes')).toBeTruthy();
    expect(screen.queryByTestId('shared')).toBeNull();
    expect(JSON.parse(screen.getByTestId('list').textContent!)).toMatchObject({ a: 16, b: 43, mode: 'themes', surah: null });
  });
});

function within(outer: string, inner: string) {
  return screen.getByTestId(outer).querySelector(`[data-testid="${inner}"]`)!.textContent!;
}
