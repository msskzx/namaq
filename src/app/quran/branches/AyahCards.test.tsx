// @vitest-environment jsdom
import React from 'react';
vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { SWRConfig } from 'swr';
import AyahCards from './AyahCards';
import type { AyahContext } from '@/lib/quran/ayahContext';

const router = { push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() };
let params = new URLSearchParams();
vi.mock('next/navigation', () => ({ useRouter: () => router, useSearchParams: () => params, usePathname: () => '/quran/branches' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

const ayah = (key: string, words: string[]) => ({ key, page: 1, words });
const source: AyahContext[] = [
  { before: ayah('94:4', ['وَرَفَعْنَا', 'لَكَ', 'ذِكْرَكَ']), after: null, ayah: ayah('94:5', ['فَإِنَّ', 'مَعَ', 'ٱلْعُسْرِ', 'يُسْرًا']), match: { exact: [1, 2], rooted: [3] } },
  { before: null, after: ayah('94:7', ['فَإِذَا', 'فَرَغْتَ', 'فَٱنصَبْ']), ayah: ayah('94:6', ['إِنَّ', 'مَعَ', 'ٱلْعُسْرِ', 'يُسْرًۭا']), match: { exact: [1, 2], rooted: [3] } },
  { before: null, after: null, ayah: ayah('65:7', ['سَيَجْعَلُ', 'ٱللَّهُ', 'بَعْدَ', 'عُسْرٍۢ', 'يُسْرًۭا']), match: { exact: [], rooted: [3, 4] } },
];

beforeEach(() => {
  params = new URLSearchParams();
  window.history.replaceState(null, '', '/quran/branches?o=x&m=cards');
  vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url: string) => {
    const wanted = new URL(url, 'http://localhost').searchParams.get('q')!.split(',');
    return { ok: true, json: async () => source.filter(context => wanted.includes(context.ayah.key)) };
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
  expect([...document.querySelectorAll('[data-head]')].map(head => head.textContent)).toEqual(['الآية السابقة', 'آيات الشجرة', 'الآية التالية']);
  expect(document.querySelectorAll('[data-col]')).toHaveLength(9);
  expect(column()).toEqual(['الشرح ٥', 'الشرح ٦', 'الطلاق ٧']);
  const card = screen.getByRole('article', { name: 'الشرح ٥' });
  expect(within(card).getAllByTitle('في كل الآيات بلفظها').map(mark => mark.textContent)).toEqual(['مَعَ', 'ٱلْعُسْرِ']);
  expect(within(card).getByTitle('في كل الآيات بجذرها أو بضبط مختلف').textContent).toBe('يُسْرًا');
  expect(within(card).getByRole('link', { name: 'قراءة الآية' }).getAttribute('href')).toBe('/quran/read/1?a=94:5');
  expect(within(screen.getByRole('article', { name: 'الشرح ٤' })).queryByRole('mark')).toBeNull();
});

it('moves every row together to the next or previous ayah with the arrow keys, headings and a click', async () => {
  show();
  await screen.findByRole('article', { name: 'الشرح ٥' });
  key('ArrowLeft');
  expect(column()).toEqual(['', 'الشرح ٧', '']);
  key('ArrowLeft');
  expect(column()).toEqual(['', 'الشرح ٧', '']);
  key('ArrowRight');
  key('ArrowRight');
  expect(column()).toEqual(['الشرح ٤', '', '']);
  fireEvent.click(screen.getByRole('button', { name: 'آيات الشجرة' }));
  expect(column()).toEqual(['الشرح ٥', 'الشرح ٦', 'الطلاق ٧']);
  fireEvent.click(screen.getByRole('article', { name: 'الشرح ٧' }));
  expect(screen.getByRole('button', { name: 'الآية التالية' }).getAttribute('aria-pressed')).toBe('true');
});

it('steps between trees with the tree navigation', async () => {
  show();
  await screen.findByRole('article', { name: 'الشرح ٥' });
  expect(screen.getByRole('link', { name: 'الشجرة السابقة' }).getAttribute('href')).toBe(steps.previous);
  expect(screen.getByRole('link', { name: 'الشجرة التالية' }).getAttribute('href')).toBe(steps.next);
});
