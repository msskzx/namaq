// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { ALLAH_OATHS, OTHER_OATHS, buildOaths } from '@shared/quran/oaths';
import { OATH_BY, OATH_SECTIONS } from '@shared/quran/oathSources';
import corpus from '@shared/quran/quranText/corpus';

const pageWords = new Map(corpus.ayat.map(ayah => [ayah.key, ayah.words]));
const data = (key: string) => pageWords.get(key);
import OathsView from './OathsView';
import { metadata } from './page';

afterEach(cleanup);

const allah = buildOaths('allah', data);
const others = buildOaths('others', data);
const renderView = () => render(<OathsView allah={allah} others={others} />);
const cards = () => [...document.querySelectorAll<HTMLElement>('ol > li')];
const chips = () => within(screen.getByRole('list', { name: 'ما أُقسم به' }));

describe('OathsView', () => {
  it('starts on Allah’s oaths, every one under the section of what He swears on', () => {
    renderView();
    expect(cards()).toHaveLength(ALLAH_OATHS.length);
    expect(screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent)).toEqual(OATH_SECTIONS.map(s => s.title));
    expect(within(screen.getByRole('region', { name: 'على التوحيد' })).getAllByRole('listitem')[0].textContent).toContain('الصافات');
    expect(screen.getByRole('button', { name: 'أقسم الله' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('gives each section its reference, and marks the section we gathered as ours', () => {
    renderView();
    expect(within(screen.getByRole('region', { name: 'على الجزاء والوعد والوعيد' })).getAllByText(/ابن القيم، التبيان ص ٨/).length).toBeGreaterThan(0);
    const ours = screen.getByRole('region', { name: OATH_SECTIONS.at(-1)!.title });
    expect(within(ours).getByText('من جمعنا')).toBeTruthy();
  });

  it('switches to the oaths of others, one list, each with its speaker', () => {
    renderView();
    fireEvent.click(screen.getByRole('button', { name: 'أقسم غيره' }));
    expect(cards()).toHaveLength(OTHER_OATHS.length);
    expect(screen.queryByRole('list', { name: 'ما أُقسم به' })).toBeNull();
    expect(cards().find(card => card.textContent?.includes('إبليس'))).toBeTruthy();
  });

  it('keeps only the oaths sworn by a picked kind, hiding emptied sections, and all again from «الكل»', () => {
    renderView();
    const speech = OATH_BY.find(b => b.by === 'speech')!;
    fireEvent.click(chips().getByRole('button', { name: speech.label }));
    expect(cards()).toHaveLength(speech.oaths.length);
    expect(screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent)).toEqual(['على أن القرآن حق', 'على أن الرسول حق']);
    expect(within(chips().getByRole('button', { name: 'الكل' }).closest('div')!).getAllByText(/الإتقان ٤\/٥٥/).length).toBeGreaterThan(0);
    fireEvent.click(chips().getByRole('button', { name: 'الكل' }));
    expect(cards()).toHaveLength(ALLAH_OATHS.length);
  });

  it('clears the picked kind when the switch changes', () => {
    renderView();
    fireEvent.click(chips().getByRole('button', { name: 'بذاته' }));
    fireEvent.click(screen.getByRole('button', { name: 'أقسم غيره' }));
    fireEvent.click(screen.getByRole('button', { name: 'أقسم الله' }));
    expect(chips().getByRole('button', { name: 'الكل' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('colours the words sworn by and links each oath to the mushaf', () => {
    renderView();
    const first = cards()[0];
    expect(first.querySelectorAll('[data-sworn]')).toHaveLength(3);
    expect(within(first).getByRole('link', { name: /في المصحف/ }).getAttribute('href')).toBe('/quran/read/ayah/37/1');
    expect(within(first).getByRole('button', { name: /شارك/ })).toBeTruthy();
  });

  it('names the whole Quran in its title', () => {
    expect(metadata.title).toBe('الأقسام في القرآن');
  });
});
