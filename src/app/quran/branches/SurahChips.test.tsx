// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import BranchTree from './BranchTree';
import PathAyat from './PathAyat';
import SurahChips from './SurahChips';
import { PathScope } from './Paths';

vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn() }) }));
vi.mock('@/lib/quran/quranText', () => ({ quranContexts: vi.fn().mockResolvedValue([]), quranSurrounding: vi.fn().mockResolvedValue({ before: {}, after: {} }) }));
afterEach(cleanup);

const names = { 15: 'الحجر', 52: 'الطور' };
const tree = { words: ['إن المتقين في جنات'], ayat: [], children: [
  { words: ['وعيون'], ayat: ['15:45'], children: [] },
  { words: ['ونعيم'], ayat: ['52:17'], children: [] },
] };
const ayat = [
  { key: '15:45', words: ['إن', 'المتقين', 'في', 'جنات', 'وعيون'] },
  { key: '52:17', words: ['إن', 'المتقين', 'في', 'جنات', 'ونعيم'] },
];
const shown = () => [...document.querySelectorAll('[data-path-ayat] > div')].map(row => row.textContent);
const lit = () => [...document.querySelectorAll('[data-node][data-lit]')].map(node => node.textContent);

describe('the surah chips under a tree', () => {
  it('names each surah once in mushaf order, and a tap lights that surah\'s ayat until tapped again', () => {
    render(<PathScope><BranchTree tree={tree} names={names} /><SurahChips ayahKeys={['52:17', '15:45']} names={names} /><PathAyat ayat={ayat} names={names} /></PathScope>);
    expect([...document.querySelectorAll('[data-surah-chips] button')].map(chip => chip.textContent)).toEqual(['الحجر', 'الطور']);
    const chip = screen.getByRole('button', { name: 'سورة الطور' });
    fireEvent.click(chip);
    expect(chip.getAttribute('aria-pressed')).toBe('true');
    expect(shown()).toEqual(['إن المتقين في جنات ونعيمالطور ١٧']);
    expect(lit().some(text => text?.includes('ونعيم'))).toBe(true);
    expect(lit().some(text => text?.includes('وعيون'))).toBe(false);
    fireEvent.click(chip);
    expect(shown()).toEqual([]);
  });

  it('only names the surahs on a matrix', () => {
    render(<PathScope><SurahChips ayahKeys={['15:45', '52:17', '52:18']} names={names} interactive={false} /></PathScope>);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect([...document.querySelectorAll('[data-surah-chips] li')].map(chip => chip.textContent)).toEqual(['الحجر', 'الطور٢']);
  });
});
