// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { buildOrder, THEMES, TOPICS } from '@/lib/quran/surahOrder';
import { OPENING_GROUPS } from '@/lib/quran/openings';
import data from './ayat.json';
import OrderView from './OrderView';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'ar' }),
}));

afterEach(cleanup);

const { chips, hops } = buildOrder(data);
const renderView = () => render(<OrderView chips={chips} hops={hops} />);
const strip = () => within(screen.getByRole('list', { name: 'ترتيب السور' }));
const toggles = () => within(screen.getByRole('list', { name: 'المواضيع' }));
const cells = (id?: string) => document.querySelectorAll(id ? `[data-rail-cell="${id}"]` : '[data-rail-cell]');
const carriers = (id: string) => Object.keys(TOPICS).map(Number).filter(n => TOPICS[n].topics.some(([t]) => t === id));
const rowOf = (n: number) => strip().getAllByRole('heading', { level: 2 })[n - 41].closest('li')!;

describe('OrderView', () => {
  it('names each surah once and has one link per neighbouring pair', () => {
    renderView();
    expect(strip().getAllByRole('heading', { level: 2 })).toHaveLength(74);
    expect(document.querySelectorAll('details')).toHaveLength(73);
    expect(screen.getAllByRole('heading', { name: /النازعات/ })).toHaveLength(1);
  });

  it('shows each topic of a surah once, as a badge', () => {
    renderView();
    const list = within(screen.getByRole('list', { name: /موضوعات سورة النبإ/ }));
    expect(list.getAllByRole('listitem')).toHaveLength(TOPICS[78].topics.length);
    expect(list.getByText('اختلافهم في النبأ العظيم')).toBeTruthy();
  });

  it('starts with every theme on and draws a column for each', () => {
    renderView();
    const on = toggles().getAllByRole('button').filter(b => b.getAttribute('aria-pressed') === 'true');
    expect(on).toHaveLength(Object.keys(THEMES).length);
    expect(cells()).toHaveLength(Object.keys(THEMES).length * 74);
  });

  it('removes and restores a rail column when a theme is toggled', () => {
    renderView();
    const first = toggles().getAllByRole('button')[0];
    fireEvent.click(first);
    expect(cells()).toHaveLength((Object.keys(THEMES).length - 1) * 74);
    fireEvent.click(first);
    expect(cells()).toHaveLength(Object.keys(THEMES).length * 74);
  });

  it('puts a theme dot exactly on the surahs that carry it, and the arrow on the last', { timeout: 30000 }, () => {
    renderView();
    for (const id of Object.keys(THEMES)) {
      const btn = toggles().getByRole('button', { name: new RegExp(THEMES[id]) });
      if (btn.getAttribute('aria-pressed') === 'false') fireEvent.click(btn);
      const dots = [...document.querySelectorAll(`[data-dot="${id}"]`)].map(d => Number(d.closest('li')!.querySelector('h2')!.textContent!.trim().split(' ')[0].replace(/[٠-٩]/g, c => String(c.charCodeAt(0) - 1632))));
      expect(dots).toEqual(carriers(id));
      const last = carriers(id).at(-1)!;
      expect(rowOf(last).querySelector(`[data-arrow="${id}"]`)).toBeTruthy();
      expect(document.querySelectorAll(`[data-arrow="${id}"]`)).toHaveLength(1);
    }
  });

  it('draws the line below the first dot, through the middle, and above the last dot', () => {
    renderView();
    const id = Object.keys(THEMES).find(t => carriers(t)[0] > 41 && carriers(t).length > 2)!;
    const btn = toggles().getByRole('button', { name: new RegExp(THEMES[id]) });
    if (btn.getAttribute('aria-pressed') === 'false') fireEvent.click(btn);
    const [first, last] = [carriers(id)[0], carriers(id).at(-1)!];
    const lines = (n: number) => [...rowOf(n).querySelectorAll(`[data-rail-cell="${id}"] [data-line]`)].map(l => l.getAttribute('data-line'));
    expect(lines(first)).toEqual(['below']);
    expect(lines(last)).toEqual(['above']);
    expect(rowOf(last).querySelector(`[data-rail-cell="${id}"] [data-arrow]`)).toBeTruthy();
    for (let n = first + 1; n < last; n++) expect(lines(n)).toEqual(['full']);
    expect(lines(first - 1)).toEqual([]);
  }, 30000);

  it('puts the rail after the content in reading order', () => {
    renderView();
    const li = rowOf(41);
    expect(li.firstElementChild!.querySelector('h2')).toBeTruthy();
    expect(li.lastElementChild!.querySelector('[data-rail-cell]')).toBeTruthy();
  });

  it('labels each dot for screen readers with its theme', () => {
    renderView();
    expect(screen.getAllByText(/^الموضوع: /).length).toBeGreaterThan(0);
  });

  it('highlights the topics a step shares with the next surah', () => {
    renderView();
    const step = within(document.getElementById('hop-112')!);
    const shared = step.getByRole('list', { name: 'موضوعات مشتركة مع التالية' });
    expect(within(shared).getAllByRole('listitem').map(li => li.textContent)).toEqual([THEMES.prophet, THEMES.tawhid]);
  });

  it('links the surahs that open alike to the openings page', () => {
    renderView();
    const hrefs = screen.getAllByRole('link').map(a => a.getAttribute('href'));
    expect(hrefs.filter(h => h === '/quran/openings')).toHaveLength(OPENING_GROUPS.flat().filter(n => n >= 41).length);
  });

  it('labels a step without a source and links the ones with one', () => {
    renderView();
    expect(screen.getAllByText('بلا مصدر')).toHaveLength(73 - 4);
    expect(within(document.getElementById('hop-105')!).getByRole('link').getAttribute('href')).toMatch(/^https:\/\//);
  });

  it('colors a shared word the same on both sides', () => {
    renderView();
    const marks = [...document.getElementById('hop-109')!.querySelectorAll('mark')];
    expect(marks).toHaveLength(2);
    expect(marks[0].className).toBe(marks[1].className);
  });
});
