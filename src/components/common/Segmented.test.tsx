// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Segmented from './Segmented';

afterEach(cleanup);

it('is a row of pressed buttons by default, named by `name` when the label is short', () => {
  const pick = vi.fn();
  render(<Segmented label="Language" options={[{ key: 'ar', label: 'ع', name: 'العربية', current: true, onClick: () => {} }, { key: 'en', label: 'EN', name: 'English', current: false, onClick: pick }]} />);
  expect(screen.getByRole('group', { name: 'Language' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'العربية' }).getAttribute('aria-pressed')).toBe('true');
  fireEvent.click(screen.getByRole('button', { name: 'English' }));
  expect(pick).toHaveBeenCalled();
});

it('is a tablist with `tabs`, each tab tied to its panel', () => {
  render(<Segmented tabs fill label="Book" options={[{ key: 'a', label: 'Contents', current: true, id: 'tab-a', controls: 'panel', onClick: () => {} }, { key: 'b', label: 'Search', current: false, onClick: () => {} }]} />);
  const tab = screen.getByRole('tab', { name: 'Contents' });
  expect(screen.getByRole('tablist', { name: 'Book' })).toBeTruthy();
  expect(tab.getAttribute('aria-selected')).toBe('true');
  expect(tab.id).toBe('tab-a');
  expect(tab.getAttribute('aria-controls')).toBe('panel');
  expect(screen.getByRole('tab', { name: 'Search' }).getAttribute('aria-selected')).toBe('false');
});
