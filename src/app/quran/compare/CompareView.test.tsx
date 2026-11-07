// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import CompareView from './CompareView';
import fixture from '@/lib/quran/compare.fixture.json';
import { alignSurahs } from '@/lib/quran/compare';
import { ayahWords } from '@/lib/quran/normalize';
import spread from '@/components/quran/PageSpread.module.css';
import quran from '../branches/trees.json';
import { num } from '@/lib/quran/arabicNumber';

vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: string }) => children }));

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
  it('colours a word that shares only its root with its partner in the root colour, with a title saying so', () => {
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


describe('curated passage context', () => {
  const selections = [
    [7, 103, 137, 26, 10, 68],
    [7, 59, 64, 26, 105, 122],
    [7, 65, 72, 26, 123, 140],
    [7, 73, 79, 26, 141, 159],
    [7, 80, 84, 26, 160, 175],
    [7, 85, 93, 26, 176, 191],
    [15, 26, 44, 38, 71, 85],
  ];
  const surah = (number: number) => quran.ayat.filter(ayah => Number(ayah.key.split(':')[0]) === number);
  const passageSide = (number: number, from: number, to: number) => ({
    number, name: `surah-${number}`, plain: `surah-${number}`,
    words: surah(number).map(ayah => ayah.words.join(' ')), range: { from, to },
  });

  it.each(selections)('initially shows every ayah once with its original reference in %i:%i–%i / %i:%i–%i', (a, af, at, b, bf, bt) => {
    const selected = (number: number, from: number, to: number) => surah(number).filter(ayah => {
      const verse = Number(ayah.key.split(':')[1]);
      return verse >= from && verse <= to;
    });
    const left = selected(a, af, at), right = selected(b, bf, bt);
    const rows = alignSurahs(left.map(ayah => ayah.words.map(word => ayahWords(word, false).norm[0])), right.map(ayah => ayah.words.map(word => ayahWords(word, false).norm[0])), { a: af, b: bf });
    const { container } = render(<CompareView a={passageSide(a, af, at)} b={passageSide(b, bf, bt)} rows={rows} curated />);
    for (const [number, ayat] of [[a, left], [b, right]] as const) {
      const articles = Array.from(container.querySelectorAll('article')).filter(article => article.querySelector('h3')?.textContent?.startsWith(`surah-${number}`));
      const seals = articles.flatMap(article => Array.from(article.querySelectorAll(`.${spread.verseSeal}`)).map(seal => seal.textContent));
      expect(seals).toEqual(ayat.map(ayah => num(Number(ayah.key.split(':')[1]))));
      const lines = articles.flatMap(article => Array.from(article.querySelectorAll('div[lang] > p')));
      const text = lines.map(line => {
        const copy = line.cloneNode(true) as HTMLElement;
        copy.querySelectorAll(`.${spread.verseSeal}`).forEach(seal => seal.remove());
        return copy.textContent;
      }).join(' ').replace(/\s+/g, ' ').trim();
      expect(text).toBe(ayat.flatMap(ayah => ayah.words).join(' '));
    }
  });

  it('leaves unmatched ayat collapsed for a legacy custom comparison', () => {
    const { container } = render(<CompareView a={side(57, 'الحديد')} b={side(64, 'التغابن')} rows={[{ type: 'gap', a: { from: 1, to: 2 }, b: { from: 1, to: 2 } }]} />);
    expect(container.querySelectorAll('article')).toHaveLength(0);
    expect(container.textContent).not.toContain(side(57, '').words[0]);
  });
});
