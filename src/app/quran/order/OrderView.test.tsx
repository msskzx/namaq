// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { buildOrder, THEMES } from '@/lib/quran/surahOrder';
import type { TopicInstance, TopicRecord } from '@/lib/quran/topicTypes';
import { OPENING_GROUPS } from '@/lib/quran/openings';
import data from './ayat.json';
import OrderView, { type JuzRange } from './OrderView';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'ar' }),
}));

afterEach(cleanup);

const TOPICS_DATA_DIR = join(__dirname, '../../../../data/quran/topics');
const topicsBySurah: Record<number, TopicInstance[]> = {};
for (let n = 41; n <= 114; n++) {
  const records: TopicRecord[] = JSON.parse(readFileSync(join(TOPICS_DATA_DIR, `${n}.json`), 'utf8'));
  topicsBySurah[n] = records.filter(r => !r.alternativeOf).map(r => ({ ...r, surah: n }));
}

const { chips, hops } = buildOrder(data, topicsBySurah);
// Every surah "in" every juz' so the filter is inert by default; tests that
// exercise the filter itself build their own precise fixture.
const inertJuzBySurah: Record<number, JuzRange> = Object.fromEntries(chips.map(c => [c.number, { min: 25, max: 30 }]));
const renderView = (juzBySurah: Record<number, JuzRange> = inertJuzBySurah) => render(<OrderView chips={chips} hops={hops} juzBySurah={juzBySurah} />);
const strip = () => within(screen.getByRole('list', { name: 'ترتيب السور' }));
const toggles = () => within(screen.getByRole('list', { name: 'المواضيع' }));
const cells = (id?: string) => document.querySelectorAll(id ? `[data-rail-cell="${id}"]` : '[data-rail-cell]');
const carriers = (id: string) => Object.keys(topicsBySurah).map(Number).filter(n => topicsBySurah[n].some(t => t.themeId === id));
const rowOf = (n: number) => strip().getAllByRole('heading', { level: 2 })[n - 41].closest('li')!;

describe('OrderView', () => {
  it('names each surah once and has one link per neighbouring pair', () => {
    renderView();
    expect(strip().getAllByRole('heading', { level: 2 })).toHaveLength(74);
    expect(document.querySelectorAll('details')).toHaveLength(73);
    expect(screen.getAllByRole('heading', { name: /النازعات/ })).toHaveLength(1);
  });

  it('shows one badge per theme a surah carries, labelled with the theme name', () => {
    renderView();
    const list = within(screen.getByRole('list', { name: /موضوعات سورة النبإ/ }));
    const themeIds = [...new Set(topicsBySurah[78].map(t => t.themeId).filter((id): id is string => !!id))];
    expect(list.getAllByRole('listitem')).toHaveLength(themeIds.length);
    for (const id of themeIds) expect(list.getByRole('button', { name: THEMES[id] })).toBeTruthy();
  });

  it('opens an overlay on badge click listing every topic of that theme in the surah, with ayah range and excerpt', () => {
    renderView();
    const list = within(screen.getByRole('list', { name: /موضوعات سورة النبإ/ }));
    const first = topicsBySurah[78][0];
    expect(first.themeId).toBeTruthy();
    const itemsOfTheme = topicsBySurah[78].filter(t => t.themeId === first.themeId);
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(list.getByRole('button', { name: THEMES[first.themeId!] }));
    const dialog = within(screen.getByRole('dialog', { name: THEMES[first.themeId!] }));
    expect(dialog.getAllByText(new RegExp(itemsOfTheme[0].excerptAr.split('\n')[0]))).toBeTruthy();
    for (const item of itemsOfTheme) expect(dialog.getByText(new RegExp(item.labelAr))).toBeTruthy();
    fireEvent.click(dialog.getByRole('button', { name: 'إغلاق' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('lists every item of a theme that has several in the surah', { timeout: 30000 }, () => {
    renderView();
    const byTheme = new Map<string, TopicInstance[]>();
    for (const t of topicsBySurah[78]) if (t.themeId) byTheme.set(t.themeId, [...(byTheme.get(t.themeId) ?? []), t]);
    const [themeId, items] = [...byTheme].find(([, list]) => list.length > 1)!;
    const list = within(screen.getByRole('list', { name: /موضوعات سورة النبإ/ }));
    fireEvent.click(list.getByRole('button', { name: THEMES[themeId] }));
    const dialog = within(screen.getByRole('dialog', { name: THEMES[themeId] }));
    expect(dialog.getAllByRole('listitem')).toHaveLength(items.length);
  });

  it('closes the overlay on Escape and locks body scroll only while it is open', { timeout: 30000 }, () => {
    renderView();
    const list = within(screen.getByRole('list', { name: /موضوعات سورة النبإ/ }));
    expect(document.body.style.overflow).toBe('');
    fireEvent.click(list.getAllByRole('button')[0]);
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).toBe('');
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

  describe('filtering', { timeout: 30000 }, () => {
    it('narrows the surah list to the selected juz', () => {
      const juzBySurah: Record<number, JuzRange> = Object.fromEntries(
        chips.map(c => [c.number, c.number <= 46 ? { min: 25, max: 25 } : { min: 26, max: 26 }]),
      );
      renderView(juzBySurah);
      fireEvent.change(screen.getByLabelText('الجزء'), { target: { value: '25' } });
      fireEvent.blur(screen.getByLabelText('الجزء'));
      expect(strip().getAllByRole('heading', { level: 2 })).toHaveLength(46 - 41 + 1);
    });

    it('narrows the surah list to a from/to surah range', () => {
      renderView();
      fireEvent.change(screen.getByLabelText('من سورة'), { target: { value: '50' } });
      fireEvent.change(screen.getByLabelText('إلى سورة'), { target: { value: '55' } });
      const names = strip().getAllByRole('heading', { level: 2 }).map(h => h.textContent);
      expect(names).toHaveLength(6);
    });

    it('combines the juz and the surah range', () => {
      const juzBySurah: Record<number, JuzRange> = Object.fromEntries(
        chips.map(c => [c.number, c.number <= 46 ? { min: 25, max: 25 } : { min: 26, max: 26 }]),
      );
      renderView(juzBySurah);
      fireEvent.change(screen.getByLabelText('الجزء'), { target: { value: '25' } });
      fireEvent.blur(screen.getByLabelText('الجزء'));
      fireEvent.change(screen.getByLabelText('من سورة'), { target: { value: '44' } });
      expect(strip().getAllByRole('heading', { level: 2 })).toHaveLength(46 - 44 + 1);
    });

    it('drops a theme from the rail when no visible surah carries it', () => {
      renderView();
      const all = cells().length;
      fireEvent.change(screen.getByLabelText('من سورة'), { target: { value: '114' } });
      expect(cells().length).toBeLessThan(all);
    });

    it('resets both filters on clear', () => {
      renderView();
      fireEvent.change(screen.getByLabelText('من سورة'), { target: { value: '50' } });
      expect(strip().getAllByRole('heading', { level: 2 })).toHaveLength(114 - 50 + 1);
      fireEvent.click(screen.getByRole('button', { name: 'إلغاء التصفية' }));
      expect(strip().getAllByRole('heading', { level: 2 })).toHaveLength(74);
    });
  });
});
