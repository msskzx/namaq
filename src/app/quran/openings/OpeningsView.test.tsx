// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { buildOpenings, buildTasbih, SPANS, TASBIH_SURAHS } from '@/lib/quran/openings';
import data from './ayat.json';
import OpeningsView from './OpeningsView';

afterEach(cleanup);

const items = buildOpenings(data);
const tasbih = buildTasbih(data);
const renderView = () => render(<OpeningsView items={items} tasbih={tasbih} />);
const region = (n: number) => within(screen.getByRole('region', { name: new RegExp(String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])) }));
const roles = (n: number) => [...region(n).getAllByText(/./, { selector: 'p' })].map(p => p.getAttribute('data-role'));

describe('OpeningsView', () => {
  it('shows every ayah from the first to the end of each span', () => {
    renderView();
    expect(items.map(i => i.lines.length)).toEqual([SPANS[81].to, SPANS[82].to, SPANS[84].to]);
  });

  it('colors each ayah by its role: conditions, then the answer in 81 and 82', () => {
    renderView();
    expect(roles(81)).toEqual([...Array(13).fill('condition'), 'answer']);
    expect(roles(82)).toEqual([...Array(4).fill('condition'), 'answer']);
  });

  it('leaves the answer of 84 unmarked and labels it disputed', () => {
    renderView();
    expect(roles(84)).toEqual([...Array(5).fill('condition'), 'disputed']);
    expect(region(84).queryAllByText('قراءتنا')).toHaveLength(0);
    expect(region(82).getAllByText('قراءتنا')).toHaveLength(1);
    expect(region(81).queryAllByText('قراءتنا')).toHaveLength(0);
  });

  it('lists the views on the answer in 84 with a source', () => {
    renderView();
    expect(screen.getByRole('list', { name: 'دلالة الألوان' }).children).toHaveLength(3);
    expect(screen.getByRole('heading', { name: 'الجواب في الانشقاق' })).toBeTruthy();
    expect(screen.getByText(/المبرد/).textContent).toContain('تقديم وتأخير');
    expect(screen.getByText(/الكسائي/).textContent).toContain('النحاس');
    expect(screen.getByRole('list', { name: 'مصدر الخلاف' }).querySelector('a')!.getAttribute('href')).toMatch(/^https:\/\//);
  });

  it('marks the tasbih word, its scope and its closing in the first ayah of all seven', () => {
    renderView();
    expect(tasbih.map(t => t.surah.number)).toEqual(TASBIH_SURAHS);
    for (const t of tasbih) {
      const roles = new Set(t.words.map(w => w.role).filter(Boolean));
      expect(roles).toEqual(new Set(['verb', 'scope', 'closing']));
      expect(region(t.surah.number).getAllByText(/./, { selector: 'mark' })).toHaveLength(3);
    }
    expect(screen.getByRole('list', { name: 'دلالة ألوان التسبيح' }).children).toHaveLength(3);
  });

  it('colors the tasbih word alone in the verb role and keeps 59 and 61 identical', () => {
    for (const t of tasbih) expect(t.words.filter(w => w.role === 'verb')).toHaveLength(1);
    const text = (n: number) => tasbih.find(t => t.surah.number === n)!.words.map(w => w.text);
    expect(text(59)).toEqual(text(61));
    expect(text(59).length - text(57).length).toBe(2);
    expect(text(59).filter(w => !text(57).includes(w))).toContain('وَمَا');
  });

  it('highlights a run of words once and keeps the notes free of bare surah numbers', () => {
    renderView();
    const closing = region(62).getAllByText(/./, { selector: 'mark[data-role="closing"]' });
    expect(closing).toHaveLength(1);
    expect(closing[0].textContent!.split(' ').length).toBeGreaterThan(1);
    expect(screen.queryByText(/١٧ و٥٧/)).toBeNull();
  });
});
