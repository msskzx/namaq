import { afterEach, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import InkLoader from './InkLoader';

afterEach(cleanup);

it('grows the logo: the nun bowl, its five boughs (the trunk reaching into the bowl, no separate foot) and ten nodes', () => {
  const { container } = render(<InkLoader />);
  expect(container.querySelectorAll('ellipse')).toHaveLength(0);
  expect(container.querySelectorAll('g[fill] > path')).toHaveLength(5);
  expect(container.querySelectorAll('circle')).toHaveLength(10);
});

it('spreads a graph of six linked nodes from the drop', () => {
  const { container } = render(<InkLoader variant="graph" />);
  expect(container.querySelectorAll('path[pathLength="1"]')).toHaveLength(10);
  expect(container.querySelectorAll('circle')).toHaveLength(7);
});

it('gives each loader its own ink filter', () => {
  const { container } = render(<><InkLoader variant="graph" /><InkLoader variant="graph" /></>);
  const ids = [...container.querySelectorAll('filter')].map(filter => filter.id);
  expect(new Set(ids).size).toBe(2);
  ids.forEach(id => expect(container.querySelector(`[filter="url(#${id})"]`)).not.toBeNull());
});
