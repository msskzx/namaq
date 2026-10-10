// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import QuranDemo from './QuranDemo';
import runs from './data/runs.json';
import ayat from './data/ayat.json';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'ar' }),
}));

const side = runs.passages[0].a;
const surahTwo = { ayat: [{ number: side.to.ayah + 1, text: 'إِنَّ ٱلَّذِینَ كَفَرُوا۟' }] };
const mockFetch = (ok = true) => {
  const fn = vi.fn(async () => ({ ok, json: async () => surahTwo }));
  vi.stubGlobal('fetch', fn);
  return fn;
};
const renderDemo = () => render(<QuranDemo runs={runs as never} ayat={ayat} />);
const FULL = 'عرض الآية كاملة';
const NEXT = 'عرض الآية التالية';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('QuranDemo boundary buttons', () => {
  it('expands the partial ayat without fetching', () => {
    const fetchMock = mockFetch();
    renderDemo();
    const before = document.querySelectorAll('mark').length;
    const words = () => document.querySelector('.font-arabic')!.textContent!.split(' ').length;
    const wordsBefore = words();
    fireEvent.click(screen.getAllByRole('button', { name: FULL })[0]);
    expect(words()).toBeGreaterThan(wordsBefore);
    expect(screen.getAllByRole('button', { name: FULL })).toHaveLength(1);
    expect(document.querySelectorAll('mark').length).toBe(before);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fetches the surah once and appends the next ayah as plain text', async () => {
    const fetchMock = mockFetch();
    renderDemo();
    fireEvent.click(screen.getAllByRole('button', { name: NEXT })[0]);
    await waitFor(() => expect(screen.getByText(/^إِنَّ/)).toBeTruthy());
    expect(fetchMock).toHaveBeenCalledWith(`/api/quran/surahs/${side.from.surah}`);
    expect(screen.getByText(/^إِنَّ/).querySelector('mark')).toBeNull();
  });

  it('ignores a second press while the surah is loading', async () => {
    const fetchMock = mockFetch();
    renderDemo();
    const next = screen.getAllByRole('button', { name: NEXT })[0];
    fireEvent.click(next);
    fireEvent.click(next);
    await waitFor(() => expect(screen.getAllByText(/^إِنَّ/)).toHaveLength(1));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('says so when the next ayah cannot be loaded', async () => {
    mockFetch(false);
    renderDemo();
    fireEvent.click(screen.getAllByRole('button', { name: NEXT })[0]);
    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());
  });
});
