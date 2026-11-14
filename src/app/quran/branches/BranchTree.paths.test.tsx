// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import BranchTree from './BranchTree';
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
const prefixes = [
  { word: 'بداية أولى', keys: ['1:1'], conj: '', id: 'أول' },
  { word: 'بداية ثانية', keys: ['1:2'], conj: '', id: 'ثان' },
];
const box = (text: string) => screen.getByText(text).closest('[data-node]')!;
const button = (text: string) => screen.getByRole('button', { name: `إظهار المسار: ${text}` });

describe('path toggles across tree nodes', () => {
  it('shows references at endpoints and summarizes pinned ayat at the start', () => {
    render(<BranchTree tree={tree} names={{ 1: 'الفاتحة' }} />);
    const start = box('وسط');
    const end = box('طرف أول');
    expect(start.querySelector('header')).toBeNull();
    expect(end.querySelector('[data-tab]')?.textContent).toBe('الفاتحة ١');
    fireEvent.click(button('طرف أول'));
    expect(start.querySelector('header')?.textContent).toBe('الفاتحة ١');
    fireEvent.click(button('طرف ثان'));
    expect(start.querySelector('header')?.textContent).toBe('الآيات: ٢');
    fireEvent.click(button('طرف أول'));
    fireEvent.click(button('طرف ثان'));
    expect(start.querySelector('header')).toBeNull();
  });

  it('shows a pinned reference on its prefix when the path starts before the root', () => {
    render(<BranchTree tree={tree} prefixes={prefixes} names={{ 1: 'الفاتحة' }} />);
    fireEvent.click(button('طرف أول'));
    expect(box('بداية أولى').querySelector('header')?.textContent).toBe('الفاتحة ١');
    expect(box('بداية ثانية').querySelector('header')).toBeNull();
    expect(box('وسط').querySelector('header')).toBeNull();
  });

  it.each([['بداية أولى', 'طرف أول'], ['طرف أول', 'بداية أولى']])('clears the path from %s through %s', (first, second) => {
    const { container } = render(<BranchTree tree={tree} prefixes={prefixes} names={{}} />);
    fireEvent.click(box(first));
    expect(button(first).getAttribute('aria-pressed')).toBe('true');
    expect(button(second).getAttribute('aria-pressed')).toBe('true');
    expect(box('وسط').hasAttribute('data-lit')).toBe(true);
    expect(box('طرف ثان').hasAttribute('data-lit')).toBe(false);
    fireEvent.click(button(second));
    expect(button(first).getAttribute('aria-pressed')).toBe('false');
    expect(button(second).getAttribute('aria-pressed')).toBe('false');
    expect(container.querySelectorAll('[data-lit]')).toHaveLength(0);
  });

  it('preserves the other single path when one is cleared from its leaf', () => {
    render(<BranchTree tree={tree} prefixes={prefixes} names={{}} />);
    fireEvent.click(button('بداية أولى'));
    fireEvent.click(box('بداية ثانية'));
    fireEvent.click(box('طرف أول'));
    expect(box('بداية أولى').hasAttribute('data-lit')).toBe(false);
    expect(box('طرف أول').hasAttribute('data-lit')).toBe(false);
    expect(box('طرف ثان').hasAttribute('data-lit')).toBe(true);
    expect(button('بداية ثانية').getAttribute('aria-pressed')).toBe('true');
    expect(button('وسط').getAttribute('aria-pressed')).toBe('false');
  });

  it('keeps a shared selection active when an individual path is toggled twice', () => {
    const { container } = render(<BranchTree tree={tree} prefixes={prefixes} names={{}} />);
    fireEvent.click(box('وسط'));
    fireEvent.click(box('بداية أولى'));
    fireEvent.click(button('طرف أول'));
    expect(button('وسط').getAttribute('aria-pressed')).toBe('true');
    expect(button('بداية أولى').getAttribute('aria-pressed')).toBe('false');
    expect(box('طرف أول').hasAttribute('data-lit')).toBe(true);
    expect(box('طرف ثان').hasAttribute('data-lit')).toBe(true);
    fireEvent.click(button('وسط'));
    expect(container.querySelectorAll('[data-lit]')).toHaveLength(0);
  });

  it('preserves search highlighting after clearing a manual path in the page scope', () => {
    render(<PathScope lit={['1:2']}><BranchTree tree={tree} prefixes={prefixes} names={{}} /></PathScope>);
    fireEvent.click(box('بداية أولى'));
    fireEvent.click(box('طرف أول'));
    expect(box('طرف أول').hasAttribute('data-lit')).toBe(false);
    expect(box('طرف ثان').hasAttribute('data-lit')).toBe(true);
    expect(box('وسط').hasAttribute('data-lit')).toBe(true);
    expect(button('بداية ثانية').getAttribute('aria-pressed')).toBe('false');
  });
});
