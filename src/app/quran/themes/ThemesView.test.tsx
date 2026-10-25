// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ThemesView from './ThemesView';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

afterEach(cleanup);

describe('ThemesView', () => {
  it('keeps each original passage and its reference under the attributed topic', () => {
    render(<ThemesView a={{ number: 7, name: 'الأعراف', ayat: ['أول النص', 'ثاني النص'] }} b={{ number: 11, name: 'هود', ayat: ['المقابل'] }} themes={[{ theme: 'التوحيد', a: { from: 2, to: 2 }, b: { from: 1, to: 1 } }]} />);
    expect(screen.getByRole('heading', { name: 'التوحيد' })).toBeTruthy();
    expect(screen.getByRole('article', { name: 'الأعراف ٢' }).textContent).toContain('ثاني النص');
    expect(screen.getByRole('article', { name: 'هود ١' }).textContent).toContain('المقابل');
    expect(screen.queryByText('أول النص')).toBeNull();
  });
  it('says so when the two surahs share no topic', () => {
    render(<ThemesView a={{ number: 7, name: 'الأعراف', ayat: [] }} b={{ number: 11, name: 'هود', ayat: [] }} themes={[]} />);
    expect(screen.getByText('لا مواضع متقابلة مسجلة بين هاتين السورتين.')).toBeTruthy();
  });
});
