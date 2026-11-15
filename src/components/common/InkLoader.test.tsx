import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
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

it('gives every logo part its own step in the grow animation, so none shows from the first frame', () => {
  const css = readFileSync(resolve(__dirname, 'InkLoader.module.css'), 'utf8');
  const { container } = render(<InkLoader />);
  const boughs = container.querySelectorAll('g[fill] > path').length;
  const nodes = container.querySelectorAll('circle').length;
  for (let i = 1; i <= boughs; i++) expect(css).toContain(`g[fill] > path:nth-child(${i}) { animation: logoBough${i - 1} `);
  for (let i = 1; i <= nodes; i++) expect(css).toContain(`circle:nth-of-type(${i}) { animation: logoNode${i - 1} `);
  expect(new Set([...container.querySelectorAll('circle')].map(circle => circle.parentElement)).size).toBe(1);
  for (const [name, count] of [['logoBough', boughs], ['logoNode', nodes]] as const) {
    for (let i = 0; i < count; i++) {
      const frames = css.match(new RegExp(`@keyframes ${name}${i} \\{ 0%, ([\\d.]+)% \\{ opacity: 0;.*?([\\d.]+)%, 100% \\{ opacity: 1; transform: none; \\} \\}`));
      expect(frames, `${name}${i}`).not.toBeNull();
      expect(Number(frames![2])).toBeLessThan(90);
    }
  }
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
