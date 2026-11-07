// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import QuranComparePage from './page';

const locale = vi.hoisted(() => ({ language: 'ar' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => locale }));

const redirect = vi.hoisted(() => vi.fn((url: string) => { throw new Error(`redirect ${url}`); }));
vi.mock('next/navigation', () => ({ redirect, useRouter: () => ({ push: () => {} }) }));
vi.mock('./TextCompare', () => ({ default: (props: object) => <div data-testid="text">{JSON.stringify(props)}</div> }));
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
  locale.language = 'ar';
});

const page = async (query: Record<string, string>) => render(await QuranComparePage({ searchParams: Promise.resolve(query) }));

describe('QuranComparePage', () => {

  it.each(['ar', 'en'])('opens a useful curated comparison and offers seven links in %s', async language => {
    locale.language = language;
    await page({});
    expect(screen.getByRole('heading', { name: language === 'ar' ? 'مقارنة المقاطع' : 'Passage comparisons' })).toBeTruthy();
    const links = screen.getAllByRole('link').filter(link => link.getAttribute('href')?.includes('preset='));
    expect(links).toHaveLength(7);
    expect(new URL(links[0].getAttribute('href')!, 'https://namaq.test').searchParams.get('preset')).toBe('moses-pharaoh');
    expect(JSON.parse(screen.getByTestId('text').textContent!)).toMatchObject({ curated: true, query: { a: '7', af: '103', at: '137', b: '26', bf: '10', bt: '68' } });
    expect(screen.queryByTestId('controls')).toBeNull();
    expect(screen.queryByTestId('list')).toBeNull();
    expect(screen.queryByTestId('themes')).toBeNull();
  });

  it('uses preset bounds and shares choices without retaining unrelated filters', async () => {
    await page({ preset: 'salih', a: '2', af: '1', at: '2', b: '3', bf: '1', bt: '2', juzFrom: '30', juzTo: '30', mode: 'themes' });
    expect(JSON.parse(screen.getByTestId('text').textContent!)).toMatchObject({ curated: true, query: { a: '7', af: '73', at: '79', b: '26', bf: '141', bt: '159' } });
    const links = screen.getAllByRole('link').filter(link => link.getAttribute('href')?.includes('preset='));
    expect(links).toHaveLength(7);
    for (const link of links) {
      const params = new URL(link.getAttribute('href')!, 'https://namaq.test').searchParams;
      expect([...params.keys()].sort()).toEqual(['a', 'af', 'at', 'b', 'bf', 'bt', 'preset', 'view']);
    }
    expect(screen.queryByTestId('themes')).toBeNull();
  });

  it('recovers an unknown preset to the available comparisons', async () => {
    await page({ preset: 'does-not-exist' });
    expect(screen.getAllByRole('link').filter(link => link.getAttribute('href')?.includes('preset='))).toHaveLength(7);
    expect(screen.queryByTestId('controls')).toBeNull();
    expect(screen.getByTestId('text')).toBeTruthy();
  });

  it('sends an old pair link, s and t, to the comparison of that pair', async () => {
    await expect(page({ s: '2', t: '18' })).rejects.toThrow('redirect /quran/compare?a=2&b=18');
  });

  it('shows the surah named in s instead of a comparison', async () => {
    await page({ s: '7' });
    expect(JSON.parse(screen.getByTestId('similar').textContent!)).toMatchObject({ surah: 7 });
    expect(screen.queryByTestId('surah')).toBeNull();
    expect(screen.queryByTestId('text')).toBeNull();
    expect(JSON.parse(screen.getByTestId('list').textContent!)).toMatchObject({ surah: 7 });
  });

  it('treats s equal to t as that surah', async () => {
    await page({ s: '3', t: '3' });
    expect(redirect).not.toHaveBeenCalled();
    expect(JSON.parse(screen.getByTestId('similar').textContent!)).toMatchObject({ surah: 3 });
    expect(screen.queryByTestId('surah')).toBeNull();
  });

  it('lists surahs by their similar ayat for an explicitly selected legacy comparison', async () => {
    await page({ view: 'similar' });
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
    cleanup();
    await page({ juzFrom: '27', juzTo: '29', a: '56' });
    expect(JSON.parse(screen.getByTestId('list').textContent!)).toMatchObject({ a: 56, b: 69 });
    cleanup();
    await page({ a: '69' });
    expect(JSON.parse(screen.getByTestId('list').textContent!)).toMatchObject({ a: 69, b: 56 });
    cleanup();
    await page({ b: '56' });
    expect(JSON.parse(screen.getByTestId('list').textContent!)).toMatchObject({ a: 69, b: 56 });
  });

  it('marks the ayah-by-ayah tab, and the similar tab inside one surah', async () => {
    await page({ view: 'ayat' });
    expect(JSON.parse(screen.getByTestId('controls').textContent!)).toMatchObject({ tab: 'ayat' });
    cleanup();
    await page({ s: '56' });
    expect(JSON.parse(screen.getByTestId('controls').textContent!).tab).toBe('similar');
  });

  it('shows every place of a surah, or only those inside it with within=1', async () => {
    await page({ s: '56' });
    expect(JSON.parse(screen.getByTestId('similar').textContent!)).toMatchObject({ surah: 56, within: false });
    expect(screen.getByTestId('current').textContent).toBe('سورة الواقعة');
    cleanup();
    await page({ s: '56', within: '1' });
    expect(JSON.parse(screen.getByTestId('similar').textContent!)).toMatchObject({ surah: 56, within: true });
    expect(JSON.parse(screen.getByTestId('list').textContent!)).toMatchObject({ surah: 56, within: true });
    expect(screen.getByTestId('current').textContent).toBe('داخل سورة الواقعة');
  });

  it('shows the topic comparison and lists surahs by their shared topics', async () => {
    await page({ mode: 'themes' });
    expect(screen.getByTestId('themes')).toBeTruthy();
    expect(JSON.parse(screen.getByTestId('list').textContent!)).toMatchObject({ a: 16, b: 43, tab: 'themes', surah: null, surahs: [16, 43, 52, 56, 69, 112] });
  });
});
