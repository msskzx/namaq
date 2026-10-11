// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { buildOpenings } from '@/lib/quran/openings';
import data from './ayat.json';
import OpeningsView from './OpeningsView';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'ar' }),
}));

afterEach(cleanup);

const items = buildOpenings(data);

describe('OpeningsView', () => {
  it('shows the first ayah of 81, 82 and 84 with no basmala', () => {
    render(<OpeningsView items={items} />);
    expect(items.map(i => i.surah.number)).toEqual([81, 82, 84]);
    expect(screen.getAllByRole('region').filter(r => r.getAttribute('aria-label')?.match(/٨١|٨٢|٨٤/))).toHaveLength(3);
    for (const i of items) expect(i.text.split(' ')[0]).toMatch(/^إِذَا/);
  });

  it('colors إذا in all three and السماء in 82 and 84 only', () => {
    render(<OpeningsView items={items} />);
    const marks = (n: number) => within(screen.getByRole('region', { name: new RegExp(String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])) })).queryAllByText((_, el) => el?.tagName === 'MARK');
    expect(marks(81)).toHaveLength(1);
    expect(marks(82)).toHaveLength(2);
    expect(marks(84)).toHaveLength(2);
  });

  it('lists the shared words', () => {
    render(<OpeningsView items={items} />);
    const list = within(screen.getByRole('list', { name: 'اللفظ المشترك' }));
    const [all, sky] = list.getAllByRole('listitem');
    expect(all.textContent).toContain(items[0].text.split(' ')[0]);
    expect(all.textContent).toContain('٨١ و٨٢ و٨٤');
    expect(sky.textContent).toContain(items[1].text.split(' ')[1]);
    expect(sky.textContent).toContain('٨٢ و٨٤');
  });
});
