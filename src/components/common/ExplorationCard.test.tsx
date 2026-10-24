import { afterEach, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ExplorationCard from './ExplorationCard';

afterEach(cleanup);

it('links the visible title and description to its destination', () => {
  render(<ExplorationCard title="Quran" desc="Read and compare passages" url="/quran" number={2} language="en" />);
  expect(screen.getByRole('link', { name: '02 Quran Read and compare passages' }).getAttribute('href')).toBe('/quran');
  expect(screen.getByRole('heading', { name: 'Quran' })).toBeTruthy();
});
