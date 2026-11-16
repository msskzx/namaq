// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import BranchTree from './BranchTree';
import PathAyat from './PathAyat';
import { PathScope } from './Paths';

vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn() }) }));
const text = vi.hoisted(() => ({
  '1:1': ['وسط', 'طرف', 'أول'], '1:2': ['وسط', 'طرف', 'ثان'], '1:3': ['تتمة'],
} as Record<string, string[]>));
vi.mock('@/lib/quran/quranText', () => ({
  quranContexts: vi.fn(async (keys: string[]) => keys.map(key => ({ ayah: { key, words: text[key], page: 1 } }))),
  quranSurrounding: vi.fn().mockResolvedValue({ before: {}, after: {} }),
}));
afterEach(cleanup);

const tree = { words: ['وسط'], ayat: [], children: [
  { words: ['طرف أول'], ayat: ['1:1'], children: [] },
  { words: ['طرف ثان'], ayat: ['1:2'], children: [] },
] };
// The first ayah runs on into the next one, as a tree's ayah can.
const ayat = [
  { key: '1:1', words: ['وسط', 'طرف', 'أول', '﴿١﴾', 'تتمة'] },
  { key: '1:2', words: ['وسط', 'طرف', 'ثان'] },
];
// Each card: its head, then its words. The first ayah's passage runs on into 1:3, as the tree draws it.
const passages = [['1:1', '1:3'], ['1:2']];
const shown = () => [...document.querySelectorAll('[data-path-ayat] article')].map(card => `${card.querySelector('h3')?.textContent} | ${card.querySelector('p')?.textContent?.replace(/\s+/g, ' ').trim()}`);
const card = (props: Partial<React.ComponentProps<typeof PathAyat>> = {}) => <PathAyat rows={ayat.map(ayah => ayah.key)} passages={passages} names={{ 1: 'الفاتحة' }} {...props} />;
const setup = (lit?: string[]) => render(<PathScope lit={lit}><BranchTree tree={tree} names={{ 1: 'الفاتحة' }} />{card()}</PathScope>);

describe('the ayat of tapped paths under the tree', () => {
  it('reads each tapped ayah as the matrix does, its whole passage, in tree order, and leaves when untapped', async () => {
    setup();
    expect(shown()).toEqual([]);
    fireEvent.click(screen.getByText('طرف ثان').closest('[data-node]')!);
    await waitFor(() => expect(shown()).toEqual(['الفاتحة ٢ | وسط طرف ثان ٢']));
    fireEvent.click(screen.getByText('وسط').closest('[data-node]')!);
    await waitFor(() => expect(shown()).toEqual(['الفاتحة ١–٣ | وسط طرف أول ١ تتمة ٣', 'الفاتحة ٢ | وسط طرف ثان ٢']));
    fireEvent.click(screen.getByText('وسط').closest('[data-node]')!);
    fireEvent.click(screen.getByText('طرف ثان').closest('[data-node]')!);
    expect(shown()).toEqual([]);
  });

  it('opens each ayah in the mushaf, and in compare when it has a compare card', async () => {
    render(<PathScope><BranchTree tree={tree} names={{ 1: 'الفاتحة' }} />{card({ compare: { '1:2': [{ href: '/quran/compare?a=1&b=2', label: 'الفاتحة والبقرة', labelEn: '' }] } })}</PathScope>);
    fireEvent.click(screen.getByText('وسط').closest('[data-node]')!);
    expect((await screen.findByRole('link', { name: 'افتح الفاتحة ١ في المصحف' })).getAttribute('href')).toBe('/quran/read/ayah/1/1');
    expect(screen.getByRole('link', { name: 'افتح الفاتحة ١ في المصحف' }).getAttribute('href')).toBe('/quran/read/ayah/1/1');
    expect(screen.getByRole('link', { name: 'افتح الفاتحة ٢ في المصحف' }).getAttribute('href')).toBe('/quran/read/ayah/1/2');
    expect(screen.queryByRole('link', { name: 'قارن الفاتحة ١' })).toBeNull();
    expect(screen.getByRole('link', { name: 'قارن الفاتحة ٢' }).getAttribute('href')).toBe('/quran/compare?a=1&b=2');
  });

  it('stays away for ayat a search lit', () => {
    setup(['1:1']);
    expect(shown()).toEqual([]);
  });
});
