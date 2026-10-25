import { afterEach, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import ExplorationCard from './ExplorationCard';

afterEach(cleanup);

it.each(['ar', 'en'] as const)('links its title as the only action in %s', language => {
  render(<ExplorationCard title="Quran" desc="Read and compare passages" url="/quran" number={2} language={language} />);
  const heading = screen.getByRole('heading', { name: 'Quran' });
  expect(within(heading).getByRole('link', { name: 'Quran' }).getAttribute('href')).toBe('/quran');
  expect(screen.getByText('Read and compare passages')).toBeTruthy();
  expect(screen.getAllByRole('link')).toHaveLength(1);
});
