// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { SWRConfig } from 'swr';
import AyahContextButton from './AyahContext';
import type { AyahContext } from '@/lib/quran/ayahContext';

const language = { current: 'en' };
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: language.current }) }));
const source: AyahContext[] = [{
  before: { key: '94:4', page: 596, words: ['وَرَفَعْنَا', 'لَكَ', 'ذِكْرَكَ'] },
  ayah: { key: '94:5', page: 596, words: ['فَإِنَّ', 'مَعَ', 'ٱلْعُسْرِ', 'يُسْرًا'] },
  after: { key: '94:6', page: 596, words: ['إِنَّ', 'مَعَ', 'ٱلْعُسْرِ', 'يُسْرًۭا'] },
}, {
  before: { key: '94:5', page: 596, words: ['فَإِنَّ', 'مَعَ', 'ٱلْعُسْرِ', 'يُسْرًا'] },
  ayah: { key: '94:6', page: 596, words: ['إِنَّ', 'مَعَ', 'ٱلْعُسْرِ', 'يُسْرًۭا'] },
  after: { key: '94:7', page: 596, words: ['فَإِذَا', 'فَرَغْتَ', 'فَٱنصَبْ'] },
}];

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new Event('close')); };
  vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url: string) => {
    const wanted = new URL(url, 'http://localhost').searchParams.get('q')!.split(',');
    return { ok: true, json: async () => source.filter(context => wanted.includes(context.ayah.key)) };
  }));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); language.current = 'en'; });
const wrap = (children: React.ReactNode) => <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0, shouldRetryOnError: false }}>{children}</SWRConfig>;

it('loads on demand and shows each original with its neighbors, differing words and exact reader link', async () => {
  render(wrap(<AyahContextButton ayahKeys={['94:5', '94:6']} differentWords={[3]} names={{ 94: 'الشرح' }}>Shared display</AyahContextButton>));
  expect(fetch).not.toHaveBeenCalled();
  const trigger = screen.getByRole('button', { name: 'View spelling differences and context' });
  expect(trigger.getAttribute('data-variant')).toBe('highlight');
  fireEvent.click(trigger);
  const dialog = screen.getByRole('dialog', { name: 'Spelling differences and context' });
  await within(dialog).findByRole('article', { name: 'الشرح 5' });
  expect(within(dialog).getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(['/quran/read/596?a=94:5', '/quran/read/596?a=94:6']);
  expect(within(dialog).getAllByTitle('Differing marks').map(word => word.textContent)).toEqual(['يُسْرًا', 'يُسْرًۭا']);
  const current = dialog.querySelectorAll('[data-current]');
  expect(current).toHaveLength(2);
  expect(current[0].textContent).toContain('فَإِنَّ');
  expect(within(dialog).getByText(/وَرَفَعْنَا/)).toBeTruthy();
  expect(within(dialog).getByText(/فَإِذَا/)).toBeTruthy();
  fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
  expect(screen.queryByRole('dialog')).toBeNull();
  fireEvent.click(trigger);
  expect(screen.getByRole('dialog')).toBeTruthy();
});

it('uses borderless translated leaf controls alongside references and handles context labels and handles the first ayah without inventing a predecessor', async () => {
  language.current = 'ar';
  vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => [{ ayah: { key: '1:1', page: 1, words: ['بِسْمِ', 'ٱللَّهِ'] }, before: null, after: null }] } as Response);
  render(wrap(<AyahContextButton ayahKeys={['1:1']} differentWords={[]} names={{}} leaf references={<span>١:١</span>}>Opening</AyahContextButton>));
  const trigger = screen.getByRole('button', { name: /عرض الآيات في سياقها.*١:١/ });
  expect(trigger.getAttribute('data-variant')).toBe('ghost');
  expect(trigger.textContent).toContain('١:١');
  expect(trigger.querySelector('a')).toBeNull();
  expect(trigger.querySelector('svg')?.nextElementSibling?.textContent).toBe('١:١');
  fireEvent.click(trigger);
  const card = await screen.findByRole('article', { name: 'سورة ١ ١' });
  expect(card.querySelectorAll('[data-current]')).toHaveLength(1);
  expect(card.querySelectorAll('p').length).toBe(2);
  expect(screen.getByRole('button', { name: 'إغلاق' })).toBeTruthy();
});

it('reports a loading failure and lets the learner retry', async () => {
  vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response);
  render(wrap(<AyahContextButton ayahKeys={['94:5']} differentWords={[]} names={{}}>Display</AyahContextButton>));
  fireEvent.click(screen.getByRole('button', { name: 'View ayat in context' }));
  await screen.findByRole('alert');
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  await screen.findByRole('link', { name: 'Read ayah' });
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
});

it('highlights differing words in the next ayah when the leaf continues beyond an ayah marker', async () => {
  render(wrap(<AyahContextButton ayahKeys={['94:5']} differentWords={[5]} names={{}}>Continuation</AyahContextButton>));
  fireEvent.click(screen.getByRole('button', { name: 'View spelling differences and context' }));
  await screen.findAllByRole('link', { name: 'Read ayah' });
  expect(screen.getAllByTitle('Differing marks').map(word => word.textContent)).toEqual(['إِنَّ']);
});

it('shows the node\'s own ayat first, highlights only them, and puts sibling branches in their own section', async () => {
  render(wrap(<AyahContextButton ayahKeys={['94:6']} siblings={['94:5']} differentWords={[3]} names={{ 94: 'الشرح' }} leaf>Leaf</AyahContextButton>));
  fireEvent.click(screen.getByRole('button', { name: 'View spelling differences and context' }));
  const dialog = screen.getByRole('dialog');
  await within(dialog).findAllByRole('article');
  expect(new URL(vi.mocked(fetch).mock.calls[0][0] as string, 'http://localhost').searchParams.get('q')).toBe('94:6,94:5');
  expect(within(dialog).getAllByRole('article', { name: /\d/ }).map(card => card.getAttribute('aria-label'))).toEqual(['الشرح 6', 'الشرح 5']);
  const siblings = within(dialog).getByRole('region', { name: 'Sibling branches' });
  expect(within(siblings).getAllByRole('article', { name: /\d/ }).map(card => card.getAttribute('aria-label'))).toEqual(['الشرح 5']);
  expect(within(siblings).queryAllByTitle('Differing marks')).toHaveLength(0);
  expect(within(dialog).getAllByTitle('Differing marks').map(word => word.textContent)).toEqual(['يُسْرًۭا']);
});

it('locks background scrolling until the dialog closes and restores existing styles on unmount', () => {
  document.body.style.overflow = 'scroll';
  document.documentElement.style.overflow = 'auto';
  const view = render(wrap(<AyahContextButton ayahKeys={['94:5']} differentWords={[]} names={{}}>Display</AyahContextButton>));
  fireEvent.click(screen.getByRole('button', { name: 'View ayat in context' }));
  expect(document.body.style.overflow).toBe('hidden');
  expect(document.documentElement.style.overflow).toBe('hidden');
  fireEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(document.body.style.overflow).toBe('scroll');
  expect(document.documentElement.style.overflow).toBe('auto');
  fireEvent.click(screen.getByRole('button', { name: 'View ayat in context' }));
  view.unmount();
  expect(document.body.style.overflow).toBe('scroll');
  expect(document.documentElement.style.overflow).toBe('auto');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
});
