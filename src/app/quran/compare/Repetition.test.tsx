// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { num } from '@/lib/quran/arabicNumber';
import { RepetitionProvider, RepetitionStats } from './Repetition';
import { buildRepetition, type Repetition, type RepetitionInput } from '@/lib/quran/repetition';

const nav = vi.hoisted(() => {
  let url = '/quran/compare';
  return { getUrl: () => url, setUrl: (next: string) => { url = next; } };
});

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: (next: string) => nav.setUrl(next) }) }));

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'ar' }),
}));

const LETTERS = 'ابتثجحخ';
const MORE = 'دذرزسشص';
const word = (prefix: string, i: number) => `${prefix}${LETTERS[i % 7]}${MORE[Math.floor(i / 7) % 7]}`;
const span = (prefix: string, from: number, n: number) => Array.from({ length: n }, (_, k) => word(prefix, from + k));
const shared = span('ك', 0, 12);
const refrain = span('ق', 0, 4);

const input: RepetitionInput = [
  { number: 1, name: 'Alpha', ayat: [[...refrain, ...span('ن', 0, 3)].join(' '), [...refrain, ...span('ي', 0, 3)].join(' '), shared.join(' ')] },
  { number: 2, name: 'Beta', ayat: [span('ل', 0, 5).join(' '), shared.join(' ')] },
  { number: 3, name: 'Gamma', ayat: [span('ب', 0, 6).join(' ')] },
];
const data = buildRepetition(input);

const serve = (body: Repetition, ayah = { ok: false, json: async () => ({}) }) =>
  vi.fn(async (url: string) => (url === '/api/quran/repetition' ? { ok: true, json: async () => body } : ayah));

async function show(ui: React.ReactElement, body: Repetition = data) {
  vi.stubGlobal('fetch', serve(body));
  const view = render(<RepetitionProvider>{ui}</RepetitionProvider>);
  await waitFor(() => expect(screen.queryByRole('status')).toBeNull());
  return view;
}


beforeEach(() => nav.setUrl('/quran/compare'));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('RepetitionProvider', () => {
  it('fetches /api/quran/repetition once for every part of the page', async () => {
    await show(<><RepetitionStats /><RepetitionStats /></>);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/api/quran/repetition');
  });

  it('says so when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => ({}) })));
    render(<RepetitionProvider><RepetitionStats /></RepetitionProvider>);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toBe('تعذر تحميل البيانات.'));
  });
});

describe('RepetitionStats', () => {
  it('counts surahs, phrases repeated inside a surah, passages shared between surahs, and the surahs that share one', async () => {
    await show(<RepetitionStats />);
    const tile = (label: string) => screen.getByText(label).previousElementSibling!.textContent;
    expect(tile('سورة')).toBe('٣');
    expect(tile('عبارة تتكرر داخل سورة')).toBe(num(data.within.length));
    expect(tile('سورة فيها نص مشترك')).toBe('٢');
    expect(screen.getByRole('link', { name: /قارن السور/ }).getAttribute('href')).toBe('/quran/compare');
  });
});
