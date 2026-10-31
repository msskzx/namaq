// @vitest-environment jsdom
import React from 'react';
vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { SWRConfig } from 'swr';
import AyahCards from './AyahCards';
import type { AyahContext, Surrounding } from '@/lib/quran/ayahContext';

const router = { push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() };
let params = new URLSearchParams();
vi.mock('next/navigation', () => ({ useRouter: () => router, useSearchParams: () => params, usePathname: () => '/quran/branches' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
const { quranContexts, quranSurrounding } = vi.hoisted(() => ({ quranContexts: vi.fn(), quranSurrounding: vi.fn() }));
vi.mock('@/lib/quran/quranText', () => ({ quranContexts, quranSurrounding }));

const ayah = (key: string, words: string[]) => ({ key, page: 1, words });
const source: AyahContext[] = [
  { before: null, after: null, ayah: ayah('94:5', ['فَإِنَّ', 'مَعَ', 'ٱلْعُسْرِ', 'يُسْرًا']), match: { exact: [1, 2], rooted: [3] } },
  { before: null, after: null, ayah: ayah('94:6', ['إِنَّ', 'مَعَ', 'ٱلْعُسْرِ', 'يُسْرًۭا']), match: { exact: [1, 2], rooted: [3] } },
  { before: null, after: null, ayah: ayah('65:7', ['سَيَجْعَلُ', 'ٱللَّهُ', 'بَعْدَ', 'عُسْرٍۢ', 'يُسْرًۭا']), match: { exact: [], rooted: [3, 4] } },
];
const basmala = ['بِسْمِ', 'ٱللَّهِ', 'ٱلرَّحْمَٰنِ', 'ٱلرَّحِيمِ'];
const around: Surrounding = {
  before: { '94:5': ayah('94:4', ['وَرَفَعْنَا', 'لَكَ', 'ذِكْرَكَ']), '94:6': null, '65:7': null },
  after: { '94:5': null, '94:6': ayah('94:7', ['فَإِذَا', 'فَرَغْتَ', 'فَٱنصَبْ']), '65:7': { ...ayah('65:8', ['وَكَأَيِّن']), basmala } },
};
const side: AyahContext[] = [
  { before: null, after: null, ayah: ayah('94:7', ['فَإِذَا', 'فَرَغْتَ', 'فَٱنصَبْ']), match: { exact: [0], rooted: [] } },
  { before: null, after: null, ayah: ayah('65:8', ['وَكَأَيِّن']), match: { exact: [0], rooted: [] } },
];

beforeEach(() => {
  params = new URLSearchParams();
  window.history.replaceState(null, '', '/quran/branches?o=x&m=cards');
  quranSurrounding.mockReset().mockResolvedValue(around);
  quranContexts.mockReset().mockImplementation(async (wanted: string[]) => [...source, ...side].filter(context => wanted.includes(context.ayah.key)));
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); router.push.mockClear(); });

const steps = { previous: '/quran/branches?o=a&m=cards', next: '/quran/branches?o=b&m=cards', position: 2, total: 3 };
const show = (keys = ['94:5', '94:6', '65:7']) => render(
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0, shouldRetryOnError: false }}>
    <AyahCards ayahKeys={keys} names={{ 94: 'الشرح', 65: 'الطلاق' }} steps={steps} />
  </SWRConfig>,
);
const column = () => [...document.querySelectorAll<HTMLElement>('[data-col][data-current]')].map(cell => cell.querySelector('article')?.getAttribute('aria-label') ?? '');
const key = (name: string) => act(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: name })); });

it('stacks every tree ayah as a row, its previous and next ayah beside it, the tree column current', async () => {
  show();
  await screen.findByLabelText('الشرح ٥');
  expect(document.querySelectorAll('[data-col]')).toHaveLength(9);
  expect(screen.queryByText('دليل الألوان')).toBeNull();
  expect(column()).toEqual(['الشرح ٥', 'الشرح ٦', 'الطلاق ٧']);
  const card = screen.getByLabelText('الشرح ٥');
  expect(within(card).getAllByTitle('نفس الكلمة').map(mark => mark.textContent)).toEqual(['مَعَ', 'ٱلْعُسْرِ']);
  expect(within(card).getByTitle('نفس الجذر').textContent).toBe('يُسْرًا');
  expect(within(card).getByRole('link', { name: 'قراءة الآية' }).getAttribute('href')).toBe('/quran/read/1?a=94:5');
  expect(within(screen.getByLabelText('الشرح ٤')).queryByRole('mark')).toBeNull();
});

it('moves every row together to the next or previous ayah with the arrow keys and a click on a side card', async () => {
  show();
  await screen.findByLabelText('الشرح ٥');
  key('ArrowLeft');
  expect(column()).toEqual(['', 'الشرح ٧', 'الطلاق ٨']);
  key('ArrowLeft');
  expect(column()).toEqual(['', 'الشرح ٧', 'الطلاق ٨']);
  key('ArrowRight');
  key('ArrowRight');
  expect(column()).toEqual(['الشرح ٤', '', '']);
  fireEvent.click(screen.getByLabelText('الشرح ٥'));
  expect(column()).toEqual(['الشرح ٥', 'الشرح ٦', 'الطلاق ٧']);
  fireEvent.click(screen.getByLabelText('الشرح ٧'));
  expect(column()).toEqual(['', 'الشرح ٧', 'الطلاق ٨']);
});

it('steps between trees with the tree navigation, the edge links and one more step past a side column', async () => {
  show();
  await screen.findByLabelText('الشرح ٥');
  expect(document.querySelector('a[data-edge="next"]')!.getAttribute('href')).toBe(steps.next);
  expect(document.querySelector('a[data-edge="previous"]')!.getAttribute('href')).toBe(steps.previous);
  key('ArrowLeft');
  expect(router.push).not.toHaveBeenCalled();
  key('ArrowLeft');
  expect(router.push).toHaveBeenCalledWith(steps.next, { scroll: false });
  key('ArrowRight');
  key('ArrowRight');
  key('ArrowRight');
  expect(router.push).toHaveBeenLastCalledWith(steps.previous, { scroll: false });
  expect(screen.getByRole('link', { name: 'الشجرة السابقة' }).getAttribute('href')).toBe(steps.previous);
  expect(screen.getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')).toBe(steps.next);
  expect(screen.queryByText('٢ / ٣')).toBeNull();
});

it('opens a next ayah in the following surah under its basmala, without a seal on the basmala', async () => {
  show();
  const next = await screen.findByLabelText('الطلاق ٨');
  expect(next.textContent).toContain(basmala.join(' '));
  expect(next.textContent!.indexOf('بِسْمِ')).toBeLessThan(next.textContent!.indexOf('وَكَأَيِّن'));
  expect(next.querySelectorAll('span[class*="verseSeal"]')).toHaveLength(1);
});

it('marks what the next ayat share with each other, as in the tree column', async () => {
  show();
  const next = await screen.findByLabelText('الشرح ٧');
  await waitFor(() => expect(within(next).getByTitle('نفس الكلمة').textContent).toBe('فَإِذَا'));
  expect(within(screen.getByLabelText('الشرح ٤')).queryByTitle('نفس الكلمة')).toBeNull();
});

it('lights every row fully in view and dims only a row cut off at the edge, which a press brings into view', async () => {
  show();
  await screen.findByLabelText('الشرح ٥');
  const track = document.querySelector<HTMLElement>('[data-col]')!.parentElement!;
  Object.defineProperty(track, 'clientHeight', { configurable: true, value: 500 });
  const scrollBy = vi.fn();
  track.scrollBy = scrollBy;
  const rect = (top: number, height: number) => ({ top, bottom: top + height, left: 0, right: 0, width: 0, height, x: 0, y: top, toJSON: () => ({}) });
  track.getBoundingClientRect = () => rect(0, 500);
  document.querySelectorAll<HTMLElement>('[data-col]').forEach(cell => { cell.getBoundingClientRect = () => rect(Number(cell.dataset.row) * 220, 200); });
  fireEvent.scroll(track);
  const lit = () => [...document.querySelectorAll<HTMLElement>('[data-col="1"]')].map(cell => cell.hasAttribute('data-reading'));
  expect(lit()).toEqual([true, true, false]);
  expect(within(screen.getByLabelText('الشرح ٦')).getByRole('link', { name: 'قراءة الآية' })).toBeTruthy();
  expect(within(screen.getByLabelText('الطلاق ٧')).queryByRole('link', { name: 'قراءة الآية' })).toBeNull();
  fireEvent.click(screen.getByLabelText('الطلاق ٧'));
  expect(scrollBy).toHaveBeenCalledWith({ top: 140, behavior: 'smooth' });
});

it('keeps every card in its own row and column when the first tree has no previous tree', async () => {
  render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0, shouldRetryOnError: false }}>
      <AyahCards ayahKeys={['94:5', '94:6']} names={{ 94: 'الشرح' }} steps={{ next: steps.next, position: 1, total: 3 }} />
    </SWRConfig>,
  );
  await screen.findByLabelText('الشرح ٥');
  expect(document.querySelector('[data-edge="previous"]')).toBeNull();
  expect([...document.querySelectorAll<HTMLElement>('[data-col]')].map(cell => `${cell.style.gridRow}/${cell.style.gridColumn}`)).toEqual(['1/2', '1/3', '1/4', '2/2', '2/3', '2/4']);
});

it('lights every row when all rows fit in the frame', async () => {
  vi.stubGlobal('ResizeObserver', class { constructor(private callback: () => void) {} observe() { this.callback(); } disconnect() {} });
  show();
  await screen.findByLabelText('الشرح ٥');
  await waitFor(() => expect(document.querySelector('[data-fits]')).toBeTruthy());
  expect(document.querySelectorAll('[data-col="1"][data-reading]')).toHaveLength(3);
});

it.each([
  ['4:1', '3:200', true],
  ['9:1', '8:75', false],
] as const)('places the basmala after the previous surah before %s only when supplied', async (current, previous, hasBasmala) => {
  const own = { ayah: ayah(current, ['الحالية']), before: null, after: null };
  quranSurrounding.mockResolvedValue({ before: { [current]: { ...ayah(previous, ['السابقة']), ...(hasBasmala ? { basmala } : {}) } }, after: { [current]: null } });
  quranContexts.mockResolvedValue([own]);
  show([current]);
  const card = await screen.findByLabelText(`سورة ${previous === '3:200' ? '٣ ٢٠٠' : '٨ ٧٥'}`);
  expect(card.textContent?.includes(basmala.join(' '))).toBe(hasBasmala);
  if (hasBasmala) expect(card.textContent!.indexOf('السابقة')).toBeLessThan(card.textContent!.indexOf('بِسْمِ'));
  expect(card.querySelectorAll('span[class*="verseSeal"]')).toHaveLength(1);
});

it('keeps focus in the keyboard-scrollable matrix when the focused column changes', async () => {
  show();
  const own = await screen.findByLabelText('الشرح ٥');
  const track = screen.getByRole('region', { name: 'مصفوفة الآيات' });
  expect(track.tabIndex).toBe(0);
  within(own).getByRole('link', { name: 'قراءة الآية' }).focus();
  key('ArrowLeft');
  expect(document.activeElement).toBe(track);
  expect(screen.queryByRole('article', { name: 'الشرح ٥' })).toBeNull();
  expect(screen.getByRole('article', { name: 'الشرح ٧' })).toBeTruthy();
});

it('keeps focus in the matrix when scrolling clips the focused row', async () => {
  show();
  const own = await screen.findByLabelText('الشرح ٥');
  const track = screen.getByRole('region', { name: 'مصفوفة الآيات' });
  Object.defineProperty(track, 'clientHeight', { configurable: true, value: 500 });
  const rect = (top: number, height: number) => new DOMRect(0, top, 100, height);
  track.getBoundingClientRect = () => rect(0, 500);
  document.querySelectorAll<HTMLElement>('[data-col]').forEach(cell => { cell.getBoundingClientRect = () => rect(Number(cell.dataset.row) * 220 - 100, 200); });
  within(own).getByRole('link', { name: 'قراءة الآية' }).focus();
  fireEvent.scroll(track);
  expect(document.activeElement).toBe(track);
  expect(screen.queryByRole('article', { name: 'الشرح ٥' })).toBeNull();
  expect(screen.getByRole('article', { name: 'الشرح ٦' })).toBeTruthy();
});

it('dims every row when the visible rows are all cut by the frame edges', async () => {
  show();
  await screen.findByLabelText('الشرح ٥');
  const track = screen.getByRole('region', { name: 'مصفوفة الآيات' });
  Object.defineProperty(track, 'clientHeight', { configurable: true, value: 500 });
  track.getBoundingClientRect = () => new DOMRect(0, 0, 100, 500);
  document.querySelectorAll<HTMLElement>('[data-col]').forEach(cell => {
    cell.getBoundingClientRect = () => new DOMRect(0, Number(cell.dataset.row) * 412 - 150, 100, 400);
  });
  fireEvent.scroll(track);
  expect(document.querySelectorAll('[data-reading]')).toHaveLength(0);
  expect(within(track).queryByRole('link', { name: 'قراءة الآية' })).toBeNull();
});


const sideways = (track: HTMLElement) => {
  let left = 0;
  Object.defineProperty(track, 'scrollLeft', { configurable: true, get: () => left, set: value => { left = value; } });
  track.getBoundingClientRect = () => new DOMRect(0, 0, 100, 500);
  document.querySelectorAll<HTMLElement>('[data-col]').forEach(cell => {
    cell.getBoundingClientRect = () => new DOMRect((1 - Number(cell.dataset.col)) * 100 - left, Number(cell.dataset.row) * 100, 100, 100);
  });
};

it('slides the cards to the next column, then moves the scroll position in one jump', async () => {
  show();
  await screen.findByLabelText('الشرح ٥');
  const track = screen.getByRole('region', { name: 'مصفوفة الآيات' });
  sideways(track);
  vi.useFakeTimers();
  key('ArrowLeft');
  expect(column()).toEqual(['', 'الشرح ٧', 'الطلاق ٨']);
  expect(track.hasAttribute('data-sliding')).toBe(true);
  expect(track.style.getPropertyValue('--drag')).toBe('100px');
  act(() => vi.advanceTimersByTime(250));
  expect(track.scrollLeft).toBe(-100);
  expect(track.style.getPropertyValue('--drag')).toBe('0px');
  expect(track.hasAttribute('data-sliding')).toBe(false);
  vi.useRealTimers();
});

it('steps once per sideways wheel gesture and opens the next tree only from the last column', async () => {
  show();
  await screen.findByLabelText('الشرح ٥');
  const track = screen.getByRole('region', { name: 'مصفوفة الآيات' });
  sideways(track);
  vi.useFakeTimers();
  fireEvent.wheel(track, { deltaX: -30, deltaY: 0 });
  fireEvent.wheel(track, { deltaX: -30, deltaY: 0 });
  fireEvent.wheel(track, { deltaX: -60, deltaY: 0 });
  expect(column()).toEqual(['', 'الشرح ٧', 'الطلاق ٨']);
  expect(router.push).not.toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(300));
  fireEvent.wheel(track, { deltaX: -60, deltaY: 100 });
  expect(router.push).not.toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(300));
  fireEvent.wheel(track, { deltaX: -60, deltaY: 0 });
  expect(router.push).toHaveBeenCalledExactlyOnceWith(steps.next, { scroll: false });
  vi.useRealTimers();
});

it('locks a touch gesture to one axis: an upward swipe never moves sideways, a sideways swipe follows the finger', async () => {
  show();
  await screen.findByLabelText('الشرح ٥');
  const track = screen.getByRole('region', { name: 'مصفوفة الآيات' });
  sideways(track);
  vi.useFakeTimers();
  fireEvent.touchStart(track, { touches: [{ clientX: 0, clientY: 0 }] });
  expect(fireEvent.touchMove(track, { touches: [{ clientX: 20, clientY: 40 }] })).toBe(true);
  fireEvent.touchMove(track, { touches: [{ clientX: 90, clientY: 50 }] });
  fireEvent.touchEnd(track, { touches: [] });
  expect(track.style.getPropertyValue('--drag')).toBe('');
  expect(column()).toEqual(['الشرح ٥', 'الشرح ٦', 'الطلاق ٧']);
  fireEvent.touchStart(track, { touches: [{ clientX: 0, clientY: 0 }] });
  expect(fireEvent.touchMove(track, { touches: [{ clientX: 30, clientY: 5 }] })).toBe(false);
  expect(track.style.getPropertyValue('--drag')).toBe('30px');
  fireEvent.touchEnd(track, { touches: [] });
  expect(column()).toEqual(['الشرح ٥', 'الشرح ٦', 'الطلاق ٧']);
  act(() => vi.advanceTimersByTime(250));
  expect(track.style.getPropertyValue('--drag')).toBe('0px');
  fireEvent.touchStart(track, { touches: [{ clientX: 0, clientY: 0 }] });
  fireEvent.touchMove(track, { touches: [{ clientX: 70, clientY: 5 }] });
  fireEvent.touchEnd(track, { touches: [] });
  expect(column()).toEqual(['', 'الشرح ٧', 'الطلاق ٨']);
  act(() => vi.advanceTimersByTime(250));
  fireEvent.touchStart(track, { touches: [{ clientX: 0, clientY: 0 }] });
  fireEvent.touchMove(track, { touches: [{ clientX: 70, clientY: 5 }] });
  fireEvent.touchEnd(track, { touches: [] });
  expect(router.push).toHaveBeenCalledExactlyOnceWith(steps.next, { scroll: false });
  vi.useRealTimers();
});
