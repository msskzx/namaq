// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render as rtlRender, screen, within } from '@testing-library/react';
import { NavSlotElement, RailSlotElement } from '@/components/common/NavBar';
import { usePageHelp } from '@/components/common/SettingsHelp';
import { LanguageProvider } from '@/components/language/LanguageContext';
import type { MushafPage } from '@shared/quran/readerPage';
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

/** A finger tap on the page: a press and release, then the wait for a possible second tap. */
const tap = (element: Element) => {
  fireEvent.pointerDown(element);
  fireEvent.pointerUp(element);
  act(() => { vi.advanceTimersByTime(300); });
};
const longPress = (element: Element) => {
  fireEvent.pointerDown(element);
  act(() => { vi.advanceTimersByTime(600); });
  fireEvent.pointerUp(element);
};

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
    fireEvent.click(next);
    expect(push).toHaveBeenLastCalledWith('/quran/read/4');
    fireEvent.click(tools.getByRole('button', { name: 'اعرض صفحتين' }));
    localStorage.removeItem('quran-reader-spread');
    expect(container.querySelectorAll('section[data-side]')).toHaveLength(2);
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

  it('reveals the surah index and search in the phone top bar and turns pages by swipe', () => {
    vi.useFakeTimers();
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
    tap(stage);
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
    tap(stage);
    expect(top.childElementCount).toBe(0);
    fireEvent.touchStart(stage, { touches: [{ clientX: 30, clientY: 100 }] });
    fireEvent.touchMove(stage, { touches: [{ clientX: 120, clientY: 100 }] });
    fireEvent.touchCancel(stage);
    expect(push).not.toHaveBeenCalled();
    fireEvent.touchStart(stage, { touches: [{ clientX: 30, clientY: 100 }] });
    fireEvent.touchMove(stage, { touches: [{ clientX: 120, clientY: 100 }] });
    fireEvent.touchEnd(stage);
    tap(stage);
    expect(push).toHaveBeenLastCalledWith('/quran/read/4');
    expect(top.childElementCount).toBe(0);
    vi.useRealTimers();
  });
});

describe('Recite mode', () => {
  const surahs = [{ number: 2, name: names[2], nameTransliterated: 'Al-Baqarah', numberOfAyat: 286, page: 2 }];
  const veiled = (container: HTMLElement) => [...container.querySelectorAll('[data-ayah][data-veiled]')].map(word => word.textContent?.trim());
  afterEach(() => { localStorage.clear(); vi.useRealTimers(); });

  it('hides the ayat from the start, reveals them by ayah and by word, steps back, and turns the page at the end', () => {
    const { container } = render(<ReaderView page={3} pages={one(3, opening)} names={names} surahs={surahs} recite={{ start: '2:1', shown: null, words: 0 }} />);
    expect(veiled(container)).toEqual(['الٓمٓ ۝', 'ذَٰلِكَ', 'ٱلۡكِتَٰبُ', 'لَا', 'رَيۡبَۛ ۝']);
    const bar = within(screen.getByRole('toolbar', { name: 'أدوات التسميع' }));
    expect(bar.getByRole('button', { name: 'ارجع خطوة' }).hasAttribute('disabled')).toBe(true);
    fireEvent.click(bar.getByRole('button', { name: 'أظهر الآية التالية' }));
    expect(veiled(container)).toEqual(['ذَٰلِكَ', 'ٱلۡكِتَٰبُ', 'لَا', 'رَيۡبَۛ ۝']);
    fireEvent.click(bar.getByRole('button', { name: 'أظهر الكلمة التالية' }));
    expect(veiled(container)).toEqual(['ٱلۡكِتَٰبُ', 'لَا', 'رَيۡبَۛ ۝']);
    fireEvent.click(bar.getByRole('button', { name: 'ارجع خطوة' }));
    expect(veiled(container)).toEqual(['ذَٰلِكَ', 'ٱلۡكِتَٰبُ', 'لَا', 'رَيۡبَۛ ۝']);
    fireEvent.click(bar.getByRole('button', { name: 'أظهر الآية التالية' }));
    expect(veiled(container)).toEqual([]);
    fireEvent.click(bar.getByRole('button', { name: 'أظهر الآية التالية' }));
    expect(push).toHaveBeenLastCalledWith('/quran/read/4?recite=2%3A1&upto=2%3A2');
    fireEvent.click(bar.getByRole('button', { name: 'إنهاء التسميع' }));
    expect(screen.queryByRole('toolbar', { name: 'أدوات التسميع' })).toBeNull();
    expect(veiled(container)).toEqual([]);
  });

  it('writes the first and last words of the next ayah in its boxes, moving on by itself, then grades it', () => {
    const page = data({ line: ['ذَٰلِكَ', 'ٱلۡكِتَٰبُ', 'لَا', 'رَيۡبَۛ', 'فِيهِۛ', 'هُدٗى', 'لِّلۡمُتَّقِينَ', 2] });
    const { container } = render(<ReaderView page={2} pages={one(2, page, 2)} names={names} surahs={surahs} recite={{ start: '2:2', shown: null, words: 0 }} />);
    fireEvent.click(screen.getByRole('button', { name: 'اكتب أول كل آية وآخرها' }));
    const boxes = () => screen.getAllByRole('button', { name: /اكتب هذه الكلمة|كلمة مكتوبة/ });
    expect(boxes()).toHaveLength(6);
    expect(container.querySelectorAll('[data-write-active]')).toHaveLength(1);
    const field = screen.getByLabelText('اكتب الكلمة');
    const write = (text: string) => fireEvent.change(field, { target: { value: text } });
    write('ذلك ');
    write('الكتاب');
    write('لا');
    write('فيه');
    write('هدي ');
    expect(screen.getByRole('button', { name: 'كلمة مكتوبة: هدي' })).toBeTruthy();
    write('للمتقون ');
    expect(veiled(container)).toEqual([]);
    const color = (word: string) => [...container.querySelectorAll('[data-ayah="2:2"]')].find(span => span.textContent?.startsWith(word))!.className;
    expect(color('ذَٰلِكَ')).toMatch(/right/);
    expect(color('ٱلۡكِتَٰبُ')).toMatch(/right/);
    expect(color('رَيۡبَۛ')).not.toMatch(/right|wrong/);
    expect(color('لِّلۡمُتَّقِينَ')).toMatch(/wrong/);
    expect(localStorage.getItem('quran-reader-write')).toBe('on');
  });

  it('goes back a box with backspace in an empty box', () => {
    const page = data({ line: ['ذَٰلِكَ', 'ٱلۡكِتَٰبُ', 2] });
    render(<ReaderView page={2} pages={one(2, page, 2)} names={names} surahs={surahs} recite={{ start: '2:2', shown: null, words: 0 }} />);
    fireEvent.click(screen.getByRole('button', { name: 'اكتب أول كل آية وآخرها' }));
    const field = screen.getByLabelText('اكتب الكلمة');
    fireEvent.change(field, { target: { value: 'ذلك ' } });
    expect(screen.getAllByRole('button', { pressed: true, name: /اكتب هذه الكلمة/ })).toHaveLength(1);
    fireEvent.keyDown(field, { key: 'Backspace' });
    expect(screen.getByRole('button', { pressed: true, name: 'كلمة مكتوبة: ذلك' })).toBeTruthy();
  });

  it('starts writing from the top of the page from the quizzes card', () => {
    const page = data({ line: ['ذَٰلِكَ', 'ٱلۡكِتَٰبُ', 2] });
    render(<ReaderView page={2} pages={one(2, page, 2)} names={names} surahs={surahs} write />);
    expect(screen.getByRole('button', { name: 'أوقف الكتابة' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getAllByRole('button', { name: 'اكتب هذه الكلمة' })).toHaveLength(2);
  });

  it('starts reciting full screen on a phone, hiding the app bars and tools', () => {
    vi.useFakeTimers();
    media(false, true);
    const top = document.createElement('div');
    const { container } = render(<NavSlotElement.Provider value={top}>
      <ReaderView page={3} pages={one(3, opening)} names={names} surahs={surahs} />
    </NavSlotElement.Provider>);
    const reader = container.querySelector('[data-reader-immersive]')!;
    tap(screen.getByRole('article'));
    expect(reader.getAttribute('data-reader-immersive')).toBe('false');
    fireEvent.click(within(top).getByRole('button', { name: /^تسميع/ }));
    expect(reader.getAttribute('data-reader-immersive')).toBe('true');
    expect(screen.getByRole('toolbar', { name: 'أدوات التسميع' })).toBeTruthy();
  });

  it('hides the next surah\'s title and basmala until taps reveal them, before its first ayah', () => {
    const turn = data({ line: ['ٱلضَّآلِّينَ', 7] }, { surah: 2 }, { basmala: true }, { line: ['الٓمٓ', 1] });
    const { container } = render(<ReaderView page={1} pages={one(1, turn, 1)} names={names} surahs={surahs} recite={{ start: '1:7', shown: null, words: 0 }} />);
    const title = () => screen.getByRole('heading', { name: names[2] });
    const bar = within(screen.getByRole('toolbar', { name: 'أدوات التسميع' }));
    const next = () => fireEvent.click(bar.getByRole('button', { name: 'أظهر الآية التالية' }));
    expect(title().className).toMatch(/veiled/);
    next();
    expect(veiled(container)).toEqual(['الٓمٓ ۝']);
    expect(title().className).toMatch(/veiled/);
    const basmala = () => screen.getByText(/^بِسۡمِ|^بِسْمِ|^بسم/).className;
    expect(basmala()).toMatch(/veiled/);
    next();
    expect(title().className).not.toMatch(/veiled/);
    expect(basmala()).toMatch(/veiled/);
    expect(veiled(container)).toEqual(['الٓمٓ ۝']);
    next();
    expect(basmala()).not.toMatch(/veiled/);
    expect(veiled(container)).toEqual(['الٓمٓ ۝']);
    next();
    expect(veiled(container)).toEqual([]);
  });

  it('taps to reveal while reciting, and a long press opens the ayah buttons to mark it forgotten or save it', () => {
    vi.useFakeTimers();
    const { container } = render(<ReaderView page={3} pages={one(3, opening)} names={names} surahs={surahs} recite={{ start: '2:2', shown: null, words: 0 }} />);
    const stage = screen.getByRole('article');
    tap(stage);
    expect(veiled(container)).toEqual([]);
    longPress(container.querySelector('[data-ayah="2:2"]')!);
    const actions = within(screen.getByRole('dialog'));
    fireEvent.click(actions.getByRole('button', { name: 'نسيتها' }));
    expect(JSON.parse(localStorage.getItem('ayah-forgot')!)['2:2'].forgot).toBe(1);
    expect(container.querySelector('[data-ayah="2:2"]')?.className).toMatch(/forgot/);
    expect(container.querySelector('[data-ayah="2:1"]')?.className ?? '').not.toMatch(/forgot/);
    longPress(container.querySelector('[data-ayah="2:2"]')!);
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'احفظ الآية' }));
    expect(JSON.parse(localStorage.getItem('bookmarks')!)[0]).toMatchObject({ id: 'ayah:2:2', href: '/quran/read/ayah/2/2', text: 'ذَٰلِكَ ٱلۡكِتَٰبُ لَا رَيۡبَۛ' });
  });

  it('follows the gestures chosen in the settings for each mode', () => {
    vi.useFakeTimers();
    localStorage.setItem('reader-gestures', JSON.stringify({ read: { tap: 'forgot', double: 'none' } }));
    const { container } = render(<ReaderView page={3} pages={one(3, opening)} names={names} surahs={surahs} />);
    tap(container.querySelector('[data-ayah="2:1"]')!);
    expect(JSON.parse(localStorage.getItem('ayah-forgot')!)['2:1'].forgot).toBe(1);
  });

  it('starts reciting from the marked ayah with the recite button', () => {
    media(true);
    const rail = document.createElement('div');
    const { container } = render(<RailSlotElement.Provider value={rail}>
      <ReaderView page={3} pages={one(3, opening)} names={names} surahs={surahs} mark={{ surah: 2, ayah: 2 }} />
    </RailSlotElement.Provider>);
    fireEvent.click(within(rail).getByRole('button', { name: /^تسميع/ }));
    expect(veiled(container)).toEqual(['ذَٰلِكَ', 'ٱلۡكِتَٰبُ', 'لَا', 'رَيۡبَۛ ۝']);
  });

  it('keeps the rest of an ayah that runs onto the next page hidden there', () => {
    const runOn = data({ surah: 2 }, { line: ['الٓمٓ', 1, 'ذَٰلِكَ', 'ٱلۡكِتَٰبُ'] });
    render(<ReaderView page={3} pages={one(3, runOn)} names={names} surahs={surahs} recite={{ start: '2:1', shown: '2:2', words: 0 }} />);
    fireEvent.click(screen.getByRole('button', { name: 'أظهر الآية التالية' }));
    expect(push).toHaveBeenLastCalledWith('/quran/read/4?recite=2%3A1&upto=2%3A1');
  });

  it('leaves mouse clicks in reading mode for selecting text', () => {
    vi.useFakeTimers();
    localStorage.setItem('reader-gestures', JSON.stringify({ read: { tap: 'forgot' } }));
    const { container } = render(<ReaderView page={3} pages={one(3, opening)} names={names} surahs={surahs} />);
    const word = container.querySelector('[data-ayah="2:1"]')!;
    const mouse = (type: string) => Object.defineProperty(new MouseEvent(type, { bubbles: true }), 'pointerType', { value: 'mouse' });
    fireEvent(word, mouse('pointerdown'));
    fireEvent(word, mouse('pointerup'));
    act(() => { vi.advanceTimersByTime(300); });
    expect(localStorage.getItem('ayah-forgot')).toBeNull();
  });

  it('opens the recite position from the URL', () => {
    search = new URLSearchParams('recite=2:1&upto=2:1');
    const { container } = render(<MarkedReaderView page={3} pages={one(3, opening)} names={names} surahs={surahs} />);
    expect(veiled(container)).toEqual(['ذَٰلِكَ', 'ٱلۡكِتَٰبُ', 'لَا', 'رَيۡبَۛ ۝']);
  });
});

describe('SurahIndex', () => {
  const surahs = [
    { number: 1, name: 'سُورَةُ ٱلْفَاتِحَةِ', nameTransliterated: 'Al-Faatiha', numberOfAyat: 7, page: 1 },
    { number: 2, name: 'سُورَةُ ٱلْبَقَرَةِ', nameTransliterated: 'Al-Baqara', numberOfAyat: 286, page: 2 },
    { number: 3, name: 'سُورَةُ آلِ عِمۡرَانَ', nameTransliterated: 'Aal-i-Imraan', numberOfAyat: 200, page: 50 },
  ];
  const hrefs = (root: ParentNode) => [...root.querySelectorAll('li a')].map(a => a.getAttribute('href'));

  it('links every place into recite mode on the recite page', () => {
    render(<SurahIndex surahs={surahs} recite />);
    expect(hrefs(screen.getByRole('region', { name: 'الجزء ١' }))).toEqual(['/quran/read/1?recite=1:1', '/quran/read/2?recite=2:1']);
    expect(hrefs(screen.getByRole('region', { name: 'الجزء ٢' }))).toEqual(['/quran/read/22?recite=2:142']);
  });

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
