// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import HadithModeToggle from './HadithModeToggle';

const languageMock = { language: 'ar' as const };

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => languageMock,
}));

afterEach(() => {
  cleanup();
  (languageMock as { language: 'ar' | 'en' }).language = 'ar';
});

const toggle = (name: RegExp | string = 'الإسناد والفقاعات') => screen.getByRole('switch', { name }) as HTMLInputElement;

describe('HadithModeToggle', () => {
  it('is on in bubbles mode', () => {
    render(<HadithModeToggle mode="bubbles" onChange={() => {}} />);
    expect(toggle().checked).toBe(true);
  });

  it('is off in text mode', () => {
    render(<HadithModeToggle mode="text" onChange={() => {}} />);
    expect(toggle().checked).toBe(false);
  });

  it('switches to the full text when turned off', () => {
    const onChange = vi.fn();
    render(<HadithModeToggle mode="bubbles" onChange={onChange} />);
    fireEvent.click(toggle());
    expect(onChange).toHaveBeenCalledWith('text');
  });

  it('switches to the bubbles when turned on', () => {
    const onChange = vi.fn();
    render(<HadithModeToggle mode="text" onChange={onChange} />);
    fireEvent.click(toggle());
    expect(onChange).toHaveBeenCalledWith('bubbles');
  });

  it('names both modes in English', () => {
    (languageMock as { language: 'ar' | 'en' }).language = 'en';
    render(<HadithModeToggle mode="bubbles" onChange={() => {}} />);
    expect(toggle('Isnad and bubbles')).toBeTruthy();
    expect(screen.getByText('Full text')).toBeTruthy();
  });
});
