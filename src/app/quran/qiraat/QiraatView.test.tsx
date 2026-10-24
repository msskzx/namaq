// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import QiraatView from './QiraatView';
import { variants } from './data/variants';
import hafs from './data/hafs.fixture.json';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'ar' }),
}));

const texts = hafs as Record<string, string>;
const go = (surah: number, ayah: string) => {
  fireEvent.change(screen.getByRole('combobox'), { target: { value: String(surah) } });
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${ayah}`) }));
};
const entries = variants.map(variant => ({ variant, text: texts[`${variant.surah}:${variant.ayah}`], surahName: 'سُورَةُ ٱلْفَاتِحَةِ' }));

afterEach(cleanup);

describe('QiraatView', () => {
  it('indexes every place by surah, then ayah, and starts on 1:4', () => {
    const { container } = render(<QiraatView entries={entries} />);
    expect(screen.getByRole('combobox').querySelectorAll('option')).toHaveLength(new Set(variants.map(v => v.surah)).size);
    expect(screen.getByRole('navigation', { name: 'المواضع' }).querySelectorAll('button')).toHaveLength(1);
    expect(container.querySelectorAll('li[data-state]')).toHaveLength(20);
    expect(container.textContent).toContain('فرق على مستوى الكلمة، وليس نص مصحف تلك الرواية');
  });

  it('shows the Hafs/Shu\'ba split on 5:6 and withholds the meaning', () => {
    const { container } = render(<QiraatView entries={entries} />);
    go(5, '٦');
    const chip = (name: string) => screen.getByText(name).closest('li')!.getAttribute('data-state');
    expect(chip('حفص')).toBe('0');
    expect(chip('شعبة')).toBe('1');
    expect(container.textContent).toContain('لا يُعرض شرح هنا لأنه موضع خلاف فقهي');
  });

  it('shows no unreviewed label on an unsourced meaning and greys every chip on 18:86', () => {
    const { container } = render(<QiraatView entries={entries} />);
    go(2, '٩');
    expect(container.textContent).not.toContain('غير موثق');
    go(18, '٨٦');
    expect(container.querySelectorAll('li[data-state="unknown"]')).toHaveLength(20);
  });

  it('lists the places of juz\' 30 under their surah', () => {
    render(<QiraatView entries={entries} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '89' } });
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('89');
    expect(screen.getByRole('navigation', { name: 'المواضع' }).querySelectorAll('button')).toHaveLength(variants.filter(v => v.surah === 89).length);
  });

  it('shows no meaning block for a place that has none', () => {
    const { container } = render(<QiraatView entries={entries} />);
    go(89, '٤');
    expect(container.textContent).not.toContain('المعنى');
  });

  it('shows both words of 78:37 in one place, coloring only the differing words, with al-Tabari on what the difference changes', () => {
    const { container } = render(<QiraatView entries={entries} />);
    go(78, '٣٧');
    const cards = [...container.querySelectorAll('.row-span-2')];
    expect(cards).toHaveLength(3);
    expect(cards.map(c => c.querySelectorAll('mark').length)).toEqual([2, 2, 2]);
    expect(container.textContent).toContain('المعنى');
    expect(container.textContent).toContain('الطبري');
  });

  it('colors the only differing word on 1:4, which differs by one letter', () => {
    const { container } = render(<QiraatView entries={entries} />);
    expect([...container.querySelectorAll('.row-span-2')].map(c => c.querySelectorAll('mark').length)).toEqual([1, 1]);
  });

  it('colors the riwaya pills below by reading and leaves the names above the ayah plain', () => {
    const { container } = render(<QiraatView entries={entries} />);
    const hafs = screen.getByText('حفص', { selector: 'li[data-state] *' }).closest('li')!;
    expect(hafs.className + hafs.innerHTML).toContain('var(--home-highlight-border)');
    expect(container.querySelector('.row-span-2 p')!.className).not.toMatch(/amber|sky|emerald|rose/);
  });

  it('nests each imam\'s two riwat under him', () => {
    render(<QiraatView entries={entries} />);
    const imams = screen.getByRole('list', { name: 'الأئمة ورواتهم' }).children;
    expect(imams).toHaveLength(10);
    for (const imam of imams) expect(imam.querySelectorAll('li[data-state]')).toHaveLength(2);
  });

  it('says so when no ayah is stored', () => {
    const { container } = render(<QiraatView entries={[]} />);
    expect(container.textContent).toContain('لا توجد آيات');
  });

  it('shows a notice instead of a word-level block when the word is not in the ayah', () => {
    const broken = [{ ...entries[0], text: 'كتاب' }];
    const { container } = render(<QiraatView entries={broken} />);
    expect(container.textContent).toContain('تعذر تحديد الكلمة');
  });
});
