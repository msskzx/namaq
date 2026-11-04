// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import GroupFilterControls from './GroupFilters';

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
vi.mock('@/components/common/NavigationLoader', () => ({ useNavigatingRouter: () => ({ replace }) }));
afterEach(() => { cleanup(); replace.mockClear(); });
const surahs = [{ number: 50, name: 'ق' }, { number: 70, name: 'المعارج' }];
const params = () => new URL(replace.mock.calls.at(-1)![0], 'https://namaq.test').searchParams;

describe('group funnel', () => {
  it('does not resurrect a cleared filter during a second pending change', () => {
    window.history.replaceState(null, '', '/quran/branches?differences=order&m=cards');
    render(<GroupFilterControls surahs={surahs} filters={{ differences: 'order' }} />);
    fireEvent.click(screen.getByRole('button', { name: 'تقديم وتأخير' }));
    expect(params().has('differences')).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'في كتب المتشابه' }));
    expect(params().has('differences')).toBe(false);
    expect(params().get('cited')).toBe('1');
    expect(params().get('m')).toBe('cards');
  });

  it('combines a picked surah with existing juz selections in the live URL', async () => {
    window.history.replaceState(null, '', '/quran/branches?o=group:test&m=cards&juz=29');
    render(<GroupFilterControls surahs={surahs} filters={{ juz: '29' }} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'ابحث عن سورة' }), { target: { value: 'ق' } });
    fireEvent.click(screen.getByRole('button', { name: /^ق$/ }));
    await waitFor(() => expect(replace).toHaveBeenCalled());
    expect(params().get('surahs')).toBe('50');
    expect(params().get('juz')).toBe('29');
    expect(params().get('m')).toBe('cards');
    fireEvent.change(screen.getByRole('textbox', { name: 'ابحث عن سورة' }), { target: { value: 'المعارج' } });
    fireEvent.click(screen.getByRole('button', { name: 'المعارج' }));
    expect(params().get('surahs')).toBe('50,70');
    expect(params().get('juz')).toBe('29');
    expect(screen.getByText('يكفي أن يقع الموضع في إحدى السور أو الأجزاء المختارة.')).toBeTruthy();
  });

  it('toggles book evidence live and keeps the other active filters', async () => {
    window.history.replaceState(null, '', '/quran/branches?m=cards&differences=order');
    render(<GroupFilterControls surahs={surahs} filters={{ differences: 'order' }} />);
    fireEvent.click(screen.getByRole('button', { name: 'في كتب المتشابه' }));
    await waitFor(() => expect(replace).toHaveBeenCalled());
    expect(params().get('cited')).toBe('1');
    expect(params().get('differences')).toBe('order');
    expect(screen.queryByRole('button', { name: 'عرض النتائج' })).toBeNull();
  });
});
