// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import HadithModeToggle from './HadithModeToggle';

const languageMock = { language: 'ar' as const };

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => languageMock,
}));

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <div data-testid="icon" />,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  (languageMock as { language: 'ar' | 'en' }).language = 'ar';
});

describe('HadithModeToggle', () => {
  it('renders two buttons with the correct labels in Arabic', () => {
    const onChange = vi.fn();
    render(<HadithModeToggle mode="bubbles" onChange={onChange} />);

    expect(screen.getByRole('button', { name: /النص كاملاً/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /الإسناد والفقاعات/ })).toBeTruthy();
  });

  it('marks the active mode as pressed in bubbles mode', () => {
    const onChange = vi.fn();
    render(<HadithModeToggle mode="bubbles" onChange={onChange} />);

    const bubblesButton = screen.getByRole('button', { name: /الإسناد والفقاعات/ });
    const textButton = screen.getByRole('button', { name: /النص كاملاً/ });

    expect(bubblesButton.className).toContain('bg-amber-400');
    expect(textButton.className).not.toContain('bg-amber-400');
  });

  it('marks the active mode as pressed in text mode', () => {
    const onChange = vi.fn();
    render(<HadithModeToggle mode="text" onChange={onChange} />);

    const textButton = screen.getByRole('button', { name: /النص كاملاً/ });
    const bubblesButton = screen.getByRole('button', { name: /الإسناد والفقاعات/ });

    expect(textButton.className).toContain('bg-amber-400');
    expect(bubblesButton.className).not.toContain('bg-amber-400');
  });

  it('calls onChange with the selected mode when clicking text button', () => {
    const onChange = vi.fn();
    render(<HadithModeToggle mode="bubbles" onChange={onChange} />);

    const textButton = screen.getByRole('button', { name: /النص كاملاً/ });
    fireEvent.click(textButton);

    expect(onChange).toHaveBeenCalledWith('text');
  });

  it('calls onChange with the selected mode when clicking bubbles button', () => {
    const onChange = vi.fn();
    render(<HadithModeToggle mode="text" onChange={onChange} />);

    const bubblesButton = screen.getByRole('button', { name: /الإسناد والفقاعات/ });
    fireEvent.click(bubblesButton);

    expect(onChange).toHaveBeenCalledWith('bubbles');
  });

  it('renders with English labels when language is English', () => {
    (languageMock as { language: 'ar' | 'en' }).language = 'en';
    const onChange = vi.fn();
    render(<HadithModeToggle mode="bubbles" onChange={onChange} />);

    expect(screen.getByRole('button', { name: /Full text/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Isnad and bubbles/ })).toBeTruthy();
  });

  it('does not call onChange when the current mode button is clicked again', () => {
    const onChange = vi.fn();
    render(<HadithModeToggle mode="bubbles" onChange={onChange} />);

    const bubblesButton = screen.getByRole('button', { name: /الإسناد والفقاعات/ });
    fireEvent.click(bubblesButton);

    expect(onChange).toHaveBeenCalledWith('bubbles');
  });
});
