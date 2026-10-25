// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import PairForm from './PairForm';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
afterEach(() => {
  cleanup();
  push.mockClear();
});

const surahs = Array.from({ length: 114 }, (_, i) => ({ number: i + 1, name: `سورة ${i + 1}` }));
const a = { surah: 56, from: 1, to: 96, max: 96 };
const b = { surah: 69, from: 1, to: 52, max: 52 };

describe('PairForm', () => {
  it('goes to the new ayah range at once, keeping the tab and range', () => {
    render(<PairForm surahs={surahs} a={a} b={b} ayat keep={{ view: 'ayat', juzFrom: '25' }} />);
    fireEvent.click(screen.getByRole('button', { name: 'زيادة من آية (الأولى)' }));
    expect(push).toHaveBeenCalledWith('/quran/compare?a=56&b=69&af=2&at=96&bf=1&bt=52&view=ayat&juzFrom=25', { scroll: false });
  });

  it('drops the old ayah range of a side whose surah changes, and of a side set to all', () => {
    render(<PairForm surahs={surahs} a={a} b={b} ayat keep={{}} />);
    const combo = screen.getByRole('combobox', { name: 'السورة الثانية' });
    act(() => combo.focus());
    fireEvent.change(combo, { target: { value: '52' } });
    fireEvent.keyDown(combo, { key: 'Enter' });
    expect(push).toHaveBeenLastCalledWith('/quran/compare?a=56&b=52&af=1&at=96', { scroll: false });
    expect(document.activeElement).toBe(combo);
    fireEvent.click(screen.getByRole('button', { name: 'الكل: آيات السورة الأولى' }));
    expect(push).toHaveBeenLastCalledWith('/quran/compare?a=56&b=52&bf=1&bt=52', { scroll: false });
  });

  it('shows only the surahs for themes, and follows a new pair after back or forward', () => {
    const { rerender } = render(<PairForm surahs={surahs} a={a} b={b} ayat={false} keep={{ mode: 'themes' }} />);
    expect(screen.queryByRole('spinbutton')).toBeNull();
    expect(screen.getByText('سورة 56 · سورة 69')).toBeTruthy();
    rerender(<PairForm surahs={surahs} a={{ ...a, surah: 16 }} b={{ ...b, surah: 43 }} ayat={false} keep={{ mode: 'themes' }} />);
    expect((screen.getByRole('combobox', { name: 'السورة الأولى' }).parentElement!.querySelector('input[type=hidden]') as HTMLInputElement).value).toBe('16');
  });
});
