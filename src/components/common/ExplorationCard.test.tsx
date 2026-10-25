import { afterEach, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ExplorationCard from './ExplorationCard';

afterEach(cleanup);

it.each(['ar', 'en'] as const)('keeps its title unlinked and exposes a named action in %s', language => {
  render(<ExplorationCard title="Quran" desc="Read and compare passages" url="/quran" number={2} language={language} />);
  expect(screen.getByRole('link', { name: `${language === 'ar' ? 'افتح' : 'Open'} Quran` }).getAttribute('href')).toBe('/quran');
  const heading = screen.getByRole('heading', { name: 'Quran' });
  expect(heading.closest('a')).toBeNull();
  expect(screen.getByText('Read and compare passages')).toBeTruthy();
  expect(screen.getAllByRole('link')).toHaveLength(1);
});
