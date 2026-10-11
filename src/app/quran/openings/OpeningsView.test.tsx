// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { buildOpenings, SPANS } from '@/lib/quran/openings';
import data from './ayat.json';
import OpeningsView from './OpeningsView';

afterEach(cleanup);

const items = buildOpenings(data);
const region = (n: number) => within(screen.getByRole('region', { name: new RegExp(String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])) }));
const roles = (n: number) => [...region(n).getAllByText(/./, { selector: 'p' })].map(p => p.getAttribute('data-role'));

describe('OpeningsView', () => {
  it('shows every ayah from the first to the end of each span', () => {
    render(<OpeningsView items={items} />);
    expect(items.map(i => i.lines.length)).toEqual([SPANS[81].to, SPANS[82].to, SPANS[84].to]);
  });

  it('colors each ayah by its role: conditions, then the answer in 81 and 82', () => {
    render(<OpeningsView items={items} />);
    expect(roles(81)).toEqual([...Array(13).fill('condition'), 'answer']);
    expect(roles(82)).toEqual([...Array(4).fill('condition'), 'answer']);
  });

  it('leaves the answer of 84 unmarked and labels it disputed', () => {
    render(<OpeningsView items={items} />);
    expect(roles(84)).toEqual([...Array(5).fill('condition'), 'disputed']);
    expect(region(84).queryAllByText('قراءتنا')).toHaveLength(0);
    expect(region(82).getAllByText('قراءتنا')).toHaveLength(1);
    expect(region(81).queryAllByText('قراءتنا')).toHaveLength(0);
  });

  it('lists the views on the answer in 84 with a source', () => {
    render(<OpeningsView items={items} />);
    expect(screen.getByRole('list', { name: 'دلالة الألوان' }).children).toHaveLength(3);
    expect(screen.getByRole('heading', { name: 'الجواب في الانشقاق' })).toBeTruthy();
    expect(screen.getByText(/المبرد/).textContent).toContain('تقديم وتأخير');
    expect(screen.getByText(/الكسائي/).textContent).toContain('النحاس');
    expect(screen.getByRole('list', { name: 'مصدر الخلاف' }).querySelector('a')!.getAttribute('href')).toMatch(/^https:\/\//);
  });
});
