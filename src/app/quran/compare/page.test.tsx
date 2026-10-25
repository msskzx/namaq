// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import QuranComparePage from './page';

const redirect = vi.hoisted(() => vi.fn((url: string) => { throw new Error(`redirect ${url}`); }));
vi.mock('next/navigation', () => ({ redirect, useRouter: () => ({ push: () => {} }) }));
vi.mock('./TextCompare', () => ({ default: () => <div data-testid="text" /> }));
vi.mock('./SimilarAyat', () => ({ default: (p: object) => <div data-testid="similar">{JSON.stringify(p)}</div>, similarSurahPairs: (range: { range: unknown }) => (range.range ? [[52, 56], [56, 69], [56, 52]] : [[56, 69], [56, 56]]) }));
vi.mock('@/lib/quran/topicEngine', () => ({ getTopicSurahPairs: async () => [[16, 43]] }));
vi.mock('@/lib/prisma', () => ({ prisma: { surah: { findMany: async () => [{ number: 16, name: 'النحل' }, { number: 52, name: 'الطور' }, { number: 56, name: 'الواقعة' }, { number: 69, name: 'الحاقة' }, { number: 112, name: 'الإخلاص' }] } } }));
vi.mock('./SurahPairs', () => ({ SurahPairs: ({ groups, ...p }: { groups: { surah: number }[] }) => <div data-testid="list">{JSON.stringify({ ...p, surahs: groups.map(g => g.surah) })}</div> }));
vi.mock('./ThemesCompare', () => ({ default: () => <div data-testid="themes" /> }));
vi.mock('./CompareControls', () => ({ default: (p: object) => <div data-testid="controls">{JSON.stringify(p)}</div> }));
vi.mock('./CompareLayout', () => ({ default: ({ pane, children, current }: { pane: React.ReactNode; children: React.ReactNode; current: string }) => <><p data-testid="current">{current}</p>{pane}{children}</> }));
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
    expect(JSON.parse(screen.getByTestId('list').textContent!)).toMatchObject({ a: 56, b: 69, tab: 'similar', surahs: [16, 52, 56, 69, 112], names: { 16: 'النحل', 112: 'الإخلاص' } });
  });

  it('lists the similar ayat of the surah named in s', async () => {
    await page({ s: '74' });
    expect(JSON.parse(screen.getByTestId('similar').textContent!)).toMatchObject({ surah: 74, range: { unit: 'juz', range: null } });
  });

  it('narrows the list to the surahs in the chosen juz or surah range and says how many pairs are left', async () => {
    await page({ by: 'surah', surahFrom: '50', surahTo: '70' });
    expect(JSON.parse(screen.getByTestId('list').textContent!)).toMatchObject({ surahs: [52, 56, 69], tab: 'similar' });
    expect(JSON.parse(screen.getByTestId('controls').textContent!)).toMatchObject({ tab: 'similar', range: { unit: 'surah', range: { from: 50, to: 70 } }, summary: 'السور ٥٠–٧٠ · أزواج الآيات المتشابهة: ٣' });
    expect(screen.getByTestId('current').textContent).toBe('الطور والواقعة');
  });

  it('opens the pair with the most similar ayat in the range when no pair is chosen', async () => {
    await page({ juzFrom: '27', juzTo: '29' });
    expect(JSON.parse(screen.getByTestId('list').textContent!)).toMatchObject({ a: 52, b: 56 });
    cleanup();
    await page({ juzFrom: '27', juzTo: '29', a: '16', b: '112' });
    expect(JSON.parse(screen.getByTestId('list').textContent!)).toMatchObject({ a: 16, b: 112 });
  });

  it('marks the ayah-by-ayah tab, and no tab inside one surah', async () => {
    await page({ view: 'ayat' });
    expect(JSON.parse(screen.getByTestId('controls').textContent!)).toMatchObject({ tab: 'ayat' });
    cleanup();
    await page({ s: '56' });
    expect(JSON.parse(screen.getByTestId('controls').textContent!).tab).toBeNull();
  });

  it('shows the topic comparison and lists surahs by their shared topics', async () => {
    await page({ mode: 'themes' });
    expect(screen.getByTestId('themes')).toBeTruthy();
    expect(JSON.parse(screen.getByTestId('list').textContent!)).toMatchObject({ a: 16, b: 43, tab: 'themes', surah: null, surahs: [16, 43, 52, 56, 69, 112] });
  });
});
