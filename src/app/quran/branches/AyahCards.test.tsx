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
  vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url: string) => {
    const { pathname, searchParams } = new URL(url, 'http://localhost');
    if (pathname === '/api/quran/surrounding') return { ok: true, json: async () => around };
    const wanted = searchParams.get('q')!.split(',');
    return { ok: true, json: async () => [...source, ...side].filter(context => wanted.includes(context.ayah.key)) };
  }));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); router.push.mockClear(); });

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
  await screen.findByRole('article', { name: 'الشرح ٥' });
  expect(document.querySelectorAll('[data-col]')).toHaveLength(9);
  const key = screen.getByText('دليل الألوان').closest('details')!;
  expect(key.open).toBe(false);
  expect(key.textContent).toContain('نفس الكلمة');
  expect(key.textContent).toContain('نفس الجذر');
  expect(column()).toEqual(['الشرح ٥', 'الشرح ٦', 'الطلاق ٧']);
  const card = screen.getByRole('article', { name: 'الشرح ٥' });
  expect(within(card).getAllByTitle('نفس الكلمة').map(mark => mark.textContent)).toEqual(['مَعَ', 'ٱلْعُسْرِ']);
  expect(within(card).getByTitle('نفس الجذر').textContent).toBe('يُسْرًا');
  expect(within(card).getByRole('link', { name: 'قراءة الآية' }).getAttribute('href')).toBe('/quran/read/1?a=94:5');
  expect(within(screen.getByRole('article', { name: 'الشرح ٤' })).queryByRole('mark')).toBeNull();
});

it('moves every row together to the next or previous ayah with the arrow keys and a click on a side card', async () => {
  show();
  await screen.findByRole('article', { name: 'الشرح ٥' });
  key('ArrowLeft');
  expect(column()).toEqual(['', 'الشرح ٧', 'الطلاق ٨']);
  key('ArrowLeft');
  expect(column()).toEqual(['', 'الشرح ٧', 'الطلاق ٨']);
  key('ArrowRight');
  key('ArrowRight');
  expect(column()).toEqual(['الشرح ٤', '', '']);
  fireEvent.click(screen.getByRole('article', { name: 'الشرح ٥' }));
  expect(column()).toEqual(['الشرح ٥', 'الشرح ٦', 'الطلاق ٧']);
  fireEvent.click(screen.getByRole('article', { name: 'الشرح ٧' }));
  expect(column()).toEqual(['', 'الشرح ٧', 'الطلاق ٨']);
});

it('steps between trees with the tree navigation, the edge links and one more step past a side column', async () => {
  show();
  await screen.findByRole('article', { name: 'الشرح ٥' });
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
  const next = await screen.findByRole('article', { name: 'الطلاق ٨' });
  expect(next.textContent).toContain(basmala.join(' '));
  expect(next.textContent!.indexOf('بِسْمِ')).toBeLessThan(next.textContent!.indexOf('وَكَأَيِّن'));
  expect(next.querySelectorAll('span[class*="verseSeal"]')).toHaveLength(1);
});

it('marks what the next ayat share with each other, as in the tree column', async () => {
  show();
  const next = await screen.findByRole('article', { name: 'الشرح ٧' });
  await waitFor(() => expect(within(next).getByTitle('نفس الكلمة').textContent).toBe('فَإِذَا'));
  expect(within(screen.getByRole('article', { name: 'الشرح ٤' })).queryByTitle('نفس الكلمة')).toBeNull();
});

it('reads one row at a time, the rows above and below peeking, and moves to a row on a press', async () => {
  show();
  await screen.findByRole('article', { name: 'الشرح ٥' });
  const reading = () => [...document.querySelectorAll<HTMLElement>('[data-col][data-current][data-reading]')].map(cell => cell.querySelector('article')?.getAttribute('aria-label'));
  expect(reading()).toEqual(['الشرح ٥']);
  fireEvent.click(screen.getByRole('article', { name: 'الطلاق ٧' }));
  expect(reading()).toEqual(['الطلاق ٧']);
  fireEvent.click(screen.getByRole('article', { name: 'الشرح ٧' }));
  expect(column()).toEqual(['', 'الشرح ٧', 'الطلاق ٨']);
  expect(reading()).toEqual(['الشرح ٧']);
});

it('keeps every card in its own row and column when the first tree has no previous tree', async () => {
  render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0, shouldRetryOnError: false }}>
      <AyahCards ayahKeys={['94:5', '94:6']} names={{ 94: 'الشرح' }} steps={{ next: steps.next, position: 1, total: 3 }} />
    </SWRConfig>,
  );
  await screen.findByRole('article', { name: 'الشرح ٥' });
  expect(document.querySelector('[data-edge="previous"]')).toBeNull();
  expect([...document.querySelectorAll<HTMLElement>('[data-col]')].map(cell => `${cell.style.gridRow}/${cell.style.gridColumn}`)).toEqual(['1/2', '1/3', '1/4', '2/2', '2/3', '2/4']);
});
