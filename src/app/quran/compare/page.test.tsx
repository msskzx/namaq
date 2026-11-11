// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import QuranComparePage from './page';
import { NavSlotElement } from '@/components/common/NavBar';
import { pairCards } from './pairCards';

const locale = vi.hoisted(() => ({ language: 'ar' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => locale }));

const redirect = vi.hoisted(() => vi.fn((url: string) => { throw new Error(`redirect ${url}`); }));
vi.mock('next/navigation', () => ({ redirect, useRouter: () => ({ push: () => {}, prefetch: () => {} }) }));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: (name: string) => (name === 'branches-view' ? { value: 'cards' } : undefined) }) }));
vi.mock('./TextCompare', () => ({ default: (props: object) => <div data-testid="text">{JSON.stringify(props)}</div> }));
vi.mock('./SimilarAyat', () => ({ default: (p: object) => <div data-testid="similar">{JSON.stringify(p)}</div>, similarSurahPairs: (range: { range: unknown }) => (range.range ? [[52, 56], [56, 69], [56, 52]] : [[56, 69], [56, 56]]) }));
vi.mock('@/lib/quran/topicEngine', () => ({ getTopicSurahPairs: async () => [[16, 43]] }));
vi.mock('@/lib/prisma', () => ({ prisma: { surah: { findMany: async () => [{ number: 16, name: 'النحل' }, { number: 52, name: 'الطور' }, { number: 56, name: 'الواقعة' }, { number: 69, name: 'الحاقة' }, { number: 112, name: 'الإخلاص' }] } } }));
vi.mock('./SurahPairs', () => ({ SurahPairs: ({ groups, ...p }: { groups: { surah: number }[] }) => <div data-testid="list">{JSON.stringify({ ...p, surahs: groups.map(g => g.surah) })}</div> }));
vi.mock('@/lib/quran/surahList', () => ({ surahList: async () => [{ number: 2, name: 'الْبَقَرَةِ', nameTransliterated: 'Al-Baqarah' }, { number: 7, name: 'الْاَعْرَافِ', nameTransliterated: "Al-A'raf" }, { number: 26, name: 'الشُّعَرَآءِ', nameTransliterated: "Ash-Shu'ara" }] }));
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

const page = async (query: Record<string, string>) => {
  const content = await QuranComparePage({ searchParams: Promise.resolve(query) });
  function Chrome() {
    const [slot, setSlot] = React.useState<HTMLDivElement | null>(null);
    return <><div ref={setSlot} data-testid="top-bar" /><NavSlotElement.Provider value={slot}>{content}</NavSlotElement.Provider></>;
  }
  return render(<Chrome />);
};
describe('QuranComparePage', () => {
  it('keeps review on when it redirects from one surah or opens the default page', async () => {
    await expect(page({ a: '3', review: '1' })).rejects.toThrow(/review=1/);
  });

  it('lists a page whose cards were all left out only in review', async () => {
    const link = () => within(screen.getByRole('complementary', { name: 'اختر سورتين' })).queryAllByRole('link').some(item => item.getAttribute('href')?.startsWith('/quran/compare?a=3&b=18'));
    await page({ a: '2', b: '3' });
    expect(link()).toBe(false);
    cleanup();
    await page({ a: '2', b: '3', review: '1' });
    expect(link()).toBe(true);
  }, 30000);

  it('opens the first selected story when no surahs are chosen', async () => {
    await page({});
    const trigger = screen.getByRole('button', { name: /اختر سورتين/ });
    expect(screen.getByTestId('top-bar').contains(trigger)).toBe(true);
    expect(trigger.textContent).toContain('سُورَةُ الْبَقَرَةِ وَسُورَةُ الْاَعْرَافِ');
    expect(screen.queryByTestId('controls')).toBeNull();
    expect(screen.queryByTestId('text')).toBeNull();
  });

  it('shows the similar ayat of the two surahs, with the stories pinned and mushaf order first', async () => {
    await page({ a: '7', b: '26' });
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('مُوسَىٰ وَفِرۡعَوۡنُ');
    const pane = screen.getByRole('complementary', { name: 'اختر سورتين' });
    expect(within(pane).getByRole('button', { name: /ترتيب المصحف/ }).getAttribute('aria-pressed')).toBe('true');
    const current = within(pane).getAllByRole('link', { current: 'page' });
    // The count follows the curated verdicts, which change as pairs are reviewed.
    const texts = current.map(link => link.textContent ?? '');
    expect(texts.map(text => text.replace(/[٠-٩]+$/, ''))).toEqual(['مُوسَىٰ وَفِرۡعَوۡنُالاعراف · الشعرآء', 'الشعرآء']);
    const counts = new Set(texts.map(text => text.match(/[٠-٩]+$/)?.[0]));
    expect(counts.size).toBe(1);
    const count = Number([...counts][0]!.replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))));
    expect(count).toBeGreaterThan(0);
    expect(screen.getAllByRole('article').length).toBe(pairCards(7, 26).length * 2);
    expect(pairCards(7, 26).reduce((sum, card) => sum + (card.pairs?.length ?? 1), 0)).toBe(count);
  });

  it.each([
    [{ preset: 'moses-pharaoh' }, '/quran/compare?a=7&b=26'],
    [{ a: '26' }, '/quran/compare?a=26&b=7'],
    [{ a: '1' }, '/quran/compare?a=1&b=4'],
    [{ a: '109' }, '/quran/compare?a=2&b=7'],
    [{ preset: 'does-not-exist' }, '/quran/compare?a=2&b=7'],
  ])('sends %o to %s', async (query, target) => {
    await expect(page(query)).rejects.toThrow(`redirect ${target}`);
  });

  it('opens 26·7 as the 7·26 page seen from surah 26', async () => {
    await page({ a: '26', b: '7' });
    expect(redirect).not.toHaveBeenCalled();
    const pane = screen.getByRole('complementary', { name: 'اختر سورتين' });
    const current = within(pane).getAllByRole('link', { current: 'page' }).map(link => link.getAttribute('href'));
    expect(current).toContain('/quran/compare?a=26&b=7');
    expect(current).not.toContain('/quran/compare?a=7&b=26');
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
    await page({ view: 'similar', a: '69' });
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
