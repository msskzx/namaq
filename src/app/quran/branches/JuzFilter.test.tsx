// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { branchesHref } from '@shared/quran/branches';
import JuzFilter from './JuzFilter';

const params = new URLSearchParams();
const router = { push: vi.fn(), replace: vi.fn() };
vi.mock('next/navigation', () => ({ useRouter: () => router, usePathname: () => '/quran/branches', useSearchParams: () => params }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('JuzFilter', () => {
  it('shows the applied range and clears it back to the first tree, keeping the view', () => {
    render(<JuzFilter range={{ from: 25, to: 30 }} view={{ page: 4, mode: 'cards', query: 'قال' }} />);
    expect((screen.getByRole('textbox', { name: 'من الجزء' }) as HTMLInputElement).value).toBe('٢٥');
    expect((screen.getByRole('textbox', { name: 'إلى الجزء' }) as HTMLInputElement).value).toBe('٣٠');
    fireEvent.click(screen.getByRole('button', { name: 'كل الأجزاء' }));
    expect(router.replace).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'تطبيق' }));
    expect(router.replace).toHaveBeenCalledWith(branchesHref('', undefined, { mode: 'cards', query: 'قال' }), { scroll: false });
  });

  it('starts on the whole mushaf with nothing to reset', () => {
    render(<JuzFilter range={null} view={{}} />);
    expect((screen.getByRole('textbox', { name: 'من الجزء' }) as HTMLInputElement).value).toBe('١');
    expect((screen.getByRole('textbox', { name: 'إلى الجزء' }) as HTMLInputElement).value).toBe('٣٠');
    expect(screen.queryByRole('button', { name: 'كل الأجزاء' })).toBeNull();
  });

  it('shows the whole mushaf again once the range is cleared', () => {
    const { rerender } = render(<JuzFilter range={{ from: 25, to: 30 }} view={{}} />);
    rerender(<JuzFilter range={null} view={{}} />);
    expect((screen.getByRole('textbox', { name: 'من الجزء' }) as HTMLInputElement).value).toBe('١');
  });
});
