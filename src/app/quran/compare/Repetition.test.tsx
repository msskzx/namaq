// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { RepetitionList, RepetitionProvider, SharedPassages, SurahRepetition, VISIBLE } from './Repetition';
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

const list = (props: Partial<React.ComponentProps<typeof RepetitionList>> = {}) => <RepetitionList a={56} b={69} surah={null} mode="text" {...props} />;
const rows = () => within(screen.getByRole('list')).getAllByRole('button');

beforeEach(() => nav.setUrl('/quran/compare'));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('RepetitionProvider', () => {
  it('fetches /api/quran/repetition once for every part of the page', async () => {
    await show(<>{list()}<SurahRepetition surah={1} /><SharedPassages a={1} b={2} /></>);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/api/quran/repetition');
  });

  it('says so when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => ({}) })));
    render(<RepetitionProvider>{list()}</RepetitionProvider>);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toBe('تعذر تحميل البيانات.'));
  });
});

describe('RepetitionList', () => {
  it('opens a surah from the ranked list', async () => {
    await show(list());
    fireEvent.click(rows()[0]);
    expect(nav.getUrl()).toMatch(/^\/quran\/compare\?s=\d+$/);
  });

  it('lists every surah, with no cap', async () => {
    const n = VISIBLE + 5;
    const wide: Repetition = {
      ...many,
      surahs: Array.from({ length: n }, (_, i) => ({ number: i + 1, name: `S${i}`, ayat: 1, words: 1 })),
      cells: Array.from({ length: n }, (_, i) => ({ a: i + 1, b: i + 1, words: 1, phrases: 1 })),
      within: [],
    };
    await show(list(), wide);
    expect(rows()).toHaveLength(n);
  });

  it('sorts by surah number with the sort switch, and back by clicking its label', async () => {
    const wide: Repetition = {
      ...many,
      surahs: [1, 2, 3].map(n => ({ number: n, name: `S${n}`, ayat: 1, words: n })),
      cells: [1, 2, 3].map(n => ({ a: n, b: n, words: n, phrases: 1 })),
      within: [],
    };
    await show(list(), wide);
    const labels = () => rows().map(b => b.textContent?.replace(/[٠-٩]/g, ''));
    expect(labels()).toEqual(['S3', 'S2', 'S1']);
    fireEvent.click(screen.getByRole('switch', { name: 'ترتيب بالرقم' }));
    expect(labels()).toEqual(['S1', 'S2', 'S3']);
    fireEvent.click(screen.getByText('ترتيب بالعدد'));
    expect(labels()).toEqual(['S3', 'S2', 'S1']);
  });

  it('switches to pairs and opens the pair in the comparison', async () => {
    await show(list());
    fireEvent.click(screen.getByRole('switch', { name: 'الأزواج' }));
    expect(rows()).toHaveLength(1);
    fireEvent.click(rows()[0]);
    expect(nav.getUrl()).toBe('/quran/compare?a=1&b=2');
  });

  it('keeps the topic view when a pair is opened from it', async () => {
    await show(list({ mode: 'themes' }));
    fireEvent.click(screen.getByRole('switch', { name: 'الأزواج' }));
    fireEvent.click(rows()[0]);
    expect(nav.getUrl()).toBe('/quran/compare?mode=themes&a=1&b=2');
  });

  it('marks the pair being compared in either order, and the surah being shown', async () => {
    await show(list({ a: 2, b: 1 }));
    fireEvent.click(screen.getByRole('switch', { name: 'الأزواج' }));
    expect(rows()[0].getAttribute('aria-current')).toBe('true');
    cleanup();
    await show(list({ surah: 1 }));
    expect(rows().filter(r => r.getAttribute('aria-current') === 'true').map(r => r.textContent)).toEqual([expect.stringContaining('Alpha')]);
  });

  it('draws no matrix', async () => {
    await show(list());
    expect(screen.queryByRole('heading', { name: 'مصفوفة السور' })).toBeNull();
    expect(document.querySelector('rect')).toBeNull();
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
    expect(screen.getByText('لا نصوص مشتركة بين هذه السورة وغيرها.')).toBeTruthy();
  });

  it('lists the partner surahs and opens the pair in the comparison', async () => {
    await show(<SurahRepetition surah={1} />);
    fireEvent.click(screen.getAllByRole('button').find(b => b.textContent?.includes('·'))!);
    expect(nav.getUrl()).toBe('/quran/compare?a=1&b=2');
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

describe('SharedPassages', () => {
  it('shows the shared passage of a pair side by side', async () => {
    await show(<SharedPassages a={1} b={2} />);
    expect(screen.getByText('١٢ كلمة متطابقة')).toBeTruthy();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  it('shows nothing for a pair with no shared passage, or one surah against itself', async () => {
    const { container } = await show(<><SharedPassages a={1} b={3} /><SharedPassages a={2} b={2} /></>);
    expect(container.textContent).toBe('');
  });

  it('puts surah a first, with its own ayah in the passage option', async () => {
    await show(<SharedPassages a={2} b={1} />);
    expect(screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent)).toEqual(['Beta', 'Alpha']);
    expect(screen.getByRole('option').textContent).toMatch(/^٢ ← ٣/);
  });

  it('adds the next ayah on press, and says so when it cannot load', async () => {
    const longer = buildRepetition([
      { number: 1, name: 'Delta', ayat: [shared.join(' '), span('م', 0, 4).join(' ')] },
      { number: 2, name: 'Epsilon', ayat: [shared.join(' '), span('ه', 0, 4).join(' ')] },
    ]);
    await show(<SharedPassages a={1} b={2} />, longer);
    fireEvent.click(screen.getAllByRole('button', { name: 'عرض الآية التالية' })[0]);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toBe('تعذر تحميل الآية.'));
  });
});
