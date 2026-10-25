// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import ThemesView from './ThemesView';

const state = vi.hoisted(() => ({ language: 'ar' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => state }));

afterEach(() => { cleanup(); state.language = 'ar'; });

const a = { number: 43, name: 'الزخرف', ayat: ['خارج البداية', 'كلمات الآية الثانية', 'كلمات الآية الثالثة', 'خارج النهاية'] };
const b = { number: 44, name: 'الدخان', ayat: ['نص الآية الأولى', 'نص الآية الثانية', 'خارج الموضوع'] };
const themes = [{ theme: 'الوحي والكتاب', a: { from: 2, to: 3 }, b: { from: 1, to: 2 } }];

describe('ThemesView', () => {
  it('keeps every ayah of each topic in one continuous passage, with its verse number and no outside ayat', () => {
    render(<ThemesView a={a} b={b} themes={themes} />);
    const topic = screen.getByRole('region', { name: 'الوحي والكتاب' });
    const pages = within(topic).getAllByRole('article');
    expect(pages).toHaveLength(2);
    expect(pages[0].getAttribute('aria-label')).toBe('الزخرف ٢–٣');
    expect(pages[1].getAttribute('aria-label')).toBe('الدخان ١–٢');
    const passages = pages.map(page => page.querySelectorAll('div[lang="ar"] > p'));
    expect(passages.map(p => p.length)).toEqual([1, 1]);
    expect(passages[0][0].textContent).toBe('كلمات الآية الثانية ٢ كلمات الآية الثالثة ٣');
    expect(passages[1][0].textContent).toBe('نص الآية الأولى ١ نص الآية الثانية ٢');
    expect(screen.queryByText(/خارج/)).toBeNull();
    expect(document.querySelector('mark')).toBeNull();
  });

  it('keeps distinct themes separate and retains a single-ayah passage', () => {
    render(<ThemesView level={2} a={a} b={b} themes={[...themes, { theme: 'موضوع آخر', a: { from: 4, to: 4 }, b: { from: 3, to: 3 } }]} />);
    expect(screen.getAllByRole('region')).toHaveLength(2);
    const topic = screen.getByRole('region', { name: 'موضوع آخر' });
    expect(within(topic).getByRole('heading', { name: 'موضوع آخر', level: 3 })).toBeTruthy();
    expect(within(topic).getByRole('article', { name: 'الزخرف ٤' }).querySelector('div[lang="ar"] > p')?.textContent).toBe('خارج النهاية ٤');
    expect(within(topic).getByRole('article', { name: 'الدخان ٣' }).querySelector('div[lang="ar"] > p')?.textContent).toBe('خارج الموضوع ٣');
    expect(within(topic).getByText('الآية ٤')).toBeTruthy();
  });

  it('localizes the reading captions in English while retaining the Arabic source and theme', () => {
    state.language = 'en';
    const { container } = render(<ThemesView a={a} b={b} themes={themes} />);
    expect(container.firstElementChild?.getAttribute('dir')).toBe('ltr');
    expect(screen.getByText('Passages grouped by shared topic, not wording (1).')).toBeTruthy();
    expect(screen.getByText('Ayat ٢–٣')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'الوحي والكتاب' }).getAttribute('lang')).toBe('ar');
    expect(screen.getByRole('article', { name: 'الزخرف ٢–٣' }).querySelector('[lang="ar"]')).toBeTruthy();
  });

  it('says so when the two surahs share no topic', () => {
    render(<ThemesView a={{ number: 7, name: 'الأعراف', ayat: [] }} b={{ number: 11, name: 'هود', ayat: [] }} themes={[]} />);
    expect(screen.getByText('لا مواضع متقابلة مسجلة بين هاتين السورتين.')).toBeTruthy();
    expect(document.querySelector('section')).toBeNull();
  });
});
