// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import treeData from '@shared/data/quran/trees.json';
import { CONDITION_SPANS, OPENING_CARDS, conditionLines, openingCards } from '@shared/quran/openingKinds';
import OpeningsView, { type ConditionText } from './OpeningsView';

vi.mock('@/components/common/SettingsHelp', () => ({ SettingsHelp: () => null }));
vi.mock('@/components/share/ShareImage', () => ({ ShareImageButton: () => <button type="button">مشاركة</button> }));

const byKey = new Map((treeData as { ayat: { key: string; words: string[] }[] }).ayat.map(ayah => [ayah.key, ayah.words]));
const words = (key: string) => byKey.get(key) ?? [];
const cards = openingCards(words);
const names = Object.fromEntries(Array.from({ length: 114 }, (_, i) => [i + 1, `سورة ${i + 1}`]));
const conditions: ConditionText = Object.fromEntries(Object.keys(CONDITION_SPANS).map(s => [s, conditionLines(Number(s)).map(line => ({ ...line, words: words(line.key) }))]));
const shown = () => [...document.querySelectorAll('[data-card]')].map(card => card.getAttribute('data-card'));

afterEach(() => { cleanup(); window.history.replaceState(null, '', '/'); });

describe('the surah openings page', () => {
  it('shows every card until a kind is chosen, then only that kind\'s, and a second tap shows all again', () => {
    Element.prototype.scrollIntoView = vi.fn();
    render(<OpeningsView cards={cards} names={names} conditions={conditions} />);
    expect(shown()).toHaveLength(OPENING_CARDS.length);
    fireEvent.click(screen.getByRole('button', { name: 'القسم' }));
    expect(shown()).toEqual(OPENING_CARDS.filter(card => card.kind === 'oath').map(card => card.id));
    expect(window.location.search).toBe('?kind=oath');
    fireEvent.click(screen.getByRole('button', { name: 'القسم' }));
    expect(shown()).toHaveLength(OPENING_CARDS.length);
  });

  it('opens on the kind in the link', () => {
    window.history.replaceState(null, '', '/quran/openings?kind=prayer');
    render(<OpeningsView cards={cards} names={names} conditions={conditions} />);
    expect(shown()).toEqual(['wayl', 'prayer-alone']);
  });

  it('colours the words one surah alone has, and tags a guest with its kind', () => {
    render(<OpeningsView cards={cards} names={names} conditions={conditions} />);
    const card = within(document.getElementById('ha-mim')!);
    expect(card.getByText('الخبر')).toBeTruthy();
    expect(document.querySelectorAll('#ha-mim [data-own]').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('#saffat [data-own]')).toHaveLength(0);
  });

  it('opens the إذا السماء card on its conditions and their answer', () => {
    render(<OpeningsView cards={cards} names={names} conditions={conditions} />);
    const card = document.getElementById('idha-sama')!;
    expect(card.querySelectorAll('[data-role]')).toHaveLength(0);
    fireEvent.click(within(card).getByRole('button', { name: 'الشرط وجوابه' }));
    expect(card.querySelectorAll('[data-role="answer"]')).toHaveLength(2);
    expect(card.querySelectorAll('[data-role="disputed"]')).toHaveLength(1);
    expect(within(card).getByText('الجواب، قراءتنا')).toBeTruthy();
    expect(document.getElementById('hamd')!.querySelector('[aria-expanded]')).toBeNull();
  });

  it('links each surah to the mushaf and the page to the openings quiz', () => {
    render(<OpeningsView cards={cards} names={names} conditions={conditions} />);
    expect(screen.getByRole('link', { name: 'سورة 106' }).getAttribute('href')).toBe('/quran/read/ayah/106/1');
    expect(screen.getByRole('link', { name: 'اختبار أوائل السور' }).getAttribute('href')).toBe('/quizzes/openings');
  });
});
