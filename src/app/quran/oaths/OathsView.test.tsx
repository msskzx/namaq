// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { buildOaths, OATHS } from '@/lib/quran/oaths';
import data from './ayat.json';
import OathsView from './OathsView';

afterEach(cleanup);

const { oaths, lines } = buildOaths(data);
const renderView = () => render(<OathsView oaths={oaths} lines={lines} />);
const toggles = () => within(screen.getByRole('list', { name: 'الألفاظ' }));
const cells = () => document.querySelectorAll('[data-rail-cell]');

describe('OathsView', () => {
  it('lists one station per oath, in order', () => {
    renderView();
    expect(within(screen.getByRole('list', { name: 'الأقسام' })).getAllByRole('heading', { level: 2 })).toHaveLength(OATHS.length);
  });

  it('starts with every word on and draws a column for each', () => {
    renderView();
    const on = toggles().getAllByRole('button').filter(b => b.getAttribute('aria-pressed') === 'true');
    expect(on).toHaveLength(lines.length);
    expect(cells()).toHaveLength(lines.length * OATHS.length);
  });

  it('puts a dot on every oath that carries the word and an arrow on the last', () => {
    renderView();
    const line = lines[0];
    expect(document.querySelectorAll(`[data-dot="${line.id}"]`)).toHaveLength(line.has.size);
    expect(document.querySelectorAll(`[data-arrow="${line.id}"]`)).toHaveLength(1);
  });

  it('removes and restores a column when a word is toggled', () => {
    renderView();
    const first = toggles().getAllByRole('button')[0];
    fireEvent.click(first);
    expect(cells()).toHaveLength((lines.length - 1) * OATHS.length);
    fireEvent.click(first);
    expect(cells()).toHaveLength(lines.length * OATHS.length);
  });
});
