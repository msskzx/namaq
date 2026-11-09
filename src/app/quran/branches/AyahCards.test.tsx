// @vitest-environment jsdom
import React from 'react';
vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { SWRConfig } from 'swr';
import AyahCards from './AyahCards';
import type { AyahContext, Surrounding } from '@shared/quran/ayahContext';

const router = { push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() };
let params = new URLSearchParams();
vi.mock('next/navigation', () => ({ useRouter: () => router, useSearchParams: () => params, usePathname: () => '/quran/branches' }));
let language = 'ar';
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language }) }));
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

// The slide out to the next tree is a timing detail; these tests open it at once.
vi.mock('@/components/common/useSwipe', async importOriginal => ({ ...(await importOriginal<typeof import('@/components/common/useSwipe')>()), reducedMotion: () => true }));

beforeEach(() => {
  language = 'ar';
  params = new URLSearchParams();
  localStorage.setItem('branches-surround', '1');
  window.history.replaceState(null, '', '/quran/branches?o=x&m=cards');
  quranSurrounding.mockReset().mockResolvedValue(around);
  quranContexts.mockReset().mockImplementation(async (wanted: string[]) => [...source, ...side].filter(context => wanted.includes(context.ayah.key)));
});
afterEach(() => { cleanup(); localStorage.clear(); vi.useRealTimers(); vi.unstubAllGlobals(); router.push.mockClear(); });

const steps = { previous: '/quran/branches?o=a&m=cards', next: '/quran/branches?o=b&m=cards', position: 2, total: 3 };
const show = (keys = ['94:5', '94:6', '65:7'], passageKeys?: string[][]) => render(
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0, shouldRetryOnError: false }}>
    <AyahCards ayahKeys={keys} passageKeys={passageKeys} names={{ 94: 'الشرح', 65: 'الطلاق' }} steps={steps} />
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
  expect(within(card).getByTitle('نفس اللفظ أو الجذر').textContent).toBe('يُسْرًا');
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

it('steps between trees with the tree navigation, the chevrons and one more step past a side column', async () => {
  show();
  await screen.findByLabelText('الشرح ٥');
  expect(screen.getByRole('button', { name: 'الآية التالية' }).getAttribute('data-edge')).toBe('next');
  expect(screen.getByRole('button', { name: 'الآية السابقة' }).getAttribute('data-edge')).toBe('previous');
  key('ArrowLeft');
  expect(screen.getByRole('button', { name: 'الشجرة التالية' })).toBeTruthy();
  expect(router.push).not.toHaveBeenCalled();
  key('ArrowLeft');
  expect(router.push).toHaveBeenCalledWith(steps.next, { scroll: false });
  key('ArrowRight');
  key('ArrowRight');
  key('ArrowRight');
  expect(router.push).toHaveBeenLastCalledWith(steps.previous, { scroll: false });
  fireEvent.click(screen.getByRole('button', { name: 'الشجرة السابقة' }));
  expect(router.push).toHaveBeenCalledTimes(3);
  expect(screen.queryByText('٢ / ٣')).toBeNull();
});

it('shows only the tree ayat while the surrounding-ayat setting is off, and steps straight to the next tree', async () => {
  localStorage.setItem('branches-surround', '0');
  show();
  await screen.findByLabelText('الشرح ٥');
  expect(document.querySelectorAll('[data-col]')).toHaveLength(3);
  expect(quranSurrounding).not.toHaveBeenCalled();
  expect(column()).toEqual(['الشرح ٥', 'الشرح ٦', 'الطلاق ٧']);
  key('ArrowLeft');
  expect(router.push).toHaveBeenCalledWith(steps.next, { scroll: false });
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

it('keeps every card in its own row and column when the first tree has no previous tree', async () => {
  render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0, shouldRetryOnError: false }}>
      <AyahCards ayahKeys={['94:5', '94:6']} names={{ 94: 'الشرح' }} steps={{ next: steps.next, position: 1, total: 3 }} />
    </SWRConfig>,
  );
  await screen.findByLabelText('الشرح ٥');
  expect(screen.queryByRole('button', { name: 'الشجرة السابقة' })).toBeNull();
  expect([...document.querySelectorAll<HTMLElement>('[data-col]')].map(cell => `${cell.style.gridRow}/${cell.style.gridColumn}`)).toEqual(['1/1', '1/2', '1/3', '2/1', '2/2', '2/3']);
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

/** Columns 100px wide, column i's left edge at -100 * i in the lane (RTL), the lane 100px wide. */
const sideways = (track: HTMLElement) => {
  const lane = track.firstElementChild as HTMLElement;
  Object.defineProperty(lane, 'clientWidth', { configurable: true, value: 100 });
  document.querySelectorAll<HTMLElement>('[data-col]').forEach(cell => {
    Object.defineProperty(cell, 'offsetLeft', { configurable: true, value: -100 * Number(cell.dataset.col) });
    Object.defineProperty(cell, 'offsetWidth', { configurable: true, value: 100 });
  });
  return lane;
};
const moved = (lane: HTMLElement) => lane.style.transform.match(/translate3d\((-?[\d.]+)px/)?.[1];

it('slides the whole matrix as one layer to the next column', async () => {
  show();
  await screen.findByLabelText('الشرح ٥');
  const track = screen.getByRole('region', { name: 'مصفوفة الآيات' });
  const lane = sideways(track);
  vi.useFakeTimers();
  key('ArrowLeft');
  expect(column()).toEqual(['', 'الشرح ٧', 'الطلاق ٨']);
  expect(lane.hasAttribute('data-sliding')).toBe(true);
  expect(moved(lane)).toBe('200');
  act(() => vi.advanceTimersByTime(250));
  expect(moved(lane)).toBe('200');
  expect(lane.hasAttribute('data-sliding')).toBe(false);
  expect(track.scrollLeft).toBe(0);
  vi.useRealTimers();
});

it('keeps the current column centred when the frame changes width', async () => {
  const observers: (() => void)[] = [];
  vi.stubGlobal('ResizeObserver', class { constructor(run: () => void) { observers.push(run); } observe() {} disconnect() {} });
  show();
  await screen.findByLabelText('الشرح ٥');
  const track = screen.getByRole('region', { name: 'مصفوفة الآيات' });
  const lane = sideways(track);
  Object.defineProperty(track, 'clientWidth', { configurable: true, value: 100 });
  act(() => observers.forEach(run => run()));
  expect(moved(lane)).toBe('100');
  Object.defineProperty(lane, 'clientWidth', { configurable: true, value: 300 });
  Object.defineProperty(track, 'clientWidth', { configurable: true, value: 300 });
  act(() => observers.forEach(run => run()));
  expect(moved(lane)).toBe('200');
  expect(lane.hasAttribute('data-sliding')).toBe(false);
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
  const lane = sideways(track);
  vi.useFakeTimers();
  fireEvent.touchStart(track, { touches: [{ clientX: 0, clientY: 0 }] });
  expect(fireEvent.touchMove(track, { touches: [{ clientX: 2, clientY: 1 }] })).toBe(true);
  expect(fireEvent.touchMove(track, { touches: [{ clientX: 20, clientY: 40 }] })).toBe(true);
  fireEvent.touchMove(track, { touches: [{ clientX: 90, clientY: 50 }] });
  fireEvent.touchEnd(track, { touches: [] });
  expect(moved(lane)).toBeUndefined();
  expect(column()).toEqual(['الشرح ٥', 'الشرح ٦', 'الطلاق ٧']);
  fireEvent.touchStart(track, { touches: [{ clientX: 0, clientY: 0 }] });
  expect(fireEvent.touchMove(track, { touches: [{ clientX: 30, clientY: 5 }] })).toBe(false);
  expect(moved(lane)).toBe('30');
  fireEvent.touchEnd(track, { touches: [] });
  expect(column()).toEqual(['الشرح ٥', 'الشرح ٦', 'الطلاق ٧']);
  act(() => vi.advanceTimersByTime(250));
  expect(moved(lane)).toBe('0');
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

const passageSource: AyahContext[] = [
  { before: null, after: null, ayah: ayah('2:1', ['الم']) },
  { before: null, after: null, ayah: ayah('2:2', ['ذلك', 'الكتاب']), match: { exact: [], rooted: [1] } },
  { before: null, after: null, ayah: ayah('2:3', ['الذين', 'يؤمنون']) },
  { before: null, after: null, ayah: ayah('3:1', ['الم']) },
  { before: null, after: null, ayah: ayah('3:2', ['الله', 'الحي']) },
];

it.each(['ar', 'en'])('shows the complete tree passage by default in %s, keeping verse boundaries and continuation marks', async lang => {
  language = lang;
  const ar = lang === 'ar';
  localStorage.setItem('branches-surround', '0');
  quranContexts.mockImplementation(async (wanted: string[]) => passageSource.filter(item => wanted.includes(item.ayah.key)));
  show(['2:1', '3:1'], [['2:1', '2:2', '2:3'], ['3:1', '3:2']]);
  const first = await screen.findByLabelText(ar ? 'سورة ٢ ١–٣' : 'Surah 2 1–3');
  expect(first.textContent).toContain('الم');
  expect(first.textContent).toContain('ذلك الكتاب');
  expect(first.textContent).toContain('الذين يؤمنون');
  const seals = [...first.querySelectorAll('span[class*="verseSeal"]')];
  expect(seals).toHaveLength(3);
  expect(new Set(seals.map(seal => seal.closest('p'))).size).toBe(1);
  expect(within(first).getByTitle(ar ? 'نفس اللفظ أو الجذر' : 'Same lemma or root').textContent).toBe('الكتاب');
  expect(within(first).getByRole('link', { name: ar ? 'قراءة الآية' : 'Read ayah' }).getAttribute('href')).toBe('/quran/read/1?a=2:1');
  expect(screen.getByLabelText(ar ? 'سورة ٣ ١–٢' : 'Surah 3 1–2').textContent).toContain('الله الحي');
  expect(quranContexts.mock.calls.map(([wanted]) => wanted)).toEqual([['2:1', '3:1'], ['2:2', '3:2'], ['2:3']]);
  expect(quranSurrounding).not.toHaveBeenCalled();
});

it('shows surrounding ayat outside the whole passage and moves the passage as one column', async () => {
  quranContexts.mockImplementation(async (wanted: string[]) => passageSource.filter(item => wanted.includes(item.ayah.key)));
  quranSurrounding.mockResolvedValue({
    before: { '2:1': null, '3:1': ayah('2:286', ['قبل']) },
    after: { '2:3': ayah('2:4', ['بعد']), '3:2': null },
  });
  show(['2:1', '3:1'], [['2:1', '2:2', '2:3'], ['3:1', '3:2']]);
  await screen.findByLabelText('سورة ٢ ١–٣');
  expect(quranSurrounding).toHaveBeenCalledWith(['2:1', '3:1'], ['2:3', '3:2']);
  key('ArrowLeft');
  expect(column()).toEqual(['سورة ٢ ٤', '']);
  key('ArrowRight');
  expect(column()).toEqual(['سورة ٢ ١–٣', 'سورة ٣ ١–٢']);
  key('ArrowRight');
  expect(column()).toEqual(['', 'سورة ٢ ٢٨٦']);
});

it('offers retry when a continuation is missing and restores the complete passage', async () => {
  localStorage.setItem('branches-surround', '0');
  quranContexts.mockImplementation(async (wanted: string[]) => passageSource.filter(item => item.ayah.key !== '2:2' && wanted.includes(item.ayah.key)));
  show(['2:1', '3:1'], [['2:1', '2:2'], ['3:1', '3:2']]);
  await screen.findByRole('alert');
  expect(screen.queryByRole('region', { name: 'مصفوفة الآيات' })).toBeNull();
  quranContexts.mockImplementation(async (wanted: string[]) => passageSource.filter(item => wanted.includes(item.ayah.key)));
  fireEvent.click(screen.getByRole('button', { name: 'إعادة المحاولة' }));
  expect((await screen.findByLabelText('سورة ٢ ١–٢')).textContent).toContain('ذلك الكتاب');
});

it('shows a recoverable error for an empty passage instead of crashing', async () => {
  localStorage.setItem('branches-surround', '0');
  show(['2:1'], [[]]);
  await screen.findByRole('alert');
  expect(screen.queryByRole('region', { name: 'مصفوفة الآيات' })).toBeNull();
  expect(screen.getByRole('button', { name: 'إعادة المحاولة' })).toBeTruthy();
});
