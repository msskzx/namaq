// @vitest-environment jsdom
import React from 'react';
vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { SWRConfig } from 'swr';
import AyahCards from './AyahCards';
import type { AyahContext } from '@/lib/quran/ayahContext';

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

beforeEach(() => {
  params = new URLSearchParams();
  window.history.replaceState(null, '', '/quran/branches?o=x&m=cards');
  vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url: string) => {
    const wanted = new URL(url, 'http://localhost').searchParams.get('q')!.split(',');
    return { ok: true, json: async () => source.filter(context => wanted.includes(context.ayah.key)) };
  }));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); router.push.mockClear(); });

const steps = { previous: '/quran/branches?o=a&m=cards&n=last', next: '/quran/branches?o=b&m=cards', position: 2, total: 3 };
const show = (keys = ['94:5', '94:6', '65:7']) => render(
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0, shouldRetryOnError: false }}>
    <AyahCards ayahKeys={keys} names={{ 94: 'الشرح', 65: 'الطلاق' }} steps={steps} />
  </SWRConfig>,
);
const card = () => screen.getByRole('article');
const step = (name: string) => screen.getByRole(screen.queryByRole('link', { name }) ? 'link' : 'button', { name });

it('shows one ayah at a time without its neighbours, with the overlay marks', async () => {
  show();
  expect((await screen.findByRole('article', { name: 'الشرح ٥' })).textContent).not.toContain('وَرَفَعْنَا');
  expect(screen.getAllByRole('article')).toHaveLength(1);
  expect(screen.getAllByTitle('في كل الآيات بلفظها').map(mark => mark.textContent)).toEqual(['مَعَ', 'ٱلْعُسْرِ']);
  expect(screen.getByTitle('في كل الآيات بجذرها أو بضبط مختلف').textContent).toBe('يُسْرًا');
  expect(screen.getByRole('link', { name: 'قراءة الآية' }).getAttribute('href')).toBe('/quran/read/1?a=94:5');
});

it('steps inside the tree with the card buttons and keeps the card in the address', async () => {
  show();
  await screen.findByRole('article', { name: 'الشرح ٥' });
  expect(step('الآية السابقة').getAttribute('href')).toBe(steps.previous);
  fireEvent.click(step('الآية التالية'));
  expect(card().getAttribute('aria-label')).toBe('الشرح ٦');
  expect(card().closest('[data-card]')!.className).toMatch(/fromLeft/);
  expect(window.location.search).toContain('n=2');
  fireEvent.click(step('الآية التالية'));
  expect(card().getAttribute('aria-label')).toBe('الطلاق ٧');
  expect(step('الآية التالية').getAttribute('href')).toBe(steps.next);
  fireEvent.click(step('الآية السابقة'));
  expect(card().getAttribute('aria-label')).toBe('الشرح ٦');
  expect(card().closest('[data-card]')!.className).toMatch(/fromRight/);
});

it('opens on the last card when arriving backwards, and swipes or arrow keys step', async () => {
  params = new URLSearchParams('n=last');
  show();
  await screen.findByRole('article', { name: 'الطلاق ٧' });
  const box = card().closest('[data-card]')!;
  fireEvent.touchStart(box, { touches: [{ clientX: 100, clientY: 100 }] });
  fireEvent.touchEnd(box, { touches: [], changedTouches: [{ clientX: -20, clientY: 110 }] });
  expect(card().getAttribute('aria-label')).toBe('الشرح ٦');
  act(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' })); });
  expect(card().getAttribute('aria-label')).toBe('الطلاق ٧');
  fireEvent.touchStart(card().closest('[data-card]')!, { touches: [{ clientX: 100, clientY: 100 }] });
  fireEvent.touchEnd(card().closest('[data-card]')!, { touches: [], changedTouches: [{ clientX: 220, clientY: 100 }] });
  expect(router.push).toHaveBeenCalledWith(steps.next, { scroll: false });
});

it('keeps focus on the step button after the card changes', async () => {
  show();
  await screen.findByRole('article', { name: 'الشرح ٥' });
  const next = step('الآية التالية');
  next.focus();
  fireEvent.click(next);
  expect(card().getAttribute('aria-label')).toBe('الشرح ٦');
  expect(document.activeElement?.getAttribute('aria-label')).toBe('الآية التالية');
});

it('stays on the last card the tree still has when the list shrinks', async () => {
  params = new URLSearchParams('n=3');
  const { rerender } = show();
  await screen.findByRole('article', { name: 'الطلاق ٧' });
  rerender(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0, shouldRetryOnError: false }}>
      <AyahCards ayahKeys={['94:5', '94:6']} names={{ 94: 'الشرح', 65: 'الطلاق' }} steps={steps} />
    </SWRConfig>,
  );
  expect(await screen.findByRole('article', { name: 'الشرح ٦' })).toBeTruthy();
});
