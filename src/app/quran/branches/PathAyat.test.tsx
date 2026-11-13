// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import BranchTree from './BranchTree';
import PathAyat from './PathAyat';
import { PathScope } from './Paths';

vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn() }) }));
vi.mock('@/lib/quran/quranText', () => ({ quranContexts: vi.fn().mockResolvedValue([]), quranSurrounding: vi.fn().mockResolvedValue({ before: {}, after: {} }) }));
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
const shown = () => [...document.querySelectorAll('[data-path-ayat] > div')].map(row => row.textContent);
const setup = (lit?: string[]) => render(<PathScope lit={lit}><BranchTree tree={tree} names={{ 1: 'الفاتحة' }} /><PathAyat ayat={ayat} names={{ 1: 'الفاتحة' }} /></PathScope>);

describe('the ayat of tapped paths under the tree', () => {
  it('reads each tapped ayah alone, in tree order, and leaves when untapped', () => {
    setup();
    expect(shown()).toEqual([]);
    fireEvent.click(screen.getByText('طرف ثان').closest('[data-node]')!);
    expect(shown()).toEqual(['وسط طرف ثانالفاتحة ٢']);
    fireEvent.click(screen.getByText('وسط').closest('[data-node]')!);
    expect(shown()).toEqual(['وسط طرف أولالفاتحة ١', 'وسط طرف ثانالفاتحة ٢']);
    fireEvent.click(screen.getByText('وسط').closest('[data-node]')!);
    fireEvent.click(screen.getByText('طرف ثان').closest('[data-node]')!);
    expect(shown()).toEqual([]);
  });

  it('opens each ayah in the mushaf, and in compare when it has a compare card', () => {
    render(<PathScope><BranchTree tree={tree} names={{ 1: 'الفاتحة' }} /><PathAyat ayat={ayat} names={{ 1: 'الفاتحة' }} compare={{ '1:2': [{ href: '/quran/compare?a=1&b=2', label: 'الفاتحة والبقرة', labelEn: '' }] }} /></PathScope>);
    fireEvent.click(screen.getByText('وسط').closest('[data-node]')!);
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
