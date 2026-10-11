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

  it('starts with the four most repeated words and draws a column for each', () => {
    renderView();
    const on = toggles().getAllByRole('button').filter(b => b.getAttribute('aria-pressed') === 'true');
    expect(on).toHaveLength(4);
    expect(cells()).toHaveLength(4 * OATHS.length);
  });

  it('puts a dot on every oath that carries the word and an arrow on the last', () => {
    renderView();
    const line = lines[0];
    expect(document.querySelectorAll(`[data-dot="${line.id}"]`)).toHaveLength(line.has.size);
    expect(document.querySelectorAll(`[data-arrow="${line.id}"]`)).toHaveLength(1);
  });

  it('adds and removes a column when a word is toggled', () => {
    renderView();
    const off = toggles().getAllByRole('button').find(b => b.getAttribute('aria-pressed') === 'false')!;
    fireEvent.click(off);
    expect(cells()).toHaveLength(5 * OATHS.length);
    fireEvent.click(off);
    expect(cells()).toHaveLength(4 * OATHS.length);
  });
});
