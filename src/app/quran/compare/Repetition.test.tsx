// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { num } from '@/lib/quran/arabicNumber';
import { RepetitionProvider, RepetitionStats, SurahRepetition, VISIBLE } from './Repetition';
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

const many: Repetition = {
  surahs: [{ number: 1, name: 'Alpha', ayat: 60, words: 100 }],
  cells: [{ a: 1, b: 1, words: 100, phrases: VISIBLE + 5 }],
  within: Array.from({ length: VISIBLE + 5 }, (_, i) => ({ surah: 1, text: '', len: 4, at: [{ ayah: 2 * i + 1, word: 0 }, { ayah: 2 * i + 2, word: 0 }] })),
  across: [],
  passages: [],
  ayat: Object.fromEntries(Array.from({ length: 2 * (VISIBLE + 5) }, (_, i) => [`1:${i + 1}`, 'أ ب ت ث ج'])),
};

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
    await show(<><RepetitionStats /><SurahRepetition surah={1} /></>);
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

describe('SurahRepetition', () => {
  it('renders the phrase rows of the surah, with one tick per place', async () => {
    await show(<SurahRepetition surah={1} />);
    expect(screen.getByRole('heading', { name: /عبارات تتكرر داخل/ })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /^الآية/ })).toHaveLength(2);
  });

  it('shows the coloured ayah when a tick is pressed', async () => {
    await show(<SurahRepetition surah={1} />);
    fireEvent.click(screen.getAllByRole('button', { name: /^الآية/ })[0]);
    const marked = Array.from(document.querySelectorAll('mark')).map(m => m.textContent);
    expect(marked.join(' ')).toBe(refrain.join(' '));
  });

  it('caps the phrase rows and expands the rest on the button', async () => {
    await show(<SurahRepetition surah={1} />, many);
    const groups = () => screen.getAllByRole('group', { name: /مواضع/ });
    expect(groups()).toHaveLength(VISIBLE);
    fireEvent.click(screen.getAllByRole('button', { name: /عرض الباقي/ })[0]);
    expect(groups()).toHaveLength(VISIBLE + 5);
  });

  it('says plainly when a surah has nothing to show', async () => {
    await show(<SurahRepetition surah={3} />);
    expect(screen.getByText('لا عبارات تتكرر داخل هذه السورة.')).toBeTruthy();
  });

  it('resets the selected tick when the surah changes', async () => {
    const two: Repetition = {
      ...many,
      surahs: [many.surahs[0], { ...many.surahs[0], number: 2, name: 'Beta' }],
      within: [...many.within, ...many.within.map(w => ({ ...w, surah: 2 }))],
      ayat: { ...many.ayat, ...Object.fromEntries(Object.keys(many.ayat).map(k => [`2:${k.split(':')[1]}`, many.ayat[k]])) },
    };
    const { rerender } = await show(<SurahRepetition surah={1} />, two);
    fireEvent.click(screen.getAllByRole('button', { name: /^الآية/ })[0]);
    expect(document.querySelectorAll('mark').length).toBeGreaterThan(0);
    act(() => rerender(<RepetitionProvider><SurahRepetition surah={2} /></RepetitionProvider>));
    expect(document.querySelectorAll('mark')).toHaveLength(0);
  });
});
