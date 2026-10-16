// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import RepetitionView, { VISIBLE } from './RepetitionView';
import RepetitionLoader from './RepetitionLoader';
import { levelOf } from './RepetitionMatrix';
import { buildRepetition, type Repetition, type RepetitionInput } from '@/lib/quran/repetition';

const nav = vi.hoisted(() => {
  let url = '/quran';
  const listeners = new Set<() => void>();
  return {
    getUrl: () => url,
    setUrl: (next: string) => { url = next; listeners.forEach(l => l()); },
    subscribe: (l: () => void) => { listeners.add(l); return () => listeners.delete(l); },
  };
});

vi.mock('next/navigation', async () => {
  const React = await vi.importActual<typeof import('react')>('react');
  return {
    useRouter: () => ({ replace: (next: string) => nav.setUrl(next), push: (next: string) => nav.setUrl(next) }),
    usePathname: () => '/quran',
    useSearchParams: () => {
      const search = React.useSyncExternalStore(nav.subscribe, () => nav.getUrl().split('?')[1] ?? '', () => nav.getUrl().split('?')[1] ?? '');
      return React.useMemo(() => new URLSearchParams(search), [search]);
    },
  };
});

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

const OVERVIEW = 'اختر سورة أو خلية لعرض المواضع.';

beforeEach(() => nav.setUrl('/quran'));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('RepetitionView', () => {
  it('shows the overview with no s, and no detail sections', () => {
    render(<RepetitionView data={data} />);
    expect(screen.getByText(OVERVIEW)).toBeTruthy();
    expect(screen.queryByText(/عبارات تتكرر داخل/)).toBeNull();
  });

  it('falls back to the overview for an invalid s', () => {
    nav.setUrl('/quran?s=999');
    render(<RepetitionView data={data} />);
    expect(screen.getByText(OVERVIEW)).toBeTruthy();
    cleanup();
    nav.setUrl('/quran?s=abc');
    render(<RepetitionView data={data} />);
    expect(screen.getByText(OVERVIEW)).toBeTruthy();
  });

  it('renders the phrase rows of the surah named in s, with one tick per place', () => {
    nav.setUrl('/quran?s=1');
    render(<RepetitionView data={data} />);
    expect(screen.getByRole('heading', { name: /عبارات تتكرر داخل/ })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /^الآية/ })).toHaveLength(2);
  });

  it('shows the coloured ayah when a tick is pressed', () => {
    nav.setUrl('/quran?s=1');
    render(<RepetitionView data={data} />);
    fireEvent.click(screen.getAllByRole('button', { name: /^الآية/ })[0]);
    const marked = Array.from(document.querySelectorAll('mark')).map(m => m.textContent);
    expect(marked.join(' ')).toBe(refrain.join(' '));
  });

  it('caps the phrase rows and expands the rest on the button', () => {
    nav.setUrl('/quran?s=1');
    render(<RepetitionView data={many} />);
    const rows = () => screen.getAllByRole('group', { name: /مواضع/ });
    expect(rows()).toHaveLength(VISIBLE);
    fireEvent.click(screen.getAllByRole('button', { name: /عرض الباقي/ })[0]);
    expect(rows()).toHaveLength(VISIBLE + 5);
  });

  it('says plainly when a surah has nothing to show', () => {
    nav.setUrl('/quran?s=3');
    render(<RepetitionView data={data} />);
    expect(screen.getByText('لا عبارات تتكرر داخل هذه السورة.')).toBeTruthy();
    expect(screen.getByText('لا نصوص مشتركة بين هذه السورة وغيرها.')).toBeTruthy();
  });

  it('lists the partner surahs and opens the pair on a press', () => {
    nav.setUrl('/quran?s=1');
    render(<RepetitionView data={data} />);
    const partner = screen.getAllByRole('button').find(b => b.textContent?.includes('·') && !b.closest('ol'))!;
    fireEvent.click(partner);
    expect(nav.getUrl()).toBe('/quran?s=1&t=2');
  });

  it('shows the shared passage of a pair side by side', () => {
    nav.setUrl('/quran?s=1&t=2');
    render(<RepetitionView data={data} />);
    expect(screen.getByText('١٢ كلمة متطابقة')).toBeTruthy();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  it('selects a surah from the ranked list', () => {
    render(<RepetitionView data={data} />);
    fireEvent.click(within(screen.getByRole('list')).getAllByRole('button')[0]);
    expect(nav.getUrl()).toMatch(/^\/quran\?s=\d+$/);
  });

  it('lists every surah in the ranked list, with no cap', () => {
    const n = VISIBLE + 5;
    const wide: Repetition = {
      ...many,
      surahs: Array.from({ length: n }, (_, i) => ({ number: i + 1, name: `S${i}`, ayat: 1, words: 1 })),
      cells: Array.from({ length: n }, (_, i) => ({ a: i + 1, b: i + 1, words: 1, phrases: 1 })),
      within: [],
    };
    render(<RepetitionView data={wide} />);
    expect(within(screen.getAllByRole('list')[0]).getAllByRole('button')).toHaveLength(n);
    expect(screen.queryByRole('button', { name: /عرض الباقي/ })).toBeNull();
  });

  it('switches the ranked list to pairs', () => {
    render(<RepetitionView data={data} />);
    fireEvent.click(screen.getByRole('button', { name: 'الأزواج' }));
    const rows = within(screen.getByRole('list')).getAllByRole('button');
    expect(rows).toHaveLength(1);
    fireEvent.click(rows[0]);
    expect(nav.getUrl()).toBe('/quran?s=1&t=2');
  });

  it('selects a cell of the matrix', () => {
    render(<RepetitionView data={data} />);
    const cell = Array.from(document.querySelectorAll('svg[role="img"] rect.cursor-pointer')).find(r => r.querySelector('title')?.textContent?.includes('مشتركة'))!;
    fireEvent.click(cell);
    expect(nav.getUrl()).toBe('/quran?s=1&t=2');
  });
});

describe('RepetitionView pair and edge cases', () => {
  it('treats t equal to s as the surah view, and t without s as the overview', () => {
    nav.setUrl('/quran?s=3&t=3');
    render(<RepetitionView data={data} />);
    expect(screen.getByText('لا عبارات تتكرر داخل هذه السورة.')).toBeTruthy();
    cleanup();
    nav.setUrl('/quran?t=2');
    render(<RepetitionView data={data} />);
    expect(screen.getByText(OVERVIEW)).toBeTruthy();
  });

  it('says so for a pair with no shared passage', () => {
    nav.setUrl('/quran?s=1&t=3');
    render(<RepetitionView data={data} />);
    expect(screen.getByText('لا نصوص مشتركة بين هاتين السورتين.')).toBeTruthy();
  });

  it('puts the surah named in s first, with its own ayah in the passage option', () => {
    nav.setUrl('/quran?s=2&t=1');
    render(<RepetitionView data={data} />);
    expect(screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent)).toEqual(['Beta', 'Alpha']);
    expect(screen.getByRole('option').textContent).toMatch(/^٢ ← ٣/);
  });

  it('resets the selected tick when s changes', () => {
    const two: Repetition = {
      ...many,
      surahs: [many.surahs[0], { ...many.surahs[0], number: 2, name: 'Beta' }],
      within: [...many.within, ...many.within.map(w => ({ ...w, surah: 2 }))],
      ayat: { ...many.ayat, ...Object.fromEntries(Object.keys(many.ayat).map(k => [`2:${k.split(':')[1]}`, many.ayat[k]])) },
    };
    nav.setUrl('/quran?s=1');
    render(<RepetitionView data={two} />);
    fireEvent.click(screen.getAllByRole('button', { name: /^الآية/ })[0]);
    expect(document.querySelectorAll('mark').length).toBeGreaterThan(0);
    act(() => nav.setUrl('/quran?s=2'));
    expect(document.querySelectorAll('mark')).toHaveLength(0);
  });

  it('marks the selected diagonal cell, or the pair in either order, on the matrix', () => {
    const stroked = () => Array.from(document.querySelectorAll('svg[role="img"] rect')).filter(r => r.getAttribute('class')?.includes('stroke-[1.5px]'));
    nav.setUrl('/quran?s=1');
    render(<RepetitionView data={data} />);
    expect(stroked()).toHaveLength(1);
    expect(stroked()[0].querySelector('title')?.textContent).toContain('كلمة مكررة');
    cleanup();
    nav.setUrl('/quran?s=2&t=1');
    render(<RepetitionView data={data} />);
    expect(stroked()).toHaveLength(2);
  });

  it('adds the next ayah on press, and says so when it cannot load', async () => {
    nav.setUrl('/quran?s=1&t=2');
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => ({}) })));
    const longer = buildRepetition([
      { number: 1, name: 'Delta', ayat: [shared.join(' '), span('م', 0, 4).join(' ')] },
      { number: 2, name: 'Epsilon', ayat: [shared.join(' '), span('ه', 0, 4).join(' ')] },
    ]);
    render(<RepetitionView data={longer} />);
    fireEvent.click(screen.getAllByRole('button', { name: 'عرض الآية التالية' })[0]);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toBe('تعذر تحميل الآية.'));
  });
});

describe('RepetitionLoader', () => {
  it('fetches /api/quran/repetition once and renders the view', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => data }));
    vi.stubGlobal('fetch', fetchMock);
    render(<RepetitionLoader />);
    await waitFor(() => expect(screen.getByRole('heading', { name: 'مصفوفة السور' })).toBeTruthy());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/quran/repetition');
  });

  it('says so when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => ({}) })));
    render(<RepetitionLoader />);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toBe('تعذر تحميل البيانات.'));
  });
});

describe('levelOf', () => {
  it('buckets repeated words into the five colour levels', () => {
    expect(levelOf(1)).toBeLessThan(levelOf(900));
    expect([1, 12, 40, 100, 500].map(levelOf)).toEqual([0, 1, 2, 3, 4]);
  });
});
