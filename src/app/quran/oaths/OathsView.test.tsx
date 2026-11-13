// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { ALLAH_OATHS, OTHER_OATHS, buildOaths } from '@shared/quran/oaths';
import data from '@shared/data/quran/oaths.json';
import OathsView from './OathsView';
import { metadata } from './page';

afterEach(cleanup);

const allah = buildOaths('allah', data);
const others = buildOaths('others', data);
const renderView = () => render(<OathsView allah={allah} others={others} />);
const cards = () => within(screen.getByRole('list', { name: 'الأقسام' })).getAllByRole('listitem');
const chips = () => within(screen.getByRole('list', { name: 'ما أُقسم به' }));

describe('OathsView', () => {
  it('starts on Allah’s oaths, every one in mushaf order', () => {
    renderView();
    expect(cards()).toHaveLength(ALLAH_OATHS.length);
    expect(cards()[0].textContent).toContain('النساء');
    expect(screen.getByRole('button', { name: 'أقسم الله' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('switches to the oaths of others, each with its speaker', () => {
    renderView();
    fireEvent.click(screen.getByRole('button', { name: 'أقسم غيره' }));
    expect(cards()).toHaveLength(OTHER_OATHS.length);
    expect(cards().find(card => card.textContent?.includes('إبليس'))).toBeTruthy();
  });

  it('keeps only the oaths of a picked word, and all of them again from «الكل»', () => {
    renderView();
    const night = allah.chips.find(c => c.word === 'الليل')!;
    fireEvent.click(chips().getByRole('button', { name: 'الليل' }));
    expect(cards()).toHaveLength(night.count);
    fireEvent.click(chips().getByRole('button', { name: 'الكل' }));
    expect(cards()).toHaveLength(ALLAH_OATHS.length);
  });

  it('clears the picked word when the switch changes, since the chips differ', () => {
    renderView();
    fireEvent.click(chips().getByRole('button', { name: 'السماء' }));
    fireEvent.click(screen.getByRole('button', { name: 'أقسم غيره' }));
    expect(cards()).toHaveLength(OTHER_OATHS.length);
    expect(chips().getByRole('button', { name: 'الكل' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('colours the words sworn by and links each oath to the mushaf', () => {
    renderView();
    const first = cards()[0];
    expect(first.querySelectorAll('[data-sworn]')).toHaveLength(1);
    expect(within(first).getByRole('link', { name: /في المصحف/ }).getAttribute('href')).toBe('/quran/read/ayah/4/65');
    expect(within(first).getByRole('button', { name: /شارك/ })).toBeTruthy();
  });

  it('names the whole Quran in its title', () => {
    expect(metadata.title).toBe('الأقسام في القرآن');
  });
});
