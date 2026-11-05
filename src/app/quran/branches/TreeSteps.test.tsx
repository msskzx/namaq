// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { TreeProgress } from './TreeSteps';

let language = 'ar';
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language }) }));
afterEach(cleanup);

it.each(['ar', 'en'])('shows position and remaining trees in %s, including the last tree', lang => {
  language = lang;
  const ar = lang === 'ar';
  const { rerender } = render(<TreeProgress steps={{ position: 2, total: 8 }} />);
  const progress = screen.getByRole('progressbar', { name: ar ? 'التقدم بين الأشجار' : 'Tree progress' });
  expect(progress.getAttribute('value')).toBe('2');
  expect(progress.getAttribute('max')).toBe('8');
  expect(progress.getAttribute('aria-valuetext')).toBe(ar ? 'الشجرة ٢ من ٨، المتبقي ٦' : 'Tree 2 of 8, 6 remaining');
  expect(screen.getByText(ar ? '٢ / ٨' : '2 / 8')).toBeTruthy();
  expect(progress.parentElement?.dir).toBe(ar ? 'rtl' : 'ltr');
  rerender(<TreeProgress steps={{ position: 8, total: 8 }} />);
  expect(progress.getAttribute('value')).toBe('8');
  expect(progress.getAttribute('aria-valuetext')).toBe(ar ? 'الشجرة ٨ من ٨، المتبقي ٠' : 'Tree 8 of 8, 0 remaining');
});
