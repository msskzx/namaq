import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import LoadingDots from './LoadingDots';

const { state } = vi.hoisted(() => ({ state: { language: 'ar' } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => state }));
afterEach(cleanup);

it('shows three dots and tells screen readers it is loading', () => {
  const { container } = render(<LoadingDots />);
  expect(screen.getByRole('status').textContent).toBe('جارٍ التحميل');
  expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(3);
});

it('takes a more specific label', () => {
  state.language = 'en';
  render(<LoadingDots label="Loading phrases" />);
  expect(screen.getByRole('status').textContent).toBe('Loading phrases');
});
