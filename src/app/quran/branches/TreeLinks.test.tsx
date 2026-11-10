// @vitest-environment jsdom
import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Fan, PathBox, PathButton, PathScope } from './Paths';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

let resize: (() => void)[] = [];
beforeEach(() => {
  resize = [];
  vi.stubGlobal('ResizeObserver', class {
    constructor(callback: () => void) { resize.push(callback); }
    observe() {}
    disconnect() {}
  });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const entries = ['أول', 'ثان'].map((word, i) => ({
  key: word, keys: [`1:${i + 1}`], item: <PathBox id={word} keys={[`1:${i + 1}`]} className="" tone="" lit="">
    {word}<PathButton id={word} keys={[`1:${i + 1}`]} subject={word} />
  </PathBox>,
}));

function draw({ organic = true, side = 'start', dir = 'rtl' }: { organic?: boolean; side?: 'start' | 'end'; dir?: 'rtl' | 'ltr' } = {}) {
  const result = render(<div data-tree-content dir={dir}><PathScope organic={organic}><Fan entries={entries} side={side} /></PathScope></div>);
  const fan = result.container.querySelector('[data-fan]')!;
  Object.defineProperties(fan, { clientWidth: { value: 600 }, clientHeight: { value: 200 } });
  [...fan.querySelector('ul')!.children].forEach((item, i) => Object.defineProperties(item, {
    offsetTop: { value: i * 100 }, offsetHeight: { value: 100 }, offsetLeft: { value: i * 300 }, offsetWidth: { value: 300 },
  }));
  act(() => resize.forEach(callback => callback()));
  return result;
}

describe('organic branch links', () => {
  it.each([
    ['rtl', 'start', 'M 600 100 C 588 100, 588 50, 576 50'],
    ['ltr', 'start', 'M 0 100 C 12 100, 12 50, 24 50'],
    ['rtl', 'end', 'M 0 100 C 12 100, 12 50, 24 50'],
    ['ltr', 'end', 'M 600 100 C 588 100, 588 50, 576 50'],
  ] as const)('joins the parent to each branch in %s from %s', (dir, side, first) => {
    const { container } = draw({ dir, side });
    const links = container.querySelectorAll('[data-tree-links] path');
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('d')).toBe(first);
    expect(links[1].getAttribute('d')).toContain('150');
    expect(container.querySelector('[data-tree-links]')?.getAttribute('aria-hidden')).toBe('true');
  });

  it.each(['start', 'end'] as const)('remeasures the %s fan when the tree turns downward', async side => {
    const { container } = draw({ side });
    await act(async () => { container.firstElementChild!.setAttribute('data-down', ''); });
    const links = [...container.querySelectorAll('[data-tree-links] path')];
    expect(links.map(link => link.getAttribute('d'))).toEqual(side === 'start'
      ? ['M 300 0 C 300 12, 150 12, 150 24', 'M 300 0 C 300 12, 450 12, 450 24']
      : ['M 300 200 C 300 188, 150 188, 150 176', 'M 300 200 C 300 188, 450 188, 450 176']);
  });

  it('keeps the selected node distinct from the rest of its illuminated path and toggles it off', () => {
    const { container } = draw();
    fireEvent.click(screen.getByRole('button', { name: 'إظهار المسار: أول' }));
    expect(container.querySelector('[data-node="أول"]')?.hasAttribute('data-selected')).toBe(true);
    expect([...container.querySelectorAll('[data-tree-links] path')].map(path => path.hasAttribute('data-connected'))).toEqual([true, false]);
    fireEvent.click(screen.getByRole('button', { name: 'إظهار المسار: أول' }));
    expect(container.querySelector('[data-selected], [data-lit], [data-connected]')).toBeNull();
  });

  it('measures newly added surrounding branches as well as the original entries', () => {
    const { container, rerender } = draw();
    rerender(<div data-tree-content dir="rtl"><PathScope organic><Fan entries={[...entries, { key: 'after', keys: ['1:3'], item: 'الآية التالية' }]} side="start" /></PathScope></div>);
    expect(container.querySelectorAll('[data-tree-links] path')).toHaveLength(3);
  });
});
