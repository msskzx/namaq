// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { branchesHref } from '@/lib/quran/branches';
import JuzFilter from './JuzFilter';

const params = new URLSearchParams();
const router = { push: vi.fn(), replace: vi.fn() };
vi.mock('next/navigation', () => ({ useRouter: () => router, usePathname: () => '/quran/branches', useSearchParams: () => params }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
afterEach(cleanup);

describe('JuzFilter', () => {
  it('shows the applied range and clears it back to the first tree, keeping the view', () => {
    render(<JuzFilter range={{ from: 25, to: 30 }} view={{ page: 4, mode: 'cards', query: 'قال' }} />);
    expect((screen.getByRole('spinbutton', { name: 'من الجزء' }) as HTMLInputElement).value).toBe('25');
    expect((screen.getByRole('spinbutton', { name: 'إلى الجزء' }) as HTMLInputElement).value).toBe('30');
    expect(screen.queryByRole('button', { name: 'تطبيق' })).toBeNull();
    expect(screen.getByRole('link', { name: 'كل الأجزاء' }).getAttribute('href')).toBe(branchesHref('', undefined, { mode: 'cards', query: 'قال' }));
  });

  it('starts on the whole mushaf with nothing to reset', () => {
    render(<JuzFilter range={null} view={{}} />);
    expect((screen.getByRole('spinbutton', { name: 'من الجزء' }) as HTMLInputElement).value).toBe('1');
    expect((screen.getByRole('spinbutton', { name: 'إلى الجزء' }) as HTMLInputElement).value).toBe('30');
    expect(screen.queryByRole('link', { name: 'كل الأجزاء' })).toBeNull();
  });

  it('shows the whole mushaf again once the range is cleared', () => {
    const { rerender } = render(<JuzFilter range={{ from: 25, to: 30 }} view={{}} />);
    rerender(<JuzFilter range={null} view={{}} />);
    expect((screen.getByRole('spinbutton', { name: 'من الجزء' }) as HTMLInputElement).value).toBe('1');
  });
});
