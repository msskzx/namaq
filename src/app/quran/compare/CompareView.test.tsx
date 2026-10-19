// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import CompareView from './CompareView';
import fixture from '@/lib/quran/compare.fixture.json';
import { alignSurahs } from '@/lib/quran/compare';
import { ayahWords } from '@/lib/quran/normalize';
import spread from '@/components/quran/PageSpread.module.css';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'ar' }),
}));

const fx = fixture as Record<string, string[]>;
const words = (n: number) => fx[n].map((t, i) => ayahWords(t, i === 0));
const side = (number: number, plain: string) => ({ number, name: plain, plain, words: words(number).map(w => w.display.join(' ')) });

afterEach(cleanup);

describe('CompareView on Al-Hadid and At-Taghabun', () => {
  const rows = alignSurahs(words(57).map(w => w.norm), words(64).map(w => w.norm));

  it('shows 64:1 once, on the line facing both 57:1 and 57:2', () => {
    const { container } = render(<CompareView a={side(57, 'الحديد')} b={side(64, 'التغابن')} rows={rows} />);
    const [a, b] = Array.from(container.querySelectorAll('article')).map(page => Array.from(page.querySelectorAll('div[lang] > p')).map(p => p.textContent ?? ''));
    const line = a.findIndex(text => text.includes(side(57, '').words[0]));
    expect(a[line]).toContain(side(57, '').words[1]);
    expect(b[line]).toContain(side(64, '').words[0]);
    expect(b.filter(text => text.includes(side(64, '').words[0]))).toHaveLength(1);
    expect(container.textContent).toContain('التغابن');
  });

  it('colors the shared words of the two links in different colors', () => {
    const { container } = render(<CompareView a={side(57, 'الحديد')} b={side(64, 'التغابن')} rows={rows} />);
    const shared = Array.from(container.querySelectorAll('article mark'));
    expect(shared.some(m => m.className.includes(spread.slot1))).toBe(true);
    expect(shared.some(m => !m.className.includes(spread.slot1) && !m.className.includes(spread.root))).toBe(true);
  });
});

describe('CompareView with words matched by root', () => {
  it('underlines a word that shares only its root with its partner, with a title saying so', () => {
    const one = (number: number, text: string) => ({ number, name: '', plain: '', words: [text] });
    const rows = alignSurahs([['ياتوك', 'بكل', 'r:sHr', 'r:Elm']], [['ياتوك', 'بكل', 'r:sHr', 'r:Elm']], { a: 1, b: 1 }, false, true,
      { a: [['ياتوك', 'بكل', 'سحار', 'عليم']], b: [['ياتوك', 'بكل', 'سحر', 'عليم']] });
    const { container } = render(<CompareView a={one(26, 'يأتوك بكل سحار عليم')} b={one(7, 'يأتوك بكل ساحر عليم')} rows={rows} />);
    const rooted = Array.from(container.querySelectorAll('mark[title="من جذر مشترك بلفظ مختلف"]')).map(m => m.textContent);
    expect(rooted).toEqual(['سحار', 'ساحر']);
    expect(Array.from(container.querySelectorAll('article mark')).filter(m => m.className.includes(spread.root)).map(m => m.textContent)).toEqual(['سحار', 'ساحر']);
  });
});

describe('CompareView gaps', () => {
  it('keeps the first surah in its own column when only the second has unmatched ayat', () => {
    const { container, getByRole } = render(<CompareView a={side(57, 'الحديد')} b={side(64, 'التغابن')} rows={[{ type: 'gap', a: null, b: { from: 1, to: 2 } }]} />);
    fireEvent.click(getByRole('button'));
    const spreadEl = container.querySelector('article')!.parentElement!;
    expect(spreadEl.children[0].tagName).toBe('DIV');
    expect(spreadEl.children[1].getAttribute('aria-label')).toBe('التغابن ١–٢');
  });
});
