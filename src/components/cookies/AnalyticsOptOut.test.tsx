import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import AnalyticsOptOut from './AnalyticsOptOut';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
beforeEach(() => localStorage.clear());
afterEach(cleanup);

it('exposes the saved analytics preference and persists changes', () => {
  localStorage.setItem('cookie-consent', 'accepted');
  render(<AnalyticsOptOut />);
  const toggle = screen.getByRole('switch', { name: 'Enable Analytics' });
  expect(toggle.getAttribute('aria-checked')).toBe('true');
  fireEvent.click(toggle);
  expect(toggle.getAttribute('aria-checked')).toBe('false');
  expect(localStorage.getItem('cookie-consent')).toBe('declined');
  fireEvent.click(toggle);
  expect(localStorage.getItem('cookie-consent')).toBe('accepted');
});
