// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render as rtlRender, screen, within } from '@testing-library/react';
import { NavSlotElement, RailSlotElement } from '@/components/common/NavBar';
import { usePageHelp } from '@/components/common/SettingsHelp';
import { LanguageProvider } from '@/components/language/LanguageContext';
import type { MushafPage } from '@/lib/quran/readerPage';
import ReaderView, { MarkedReaderView } from './ReaderView';
import SurahIndex from './SurahIndex';

const push = vi.fn();
const replace = vi.fn();
const prefetch = vi.fn();
let search = new URLSearchParams();
vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });

vi.mock('next/navigation', () => ({ useRouter: () => ({ push, replace, prefetch }), useSearchParams: () => search }));
const searchQuran = vi.hoisted(() => vi.fn());
vi.mock('@/lib/quran/quranText', () => ({ searchQuran, preloadQuranSearch: () => {} }));

const render = (ui: React.ReactElement) => rtlRender(ui, { wrapper: LanguageProvider });

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  push.mockClear();
  replace.mockClear();
  prefetch.mockClear();
  search = new URLSearchParams();
  searchQuran.mockReset();
});

const names = { 2: 'سُورَةُ ٱلْبَقَرَةِ', 9: 'سُورَةُ ٱلتَّوْبَةِ', 23: 'سُورَةُ ٱلْمُؤْمِنُونَ', 114: 'سُورَةُ ٱلنَّاسِ' };
const data = (...items: MushafPage['items']): MushafPage => ({ juz: 1, items });
const one = (page: number, page_data: MushafPage, top?: number) => [{ page, data: page_data, top }];

const opening = data({ surah: 2 }, { basmala: true }, { line: ['الٓمٓ', 1, 'ذَٰلِكَ', 'ٱلۡكِتَٰبُ'], quarter: 2 }, { line: ['لَا', 'رَيۡبَۛ', 2] });

const media = (wide: boolean, phone = false) =>
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('max-width') ? phone : wide, addEventListener() {}, removeEventListener() {} }));

describe('ReaderView', () => {
  it('keeps desktop reading controls in the rail and shortcuts in Settings', () => {
    media(true);
    localStorage.setItem('quran-reader-spread', 'one');
    const rail = document.createElement('div');
    function HelpProbe() {
      const help = usePageHelp();
      return help && <section aria-label={help.label}>{help.content}</section>;
    }
    const pages = [...one(3, opening), ...one(4, opening)];
    const { container } = render(<RailSlotElement.Provider value={rail}>
      <ReaderView page={3} pages={pages} names={names} />
      <HelpProbe />
    </RailSlotElement.Provider>);
    expect(screen.queryByRole('navigation', { name: 'أدوات القراءة' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'فهرس السور' })).toBeNull();
    expect(screen.queryByLabelText('رقم الصفحة')).toBeNull();
    expect(within(screen.getByRole('region', { name: 'اختصارات القراءة' })).getByText('D')).toBeTruthy();
    const tools = within(rail);
    const next = tools.getByRole('button', { name: 'الصفحة التالية' });
    expect(next.getAttribute('data-variant')).toBe('muted');
    fireEvent.click(next);
    expect(push).toHaveBeenLastCalledWith('/quran/read/4');
    fireEvent.click(tools.getByRole('button', { name: 'اعرض صفحتين' }));
    localStorage.removeItem('quran-reader-spread');
    expect(container.querySelectorAll('section[data-side]')).toHaveLength(2);
    expect(tools.getByRole('button', { name: 'فهرس السور' }).hasAttribute('popovertarget')).toBe(true);
    expect(tools.getByRole('button', { name: 'ابحث عن سورة أو آية' }).hasAttribute('popovertarget')).toBe(true);
  });

  it('draws the page right to left with the surah title, basmala and one rosette per ayah', () => {
    const { container } = render(<ReaderView page={3} pages={one(3, opening)} names={names} />);
    expect(container.querySelector('article')?.getAttribute('dir')).toBe('rtl');
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(names[2]);
    expect(screen.getAllByText(/بِسۡمِ/)).toHaveLength(1);
    expect(container.querySelectorAll('[data-line]')).toHaveLength(2);
    expect(screen.getByText('١')).not.toBeNull();
    expect(screen.getByText('٢')).not.toBeNull();
  });

  it('heads a page with its juz in words and the surah it continues', () => {
    render(<ReaderView page={343} pages={one(343, { juz: 18, items: [{ line: ['مِن', 5] }] }, 23)} names={names} />);
    const page = screen.getByRole('region', { name: 'الصفحة ٣٤٣' });
    expect(page.textContent).toContain('الجزء الثامن عشر');
    expect(page.textContent).toContain('المؤمنون');
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });

  it('labels the hizb quarter a line opens and the line that carries a sajda', () => {
    const page = data({ line: ['يَسۡجُدُونَۤ۩', 206] }, { line: ['يَسۡـَٔلُونَكَ', 1], quarter: 137 });
    render(<ReaderView page={3} pages={one(3, page)} names={names} />);
    expect(screen.getAllByText('سجدة').length).toBeGreaterThan(0);
    expect(screen.getAllByText('الحزب ٣٥').length).toBeGreaterThan(0);
    expect(screen.getAllByText('الجزء ١٨').length).toBeGreaterThan(0);
  });

  it('marks the words and end of the ayah it was opened at', () => {
    const page = data({ line: ['مِن', 5, 'إِنَّ', 'ٱلَّذِينَ'] }, { line: ['كَفَرُواْ', 6, 'خَتَمَ'] });
    const { container } = render(<ReaderView page={3} pages={one(3, page, 2)} names={names} mark={{ surah: 2, ayah: 6 }} />);
    expect([...container.querySelectorAll('[data-marked]')].map(span => span.textContent)).toEqual(['إِنَّ', 'ٱلَّذِينَ', 'كَفَرُواْ ٦']);
  });

  it('marks the ayah named in the address, and sends one not on the page to the page that holds it', () => {
    search = new URLSearchParams('a=2:1');
    const { container, unmount } = render(<MarkedReaderView page={3} pages={one(3, opening)} names={names} />);
    expect(container.querySelectorAll('[data-marked]').length).toBeGreaterThan(0);
    expect(replace).not.toHaveBeenCalled();
    unmount();
    search = new URLSearchParams('a=2:9');
    render(<MarkedReaderView page={3} pages={one(3, opening)} names={names} />);
    expect(replace).toHaveBeenCalledWith('/quran/read/ayah/2/9');
  });

  it('takes the first ayah named, moves the mark when the address changes, and ignores a malformed one', () => {
    search = new URLSearchParams('a=2:2&a=2:9');
    const marked = (container: HTMLElement) => [...container.querySelectorAll('[data-marked]')].map(span => span.textContent);
    const { container, rerender } = render(<MarkedReaderView page={3} pages={one(3, opening)} names={names} />);
    expect(marked(container)).toEqual(['ذَٰلِكَ', 'ٱلۡكِتَٰبُ', 'لَا', 'رَيۡبَۛ ٢']);
    search = new URLSearchParams('a=2:1');
    rerender(<MarkedReaderView page={3} pages={one(3, opening)} names={names} />);
    expect(marked(container)).toContain('الٓمٓ ١');
    for (const bad of ['x', '2:', ':1']) {
      search = new URLSearchParams(`a=${bad}`);
      rerender(<MarkedReaderView page={3} pages={one(3, opening)} names={names} />);
      expect(marked(container)).toEqual([]);
    }
    expect(replace).not.toHaveBeenCalled();
  });

  it('preloads the pages either side, a spread at a time', () => {
    media(false);
    const { unmount } = render(<ReaderView page={42} pages={one(42, opening)} names={names} />);
    expect([...new Set(prefetch.mock.calls.map(([href]) => href))].sort()).toEqual(['/quran/read/41', '/quran/read/43']);
    unmount();
    prefetch.mockClear();
    render(<ReaderView page={604} pages={one(604, opening)} names={names} />);
    expect([...new Set(prefetch.mock.calls.map(([href]) => href))]).toEqual(['/quran/read/603']);
  });

  it('shows two facing pages, the odd one on the right, when two pages are chosen', () => {
    media(true);
    const pages = [...one(341, data({ line: ['أ', 1] })), ...one(342, data({ line: ['ب', 2] }))];
    const { container } = render(<ReaderView page={342} pages={pages} names={names} />);
    expect([...container.querySelectorAll('section[data-side]')].map(page => [page.getAttribute('aria-label'), page.getAttribute('data-side')])).toEqual([
      ['الصفحة ٣٤١', 'right'],
      ['الصفحة ٣٤٢', 'left'],
    ]);
    fireEvent.click(screen.getByRole('button', { name: 'صفحة' }));
    expect(container.querySelectorAll('section[data-side]')).toHaveLength(1);
    expect(localStorage.getItem('quran-reader-spread')).toBe('one');
    localStorage.removeItem('quran-reader-spread');
  });

  it('keeps to one page on a phone', () => {
    media(true, true);
    const pages = [...one(341, data({ line: ['أ', 1] })), ...one(342, data({ line: ['ب', 2] }))];
    const { container } = render(<ReaderView page={341} pages={pages} names={names} />);
    expect(container.querySelectorAll('section[data-side]')).toHaveLength(1);
    expect(screen.queryByRole('button', { name: 'صفحتان' })).toBeNull();
  });

  it('turns pages with the arrow keys in the mushaf direction, a spread at a time', () => {
    media(false);
    render(<ReaderView page={341} pages={one(341, opening)} names={names} />);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(push).toHaveBeenLastCalledWith('/quran/read/342');
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(push).toHaveBeenLastCalledWith('/quran/read/340');
    fireEvent.keyDown(window, { key: 'd' });
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(push).toHaveBeenLastCalledWith('/quran/read/343');
    localStorage.removeItem('quran-reader-spread');
  });

  it('leaves arrow keys with a modifier to the browser', () => {
    media(false);
    render(<ReaderView page={3} pages={one(3, opening)} names={names} />);
    for (const modifier of ['ctrlKey', 'metaKey', 'altKey', 'shiftKey']) fireEvent.keyDown(window, { key: 'ArrowLeft', [modifier]: true });
    expect(push).not.toHaveBeenCalled();
  });

  it('restores two pages when chosen before, and stops at both ends of the mushaf', () => {
    media(false);
    localStorage.setItem('quran-reader-spread', 'two');
    const { rerender, container } = render(<ReaderView page={2} pages={[...one(1, opening), ...one(2, opening)]} names={names} />);
    expect(container.querySelectorAll('section[data-side]')).toHaveLength(2);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByRole('button', { name: 'الصفحة السابقة' }).hasAttribute('disabled')).toBe(true);
    rerender(<ReaderView page={603} pages={[...one(603, opening), ...one(604, opening)]} names={names} />);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByRole('button', { name: 'الصفحة التالية' }).hasAttribute('disabled')).toBe(true);
    expect(push).not.toHaveBeenCalled();
    localStorage.removeItem('quran-reader-spread');
  });

  it('keeps D from changing the saved choice on a phone', () => {
    media(true, true);
    render(<ReaderView page={3} pages={one(3, opening)} names={names} />);
    fireEvent.keyDown(window, { key: 'd' });
    expect(localStorage.getItem('quran-reader-spread')).toBeNull();
  });

  it('hides and shows the tools, remembering the choice', () => {
    render(<ReaderView page={3} pages={one(3, opening)} names={names} />);
    fireEvent.click(screen.getByRole('button', { name: 'إخفاء الأدوات' }));
    expect(screen.queryByRole('button', { name: 'الصفحة التالية' })).toBeNull();
    expect(localStorage.getItem('quran-reader-bar')).toBe('hidden');
    fireEvent.click(screen.getByRole('button', { name: 'إظهار الأدوات' }));
    expect(screen.getByRole('button', { name: 'الصفحة التالية' })).not.toBeNull();
    localStorage.removeItem('quran-reader-bar');
  });

  it('labels the controls in English when English is chosen, keeping the mushaf right to left', () => {
    localStorage.setItem('language', 'en');
    const { container } = render(<ReaderView page={3} pages={one(3, opening)} names={names} />);
    localStorage.removeItem('language');
    expect(screen.getByRole('button', { name: 'Next page' })).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Index of surahs' })).not.toBeNull();
    expect(container.querySelector('article')?.getAttribute('dir')).toBe('rtl');
  });

  it('reveals the surah index and search in the phone top bar and turns pages by swipe', () => {
    media(false, true);
    const top = document.createElement('div');
    const surahs = [{ number: 2, name: names[2], nameTransliterated: 'Al-Baqarah', numberOfAyat: 286, page: 2 }];
    const { container } = render(<NavSlotElement.Provider value={top}>
      <ReaderView page={3} pages={one(3, opening)} names={names} surahs={surahs} />
    </NavSlotElement.Provider>);
    const reader = container.querySelector('[data-reader-immersive]')!;
    const stage = screen.getByRole('article');
    expect(reader.getAttribute('data-reader-immersive')).toBe('true');
    expect(top.childElementCount).toBe(0);
    fireEvent.click(stage);
    expect(reader.getAttribute('data-reader-immersive')).toBe('false');
    const index = within(top).getByRole('button', { name: 'فهرس السور' });
    const dropdown = top.querySelector('[popover="auto"]')!;
    expect(index.getAttribute('popovertarget')).toBe(dropdown.id);
    expect(dropdown.querySelector('a')?.getAttribute('href')).toBe('/quran/read/2');
    const search = within(top).getByRole('button', { name: 'ابحث عن سورة أو آية' });
    const panel = within(top).getByRole('searchbox').closest('[popover]')!;
    expect(search.getAttribute('popovertarget')).toBe(panel.id);
    fireEvent.change(within(panel as HTMLElement).getByRole('searchbox'), { target: { value: '2:255' } });
    expect(within(panel as HTMLElement).getByRole('link', { name: /افتح/ }).getAttribute('href')).toBe('/quran/read/ayah/2/255');
    expect(push).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'الصفحة التالية' })).toBeNull();
    fireEvent.click(stage);
    expect(top.childElementCount).toBe(0);
    fireEvent.touchStart(stage, { touches: [{ clientX: 30, clientY: 100 }] });
    fireEvent.touchMove(stage, { touches: [{ clientX: 120, clientY: 100 }] });
    fireEvent.touchCancel(stage);
    expect(push).not.toHaveBeenCalled();
    fireEvent.touchStart(stage, { touches: [{ clientX: 30, clientY: 100 }] });
    fireEvent.touchMove(stage, { touches: [{ clientX: 120, clientY: 100 }] });
    fireEvent.touchEnd(stage);
    fireEvent.click(stage);
    expect(push).toHaveBeenLastCalledWith('/quran/read/4');
    expect(top.childElementCount).toBe(0);
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

  it('lists the ayat whose words a search names, with the match marked', async () => {
    searchQuran.mockResolvedValue({ total: 2, hits: [{ key: '2:255', page: 42, words: ['ٱللَّهُ', 'لَآ', 'إِلَـٰهَ', 'إِلَّا', 'هُوَ', 'ٱلْحَىُّ', 'ٱلْقَيُّومُ'], from: 5, to: 6 }, { key: '3:2', page: 50, words: ['ٱلْحَىُّ', 'ٱلْقَيُّومُ'], from: 0, to: 1 }] });
    render(<SurahIndex surahs={surahs} />);
    fireEvent.change(screen.getByLabelText('ابحث عن سورة أو آية'), { target: { value: 'الحي القيوم' } });
    const results = await screen.findByRole('region', { name: 'آيات' });
    expect(searchQuran).toHaveBeenCalledTimes(1);
    expect(searchQuran).toHaveBeenCalledWith('الحي القيوم');
    expect([...results.querySelectorAll('a')].map(a => a.getAttribute('href'))).toEqual(['/quran/read/ayah/2/255', '/quran/read/ayah/3/2']);
    expect([...results.querySelectorAll('mark')].map(mark => mark.textContent)).toEqual(['ٱلْحَىُّ', 'ٱلْقَيُّومُ', 'ٱلْحَىُّ', 'ٱلْقَيُّومُ']);
    expect(results.textContent).toContain('البقرة ٢٥٥');
    expect(screen.queryByText('لا توجد سورة بهذا الاسم أو الرقم.')).toBeNull();
  });

  it('says when no ayah matches, and when the search fails', async () => {
    searchQuran.mockResolvedValue({ total: 0, hits: [] });
    render(<SurahIndex surahs={surahs} />);
    const search = screen.getByLabelText('ابحث عن سورة أو آية');
    fireEvent.change(search, { target: { value: 'كلمة غائبة' } });
    expect(screen.getByRole('status')).not.toBeNull();
    expect(await screen.findByText('لا توجد سورة ولا آية بهذا النص.')).not.toBeNull();
    searchQuran.mockRejectedValue(new Error('offline'));
    fireEvent.change(search, { target: { value: 'كلمة أخرى' } });
    expect(await screen.findByText('تعذّر البحث في الآيات الآن.')).not.toBeNull();
  });

  it('does not search ayat for a reference or a single letter', async () => {
    render(<SurahIndex surahs={surahs} />);
    const search = screen.getByLabelText('ابحث عن سورة أو آية');
    fireEvent.change(search, { target: { value: '2:255' } });
    fireEvent.change(search, { target: { value: 'ق' } });
    await new Promise(resolve => setTimeout(resolve, 300));
    expect(searchQuran).not.toHaveBeenCalled();
  });
});
