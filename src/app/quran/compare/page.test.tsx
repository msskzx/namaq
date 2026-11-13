// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import QuranComparePage from './page';
import { NavSlotElement } from '@/components/common/NavBar';
import { engineCards, pairCards } from './pairCards';

const locale = vi.hoisted(() => ({ language: 'ar' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => locale }));

const redirect = vi.hoisted(() => vi.fn((url: string) => { throw new Error(`redirect ${url}`); }));
vi.mock('next/navigation', () => ({ redirect, useRouter: () => ({ push: () => {}, prefetch: () => {} }) }));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: (name: string) => (name === 'branches-view' ? { value: 'cards' } : undefined) }) }));
vi.mock('@/lib/quran/surahList', () => ({ surahList: async () => [{ number: 2, name: 'الْبَقَرَةِ', nameTransliterated: 'Al-Baqarah' }, { number: 7, name: 'الْاَعْرَافِ', nameTransliterated: "Al-A'raf" }, { number: 26, name: 'الشُّعَرَآءِ', nameTransliterated: "Ash-Shu'ara" }] }));

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
    expect(trigger.textContent).toContain('سورة البقرة وسورة الأعراف');
  });

  it('shows the similar ayat of the two surahs, with the stories pinned and mushaf order first', async () => {
    await page({ a: '7', b: '26' });
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('مُوسَىٰ وَفِرۡعَوۡنُ');
    const pane = screen.getByRole('complementary', { name: 'اختر سورتين' });
    expect(within(pane).getByRole('button', { name: /ترتيب المصحف/ }).getAttribute('aria-pressed')).toBe('true');
    const current = within(pane).getAllByRole('link', { current: 'page' });
    // The count follows the curated verdicts, which change as pairs are reviewed.
    const texts = current.map(link => link.textContent ?? '');
    expect(texts.map(text => text.replace(/[٠-٩]+$/, ''))).toEqual(['مُوسَىٰ وَفِرۡعَوۡنُالأعراف · الشعراء', 'الشعراء']);
    const counts = new Set(texts.map(text => text.match(/[٠-٩]+$/)?.[0]));
    expect(counts.size).toBe(1);
    const count = Number([...counts][0]!.replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))));
    expect(count).toBeGreaterThan(0);
    expect(screen.getAllByRole('article').length).toBe(pairCards(7, 26).length * 2);
    expect(engineCards(7, 26).reduce((sum, card) => sum + (card.pairs?.length ?? 1), 0)).toBe(count);
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

  it('opens the default pair for an old full-comparison link', async () => {
    await page({ view: 'similar', juzFrom: '25', juzTo: '30' });
    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /اختر سورتين/ }).textContent).toContain('سورة البقرة وسورة الأعراف');
  });

  it('opens the pair an old full-comparison link names by a and b', async () => {
    await page({ a: '26', b: '7', view: 'ayat', af: '10', at: '20' });
    expect(screen.getByRole('button', { name: /اختر سورتين/ }).textContent).toContain('سورة الشعراء وسورة الأعراف');
  });
});
