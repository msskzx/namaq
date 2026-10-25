// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import CompareView from './CompareView';
import fixture from '@/lib/quran/compare.fixture.json';
import { alignSurahs } from '@/lib/quran/compare';
import { ayahWords } from '@/lib/quran/normalize';

const language = vi.hoisted(() => ({ language: 'ar' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => language }));

const fx = fixture as Record<string, string[]>;
const words = (n: number) => fx[n].map((t, i) => ayahWords(t, i === 0));
const side = (number: number, plain: string) => ({ number, name: plain, plain, words: words(number).map(w => w.display.join(' ')) });

afterEach(() => { cleanup(); language.language = 'ar'; });

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


});

describe('CompareView with words matched by root', () => {
  it('underlines a word that shares only its root with its partner, with a title saying so', () => {
    const one = (number: number, text: string) => ({ number, name: '', plain: '', words: [text] });
    const rows = alignSurahs([['ياتوك', 'بكل', 'r:sHr', 'r:Elm']], [['ياتوك', 'بكل', 'r:sHr', 'r:Elm']], { a: 1, b: 1 }, false, true,
      { a: [['ياتوك', 'بكل', 'سحار', 'عليم']], b: [['ياتوك', 'بكل', 'سحر', 'عليم']] });
    const { container } = render(<CompareView a={one(26, 'يأتوك بكل سحار عليم')} b={one(7, 'يأتوك بكل ساحر عليم')} rows={rows} />);
    const rooted = Array.from(container.querySelectorAll('mark[title="من جذر مشترك بلفظ مختلف"]')).map(m => m.textContent);
    expect(rooted).toEqual(['سحار', 'ساحر']);
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

describe('comparison explanation', () => {
  it('keeps its review limitation visible and the detailed matching rules available on request', () => {
    render(<CompareView a={side(57, 'الحديد')} b={side(64, 'التغابن')} rows={[]} />);
    expect(screen.getByText('لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص.')).toBeTruthy();
    const disclosure = screen.getByText('كيف تُقارن الآيات؟ وحدود العرض').closest('details')!;
    expect(disclosure.open).toBe(false);
    fireEvent.click(disclosure.querySelector('summary')!);
    expect(disclosure.open).toBe(true);
    expect(disclosure.textContent).toContain('الصيغ المتكررة');
  });
});

describe('English captions', () => {
  it('localizes the comparison headings, paired references and ayah captions while retaining the original Arabic text', () => {
    language.language = 'en';
    const rows = alignSurahs(words(57).map(w => w.norm), words(64).map(w => w.norm));
    const { container } = render(<CompareView a={side(57, 'الحديد')} b={side(64, 'التغابن')} rows={rows} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('الحديد and التغابن');
    expect(screen.getAllByRole('heading', { level: 2 }).every(heading => heading.textContent?.includes(' and '))).toBe(true);
    expect(container.querySelector('article header p')?.textContent).toMatch(/^Ayat? /);
    expect(container.querySelector('article [lang=ar]')?.textContent).toContain(side(57, '').words[0]);
    expect(container.textContent).not.toContain('الآية');
    expect(container.textContent).toMatch(/١ and ١:/);
  });

  it('localizes unmatched-passage counts, disclosure labels and singular captions', () => {
    language.language = 'en';
    const { container } = render(<CompareView a={side(57, 'الحديد')} b={side(64, 'التغابن')} rows={[{ type: 'gap', a: { from: 1, to: 1 }, b: { from: 1, to: 2 } }]} />);
    const show = screen.getByRole('button', { name: 'Show الحديد ١ and التغابن ١–٢' });
    expect(container.textContent).toContain('الحديد ١ (1 ayah) and التغابن ١–٢ (2 ayat)');
    fireEvent.click(show);
    expect(screen.getByRole('article', { name: 'الحديد ١' }).querySelector('header p')?.textContent).toBe('Ayah ١');
    expect(screen.getByRole('article', { name: 'التغابن ١–٢' }).querySelector('header p')?.textContent).toBe('Ayat ١–٢');
  });
});
