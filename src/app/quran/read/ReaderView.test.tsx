// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render as rtlRender, screen } from '@testing-library/react';
import { LanguageProvider } from '@/components/language/LanguageContext';
import type { ReaderPageData } from '@/lib/quran/readerPage';
import ReaderView from './ReaderView';
import SurahIndex from './SurahIndex';

const push = vi.fn();
vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const render = (ui: React.ReactElement) => rtlRender(ui, { wrapper: LanguageProvider });

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  push.mockClear();
});

const names = { 2: 'سُورَةُ ٱلْبَقَرَةِ', 9: 'سُورَةُ ٱلتَّوْبَةِ', 114: 'سُورَةُ ٱلنَّاسِ' };
const data = (...items: ReaderPageData['items']): ReaderPageData => ({ juz: 1, items });

const opening = data({ surah: 2 }, { line: ['الٓمٓ', 1, 'ذَٰلِكَ', 'ٱلْكِتَـٰبُ'] }, { line: ['لَا', 'رَيْبَ ۩', 2], short: true });

describe('ReaderView', () => {
  it('renders right to left with one circled mark per ayah', () => {
    const { container } = render(<ReaderView page={3} data={opening} names={names} />);
    expect(container.querySelector('article')?.getAttribute('dir')).toBe('rtl');
    expect(screen.getByText('١')).not.toBeNull();
    expect(screen.getByText('٢')).not.toBeNull();
  });

  it('draws each stored line as its own row, in order', () => {
    const { container } = render(<ReaderView page={3} data={opening} names={names} />);
    const rows = [...container.querySelectorAll('section p.flex')];
    expect(rows).toHaveLength(2);
    expect(rows[0].textContent).toContain('ذَٰلِكَ');
    expect(rows[1].textContent).toContain('رَيْبَ');
  });

  it('names a surah that begins on the page with the basmala, and omits it above At-Tawbah', () => {
    const { rerender } = render(<ReaderView page={3} data={opening} names={names} />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(names[2]);
    expect(screen.getAllByText(/بِسْمِ/)).toHaveLength(1);
    rerender(<ReaderView page={187} data={data({ surah: 9 }, { line: ['بَرَآءَةٌ', 1] })} names={names} />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(names[9]);
    expect(screen.queryByText(/بِسْمِ/)).toBeNull();
  });

  it('keeps the circled number of an ayah whose end mark starts the next line', () => {
    render(<ReaderView page={6} data={data({ line: ['وَإِذْ'] }, { line: [30, 'قَالَ', 31] })} names={names} />);
    expect(screen.getByText('٣٠')).not.toBeNull();
    expect(screen.getByText('٣١')).not.toBeNull();
  });

  it('names no surah on a page that only continues one', () => {
    render(<ReaderView page={4} data={data({ line: ['مِن', 5] })} names={names} />);
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });

  it('shows one sajda sign where the word carries it', () => {
    const { container } = render(<ReaderView page={3} data={opening} names={names} />);
    expect(container.textContent?.split('۩')).toHaveLength(2);
  });

  it('centres the two opening pages and short lines, and spreads the rest', () => {
    const { container, rerender } = render(<ReaderView page={2} data={opening} names={names} />);
    expect([...container.querySelectorAll('section p.flex')].every(row => row.className.includes('justify-center'))).toBe(true);
    rerender(<ReaderView page={3} data={opening} names={names} />);
    const rows = [...container.querySelectorAll('section p.flex')];
    expect(rows[0].className).toContain('justify-between');
    expect(rows[1].className).toContain('justify-center');
  });

  it('links to the neighbouring pages and drops the missing one at each end', () => {
    const { rerender } = render(<ReaderView page={1} data={opening} names={names} />);
    expect(screen.queryByText('الصفحة السابقة')).toBeNull();
    expect(screen.getByText('الصفحة التالية').closest('a')?.getAttribute('href')).toBe('/quran/read/2');
    rerender(<ReaderView page={604} data={opening} names={names} />);
    expect(screen.queryByText('الصفحة التالية')).toBeNull();
    expect(screen.getByText('الصفحة السابقة').closest('a')?.getAttribute('href')).toBe('/quran/read/603');
  });

  it('heads a page with the surah it continues and its juz', () => {
    const { container } = render(<ReaderView page={4} data={data({ line: ['مِن', 5] })} names={names} top={2} />);
    expect(container.querySelector('section > div')?.textContent).toBe('البقرةالجزء ١');
  });

  it('labels the controls in English when English is chosen, keeping the mushaf right to left', () => {
    localStorage.setItem('language', 'en');
    const { container } = render(<ReaderView page={3} data={opening} names={names} />);
    localStorage.removeItem('language');
    expect(screen.getByText('Next page').closest('a')?.getAttribute('href')).toBe('/quran/read/4');
    expect(screen.getByLabelText('Page number')).not.toBeNull();
    expect(container.querySelector('article')?.getAttribute('dir')).toBe('rtl');
  });

  it('marks the words and end of the ayah it was opened at', () => {
    const page = data({ line: ['مِن', 5, 'إِنَّ', 'ٱلَّذِينَ'] }, { line: ['كَفَرُوا۟', 6, 'خَتَمَ'] });
    const { container } = render(<ReaderView page={3} data={page} names={names} top={2} mark={{ surah: 2, ayah: 6 }} />);
    expect([...container.querySelectorAll('[data-marked]')].map(span => span.textContent)).toEqual(['إِنَّ', 'ٱلَّذِينَ', 'كَفَرُوا۟٦']);
    expect(screen.getByText('٦').className).toContain('bg-[var(--home-accent)]');
    expect(screen.getByText('٥').className).not.toContain('bg-[var(--home-accent)]');
  });

  it('jumps to a page by number and ignores one out of range', () => {
    render(<ReaderView page={3} data={opening} names={names} />);
    const input = screen.getByLabelText('رقم الصفحة');
    fireEvent.change(input, { target: { value: '77' } });
    fireEvent.submit(input.closest('form')!);
    expect(push).toHaveBeenCalledWith('/quran/read/77');
    fireEvent.change(input, { target: { value: '605' } });
    fireEvent.submit(input.closest('form')!);
    expect(push).toHaveBeenCalledTimes(1);
  });
});

describe('SurahIndex', () => {
  const surahs = [
    { number: 1, name: 'سُورَةُ ٱلْفَاتِحَةِ', nameTransliterated: 'Al-Faatiha', numberOfAyat: 7, page: 1 },
    { number: 2, name: 'سُورَةُ ٱلْبَقَرَةِ', nameTransliterated: 'Al-Baqara', numberOfAyat: 286, page: 2 },
    { number: 3, name: 'سُورَةُ آلِ عِمۡرَانَ', nameTransliterated: 'Aal-i-Imraan', numberOfAyat: 200, page: 50 },
  ];
  const hrefs = (root: ParentNode) => [...root.querySelectorAll('li a')].map(a => a.getAttribute('href'));

  it('lists each surah under every juz it has ayat in, linking to where it opens there', () => {
    render(<SurahIndex surahs={surahs} />);
    expect(hrefs(screen.getByRole('region', { name: 'الجزء ١' }))).toEqual(['/quran/read/1', '/quran/read/2']);
    expect(hrefs(screen.getByRole('region', { name: 'الجزء ٢' }))).toEqual(['/quran/read/22']);
    expect(screen.getByRole('region', { name: 'الجزء ٢' }).textContent).toContain('من الآية ١٤٢');
    expect(hrefs(screen.getByRole('region', { name: 'الجزء ٣' }))).toEqual(['/quran/read/42', '/quran/read/50']);
  });

  it('narrows the list to the surahs a search names, by name or number', () => {
    render(<SurahIndex surahs={surahs} />);
    const search = screen.getByLabelText('ابحث عن سورة أو آية');
    fireEvent.change(search, { target: { value: 'عمران' } });
    expect(screen.getAllByRole('region').map(section => section.getAttribute('aria-label'))).toEqual(['الجزء ٣', 'الجزء ٤']);
    fireEvent.change(search, { target: { value: '٢' } });
    expect(screen.getAllByRole('region')).toHaveLength(3);
    fireEvent.change(search, { target: { value: 'kahf' } });
    expect(screen.queryAllByRole('region')).toHaveLength(0);
    expect(screen.getByText('لا توجد سورة بهذا الاسم أو الرقم.')).not.toBeNull();
  });

  it('offers to open an ayah typed as a reference, and opens it on Enter', () => {
    render(<SurahIndex surahs={surahs} />);
    const search = screen.getByLabelText('ابحث عن سورة أو آية');
    fireEvent.change(search, { target: { value: 'البقرة ٢٥٥' } });
    expect(screen.getByText('افتح البقرة ٢٥٥').closest('a')?.getAttribute('href')).toBe('/quran/read/ayah/2/255');
    expect(screen.getAllByRole('region').map(section => section.getAttribute('aria-label'))).toEqual(['الجزء ١', 'الجزء ٢', 'الجزء ٣']);
    fireEvent.submit(search.closest('form')!);
    expect(push).toHaveBeenCalledWith('/quran/read/ayah/2/255');
    fireEvent.change(search, { target: { value: '2:300' } });
    expect(screen.queryByText(/افتح/)).toBeNull();
  });

  it('lists the ayat whose words a search names, with the match marked, once the server answers', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ total: 2, hits: [{ key: '2:255', page: 42, words: ['ٱللَّهُ', 'لَآ', 'إِلَـٰهَ', 'إِلَّا', 'هُوَ', 'ٱلْحَىُّ', 'ٱلْقَيُّومُ'], from: 5, to: 6 }, { key: '3:2', page: 50, words: ['ٱلْحَىُّ', 'ٱلْقَيُّومُ'], from: 0, to: 1 }] }),
    }));
    vi.stubGlobal('fetch', fetchMock);
    render(<SurahIndex surahs={surahs} />);
    fireEvent.change(screen.getByLabelText('ابحث عن سورة أو آية'), { target: { value: 'الحي القيوم' } });
    const results = await screen.findByRole('region', { name: 'آيات' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(`/api/quran/search?q=${encodeURIComponent('الحي القيوم')}`, expect.anything());
    expect([...results.querySelectorAll('a')].map(a => a.getAttribute('href'))).toEqual(['/quran/read/ayah/2/255', '/quran/read/ayah/3/2']);
    expect([...results.querySelectorAll('mark')].map(mark => mark.textContent)).toEqual(['ٱلْحَىُّ', 'ٱلْقَيُّومُ', 'ٱلْحَىُّ', 'ٱلْقَيُّومُ']);
    expect(results.textContent).toContain('البقرة ٢٥٥');
    expect(screen.queryByText('لا توجد سورة بهذا الاسم أو الرقم.')).toBeNull();
  });

  it('says when no ayah matches, and when the search fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ total: 0, hits: [] }) })));
    render(<SurahIndex surahs={surahs} />);
    const search = screen.getByLabelText('ابحث عن سورة أو آية');
    fireEvent.change(search, { target: { value: 'كلمة غائبة' } });
    expect(screen.getByRole('status')).not.toBeNull();
    expect(await screen.findByText('لا توجد سورة ولا آية بهذا النص.')).not.toBeNull();
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 500 })));
    fireEvent.change(search, { target: { value: 'كلمة أخرى' } });
    expect(await screen.findByText('تعذّر البحث في الآيات الآن.')).not.toBeNull();
  });

  it('does not search ayat for a reference or a single letter', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<SurahIndex surahs={surahs} />);
    const search = screen.getByLabelText('ابحث عن سورة أو آية');
    fireEvent.change(search, { target: { value: '2:255' } });
    fireEvent.change(search, { target: { value: 'ق' } });
    await new Promise(resolve => setTimeout(resolve, 300));
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
