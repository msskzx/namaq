import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import ThemeSwitcher from './ThemeSwitcher';

const state = vi.hoisted(() => ({ language: 'en', theme: 'system', resolvedTheme: 'dark', setTheme: vi.fn() }));
vi.mock('next-themes', () => ({ useTheme: () => state }));
vi.mock('../language/LanguageContext', () => ({ useLanguage: () => ({ language: state.language }) }));
afterEach(() => { cleanup(); state.language = 'en'; state.resolvedTheme = 'dark'; state.setTheme.mockClear(); });

describe('ThemeSwitcher', () => {
  it.each(['en', 'ar'])('offers one navbar icon for the next theme with a tooltip in %s', language => {
    state.language = language;
    const light = language === 'ar' ? 'التبديل إلى الوضع الفاتح' : 'Switch to light mode';
    const dark = language === 'ar' ? 'التبديل إلى الوضع الداكن' : 'Switch to dark mode';
    const { container, rerender } = render(<ThemeSwitcher palette="site" />);
    const button = screen.getByRole('button', { name: light });
    expect(button.getAttribute('title')).toBe(light);
    expect(container.querySelectorAll('svg')).toHaveLength(1);
    expect(container.querySelector('[data-icon="sun"]')).toBeTruthy();
    fireEvent.click(button);
    expect(state.setTheme).toHaveBeenLastCalledWith('light');
    state.resolvedTheme = 'light';
    rerender(<ThemeSwitcher palette="site" />);
    expect(screen.getByRole('button', { name: dark }).getAttribute('title')).toBe(dark);
    expect(container.querySelectorAll('svg')).toHaveLength(1);
    expect(container.querySelector('[data-icon="moon"]')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: dark }));
    expect(state.setTheme).toHaveBeenLastCalledWith('dark');
  });

  it.each(['en', 'ar'])('uses the resolved system theme and switches both ways with an accessible name in %s', language => {
    state.language = language;
    const { container, rerender } = render(<ThemeSwitcher />);
    const toggle = screen.getByRole('switch', { name: language === 'ar' ? 'الوضع الداكن' : 'Dark mode' }) as HTMLInputElement;
    expect(toggle.checked).toBe(true);
    expect(container.textContent).toBe('');
    expect(container.querySelector('[data-icon="sun"]')).toBeTruthy();
    expect(container.querySelector('[data-icon="moon"]')).toBeTruthy();
    fireEvent.click(toggle);
    expect(state.setTheme).toHaveBeenLastCalledWith('light');
    state.resolvedTheme = 'light';
    rerender(<ThemeSwitcher />);
    expect(toggle.checked).toBe(false);
    fireEvent.click(toggle);
    expect(state.setTheme).toHaveBeenLastCalledWith('dark');
  });
});
