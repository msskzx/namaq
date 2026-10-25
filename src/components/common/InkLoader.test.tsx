import { afterEach, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import InkLoader from './InkLoader';

afterEach(cleanup);

it('grows a tree of two inner nodes and four leaves from the drop', () => {
  const { container } = render(<InkLoader />);
  expect(container.querySelectorAll('path[pathLength="1"]')).toHaveLength(6);
  expect(container.querySelectorAll('circle')).toHaveLength(7);
});

it('spreads a graph of six linked nodes from the drop', () => {
  const { container } = render(<InkLoader variant="graph" />);
  expect(container.querySelectorAll('path[pathLength="1"]')).toHaveLength(10);
  expect(container.querySelectorAll('circle')).toHaveLength(7);
});

it('gives each loader its own ink filter', () => {
  const { container } = render(<><InkLoader /><InkLoader /></>);
  const ids = [...container.querySelectorAll('filter')].map(filter => filter.id);
  expect(new Set(ids).size).toBe(2);
  ids.forEach(id => expect(container.querySelector(`[filter="url(#${id})"]`)).not.toBeNull());
});
