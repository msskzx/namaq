// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Spellings from './Spellings';

const language = { current: 'en' };
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: language.current }) }));
afterEach(() => { cleanup(); language.current = 'en'; });

it('names and connects each independent disclosure in both languages', () => {
  const view = render(<><Spellings list={<span>First originals</span>}>First</Spellings><Spellings list={<span>Second originals</span>}>Second</Spellings></>);
  const [first, second] = screen.getAllByRole('button', { name: 'Show original spellings' });
  expect(first.getAttribute('data-variant')).toBe('outline');
  expect(first.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  expect(first.getAttribute('aria-controls')).not.toBe(second.getAttribute('aria-controls'));
  first.focus();
  fireEvent.click(first, { detail: 0 });
  expect(document.activeElement).toBe(first);
  expect(first.getAttribute('aria-expanded')).toBe('true');
  expect(screen.getByText('First originals').parentElement?.id).toBe(first.getAttribute('aria-controls'));
  expect(screen.queryByText('Second originals')).toBeNull();
  expect(screen.getByRole('button', { name: 'Hide original spellings' }).title).toBe('Hide original spellings');
  language.current = 'ar';
  view.rerender(<><Spellings list={<span>First originals</span>}>First</Spellings><Spellings list={<span>Second originals</span>}>Second</Spellings></>);
  fireEvent.click(screen.getByRole('button', { name: 'إخفاء صيغ الكتابة الأصلية' }));
  expect(screen.queryByText('First originals')).toBeNull();
  expect(screen.getAllByRole('button', { name: 'عرض صيغ الكتابة الأصلية' })).toHaveLength(2);
});
