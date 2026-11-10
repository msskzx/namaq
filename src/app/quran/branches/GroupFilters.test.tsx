// @vitest-environment jsdom
import { useState } from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import GroupFilterControls from './GroupFilters';
import type { GroupFilters } from '@shared/quran/mutashabih/browse';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
afterEach(cleanup);

it('combines pending changes without restoring a removed difference', () => {
  const changed = vi.fn();
  function Draft() {
    const [filters, setFilters] = useState<GroupFilters>({ differences: 'order' });
    return <GroupFilterControls filters={filters} onChange={next => { setFilters(next); changed(next); }} />;
  }
  render(<Draft />);
  fireEvent.click(screen.getByRole('button', { name: 'تقديم وتأخير' }));
  fireEvent.click(screen.getByRole('button', { name: 'في كتب المتشابه' }));
  fireEvent.click(screen.getByRole('button', { name: 'الأكثر مواضع' }));
  expect(changed).toHaveBeenLastCalledWith({ cited: '1', sort: 'places' });
  expect(screen.getByRole('button', { name: 'تقديم وتأخير' }).getAttribute('aria-pressed')).toBe('false');
  expect(screen.getByRole('button', { name: 'الأكثر مواضع' }).getAttribute('aria-pressed')).toBe('true');
});
