// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Cookies from 'js-cookie';
import BranchConnectorSetting from './BranchConnectorSetting';
import { BRANCH_CONNECTORS_COOKIE } from '@/lib/quran/branchView';

const refresh = vi.hoisted(() => vi.fn());
const language = vi.hoisted(() => ({ value: 'en' }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: language.value }) }));
afterEach(() => { cleanup(); Cookies.remove(BRANCH_CONNECTORS_COOKIE, { path: '/' }); refresh.mockClear(); language.value = 'en'; });

describe('default word connectors', () => {
  it('starts off, saves on across remounts and can save off again', () => {
    const { unmount } = render(<BranchConnectorSetting />);
    const toggle = screen.getByRole('switch', { name: 'Connection lines in the matrix' });
    expect((toggle as HTMLInputElement).checked).toBe(false);
    expect(document.getElementById(toggle.getAttribute('aria-describedby')!)?.textContent).toBe('Show lines between shared words by default when opening the matrix.');
    fireEvent.click(toggle);
    expect(Cookies.get(BRANCH_CONNECTORS_COOKIE)).toBe('on');
    expect(refresh).toHaveBeenCalledOnce();
    unmount();
    render(<BranchConnectorSetting />);
    const saved = screen.getByRole('switch', { name: 'Connection lines in the matrix' });
    expect((saved as HTMLInputElement).checked).toBe(true);
    fireEvent.click(saved);
    expect(Cookies.get(BRANCH_CONNECTORS_COOKIE)).toBe('off');
  });

  it('uses off for invalid values and labels the setting in Arabic', () => {
    Cookies.set(BRANCH_CONNECTORS_COOKIE, 'invalid');
    language.value = 'ar';
    render(<BranchConnectorSetting />);
    const toggle = screen.getByRole('switch', { name: 'خطوط الربط في المصفوفة' }) as HTMLInputElement;
    expect(toggle.checked).toBe(false);
    expect(document.getElementById(toggle.getAttribute('aria-describedby')!)?.textContent).toBe('إظهار خطوط بين الكلمات المشتركة تلقائيًا عند فتح المصفوفة.');
  });
});
