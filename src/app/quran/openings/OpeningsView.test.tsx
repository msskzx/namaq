// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import treeData from '@shared/data/quran/trees.json';
import { CONDITION_SPANS, OPENING_CARDS, conditionLines, openingCards } from '@shared/quran/openingKinds';
import type { BranchAyah } from '@shared/quran/branches';
import OpeningsView, { type ConditionText } from './OpeningsView';

vi.mock('@/components/share/ShareImage', () => ({ ShareImageButton: () => <button type="button">مشاركة</button> }));

const byKey = new Map((treeData as unknown as { ayat: BranchAyah[] }).ayat.map(ayah => [ayah.key, ayah]));
const words = (key: string) => byKey.get(key)?.words ?? [];
const cards = openingCards(key => byKey.get(key));
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
    expect(shown()).toEqual(['prayer']);
  });

  it('colours shared words as the matrix does, and gives each kind its collapsed reference', () => {
    render(<OpeningsView cards={cards} names={names} conditions={conditions} />);
    expect(document.querySelectorAll('#ha-mim [data-mark]').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('#letters-alone [data-mark]')).toHaveLength(0);
    expect([...document.querySelectorAll('#ha-mim [data-part]')].map(part => part.textContent)).toEqual(['الخبر', 'الحواميم']);
    const oath = screen.getByRole('region', { name: 'القسم' });
    const reference = oath.querySelector('details')!;
    expect(reference.open).toBe(false);
    expect(reference.querySelector('summary')!.textContent).toBe('السيوطي، الإتقان ٣/٣٦٢');
    expect(reference.textContent).toMatch(/القسم في خمس عشرة سورة/);
  });

  it('names a card only where its kind holds more than one, keeping the name for the shared picture', () => {
    render(<OpeningsView cards={cards} names={names} conditions={conditions} />);
    const title = (id: string) => document.querySelector(`[data-card="${id}"] h3`)!;
    expect(title('condition').hasAttribute('hidden')).toBe(true);
    expect(title('condition').hasAttribute('data-share-only')).toBe(true);
    expect(title('nabi').hasAttribute('hidden')).toBe(false);
    expect(document.querySelector('[data-card="condition"] details')).toBeNull();
    expect(within(screen.getByRole('region', { name: 'الشرط' })).getAllByText(/تناسق الدرر/).length).toBeGreaterThan(0);
  });

  it('shares the card itself, its buttons outside the picture', () => {
    render(<OpeningsView cards={cards} names={names} conditions={conditions} />);
    const card = document.getElementById('hamd')!;
    expect(card.hasAttribute('data-share-image')).toBe(true);
    expect(card.parentElement!.hasAttribute('data-share-card')).toBe(true);
  });

  it('opens the إذا السماء card on its conditions and their answer', () => {
    render(<OpeningsView cards={cards} names={names} conditions={conditions} />);
    const card = document.getElementById('condition')!;
    expect(card.querySelectorAll('[data-role]')).toHaveLength(0);
    fireEvent.click(within(card.parentElement!).getByRole('button', { name: 'الشرط وجوابه' }));
    expect(card.querySelectorAll('[data-role="answer"]')).toHaveLength(2);
    expect(card.querySelectorAll('[data-role="disputed"]')).toHaveLength(1);
    expect(within(card).getByText('الجواب، قراءتنا')).toBeTruthy();
    expect(document.getElementById('hamd')!.parentElement!.querySelector('[aria-expanded]')).toBeNull();
  });

  it('links each surah to the mushaf and the page to the openings quiz', () => {
    render(<OpeningsView cards={cards} names={names} conditions={conditions} />);
    expect(screen.getByRole('link', { name: 'سورة 106' }).getAttribute('href')).toBe('/quran/read/ayah/106/1');
    expect(screen.getByRole('link', { name: 'اختبار أوائل السور' }).getAttribute('href')).toBe('/quizzes/openings');
  });
});
