// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Cookies from 'js-cookie';
import BranchViewSetting from './BranchViewSetting';
import { BRANCH_VIEW_COOKIE } from '@shared/quran/branchView';

const refresh = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
const language = vi.hoisted(() => ({ value: 'en' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: language.value }) }));
afterEach(() => { cleanup(); Cookies.remove(BRANCH_VIEW_COOKIE, { path: '/' }); language.value = 'en'; refresh.mockClear(); });

describe('BranchViewSetting', () => {
  it('starts with tree, saves matrix across remounts, and can save tree again', () => {
    const { unmount } = render(<BranchViewSetting />);
    expect(screen.getByRole('button', { name: 'Tree' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Matrix' }));
    expect(Cookies.get(BRANCH_VIEW_COOKIE)).toBe('cards');
    expect(refresh).toHaveBeenCalledOnce();
    unmount();
    render(<BranchViewSetting />);
    expect(screen.getByRole('button', { name: 'Matrix' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Tree' }));
    expect(Cookies.get(BRANCH_VIEW_COOKIE)).toBe('tree');
    expect(screen.getByRole('button', { name: 'Matrix' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('uses tree for invalid saved values', () => {
    Cookies.set(BRANCH_VIEW_COOKIE, 'invalid');
    render(<BranchViewSetting />);
    expect(screen.getByRole('button', { name: 'Tree' }).getAttribute('aria-pressed')).toBe('true');
  });
});
