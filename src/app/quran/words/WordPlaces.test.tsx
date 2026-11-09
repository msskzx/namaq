// @vitest-environment jsdom
import React from 'react';
import { SWRConfig } from 'swr';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import WordPlaces, { PLACES_STEP, placesByAyah } from './WordPlaces';

vi.mock('next/navigation', () => ({ useRouter: () => ({}), usePathname: () => '/quran/words', useSearchParams: () => new URLSearchParams() }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
vi.mock('./places.json', () => ({ default: { places: { 'أَرْض': Array.from({ length: PLACES_STEP + 3 }, (_, i) => `2:${i + 1}:2`).join(' ') + ' 2:3:4', 'سَمَآء': '1:1:1' } } }));
vi.mock('@/lib/quran/quranText', () => ({
  loadQuranText: async () => Array.from({ length: PLACES_STEP + 3 }, (_, i) => ({ key: `2:${i + 1}`, page: 2 + i, words: ['أ', 'الارض', 'ب', 'ارضا'] })),
}));

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const show = (word = 'أَرْض') => {
  vi.stubGlobal('fetch', async () => ({ ok: true, json: async () => [{ number: 2, name: 'البقرة' }] }));
  render(<SWRConfig value={{ provider: () => new Map() }}><WordPlaces word={word} count={30} /></SWRConfig>);
};

describe('placesByAyah', () => {
  it('groups word places by ayah, zero-based, in order', () => {
    expect(placesByAyah('2:3:2 2:3:4 10:1:1')).toEqual([{ key: '2:3', words: [1, 3] }, { key: '10:1', words: [0] }]);
  });
});

describe('WordPlaces', () => {
  it('lists the ayat holding the word, marks it and links to the reader', async () => {
    show();
    const list = await screen.findByRole('list', { name: 'مواضع «أَرْض»' });
    expect(screen.getByText(`٣٠ مرة في ${String(PLACES_STEP + 3).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)])} آية`)).toBeTruthy();
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(PLACES_STEP);
    expect(await within(items[0]).findByText('البقرة ١')).toBeTruthy();
    expect(within(items[0]).getAllByRole('link', { name: 'قراءة الآية' })[0].getAttribute('href')).toBe('/quran/read/2?a=2:1');
    expect([...items[2].querySelectorAll('mark')].map(mark => mark.textContent)).toEqual(['الارض', 'ارضا']);
  });

  it('shows more places on demand', async () => {
    show();
    fireEvent.click(await screen.findByRole('button', { name: 'المزيد (٣)' }));
    expect(within(screen.getByRole('list', { name: 'مواضع «أَرْض»' })).getAllByRole('listitem')).toHaveLength(PLACES_STEP + 3);
    expect(screen.queryByRole('button', { name: /المزيد/ })).toBeNull();
  });
});
