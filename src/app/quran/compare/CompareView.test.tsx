// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { NavSlotElement } from '@/components/common/NavBar';
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

function WithBar({ children }: { children: React.ReactNode }) {
  const [slot, setSlot] = React.useState<HTMLDivElement | null>(null);
  return <><div ref={setSlot} /><NavSlotElement.Provider value={slot}>{children}</NavSlotElement.Provider></>;
}

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

  it.each(selections)('hides ayat without matches until asked, then shows every ayah once with its original reference in %i:%i–%i / %i:%i–%i', (a, af, at, b, bf, bt) => {
    const selected = (number: number, from: number, to: number) => surah(number).filter(ayah => {
      const verse = Number(ayah.key.split(':')[1]);
      return verse >= from && verse <= to;
    });
    const left = selected(a, af, at), right = selected(b, bf, bt);
    const rows = alignSurahs(left.map(ayah => ayah.words.map(word => ayahWords(word, false).norm[0])), right.map(ayah => ayah.words.map(word => ayahWords(word, false).norm[0])), { a: af, b: bf });
    const { container } = render(<WithBar><CompareView a={passageSide(a, af, at)} b={passageSide(b, bf, bt)} rows={rows} curated /></WithBar>);
    const gaps = rows.filter(row => row.type === 'gap').length;
    expect(container.querySelectorAll('article')).toHaveLength(2 * (rows.length - gaps));
    if (gaps > 0) fireEvent.click(screen.getByRole('button', { name: 'اعرض الآيات التي لا تطابق فيها' }));
    expect(container.querySelectorAll('section h3')).toHaveLength(container.querySelectorAll('section article h3').length);
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

describe('curated match colours', () => {
  const plain = (number: number, text: string[]) => ({ number, name: `s${number}`, plain: `s${number}`, words: text, range: { from: 1, to: text.length } });
  const pair = (a: number, b: number, marksA: number[], marksB: number[]) => ({ a, b, run: 4, shared: ['x'], marksA, marksB, rootsA: [], rootsB: [] });
  const rows = [{ type: 'block' as const, block: { kind: 'words' as const, anchors: 2, pairs: [pair(1, 1, [0], [0]), pair(2, 1, [1], [2])] } }];

  it('uses one colour and lights the words of a tapped pair on both pages', () => {
    const { container } = render(<WithBar><CompareView a={plain(1, ['أ ب', 'ج د'])} b={plain(2, ['أ ه د'])} rows={rows} curated /></WithBar>);
    const marks = Array.from(container.querySelectorAll('mark'));
    expect(marks.every(mark => !/slot/.test(mark.className))).toBe(true);
    const second = marks.filter(mark => mark.getAttribute('data-link') === '0-1');
    expect(second).toHaveLength(2);
    fireEvent.click(second[0]);
    expect(marks.filter(mark => mark.getAttribute('aria-pressed') === 'true')).toEqual(second);
    fireEvent.click(second[1]);
    expect(marks.filter(mark => mark.getAttribute('aria-pressed') === 'true')).toHaveLength(0);
  });
});
