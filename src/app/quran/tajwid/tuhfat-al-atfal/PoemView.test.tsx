import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { type Poem } from '@shared/tajwid/poem';
import poem from '@shared/tajwid/tuhfat-al-atfal.json';
import PoemView from './PoemView';

const state = vi.hoisted(() => ({ language: 'ar' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => state }));
afterEach(() => { cleanup(); state.language = 'ar'; });

it('keeps all 61 verses and both halves in the Arabic reading order', () => {
  render(<PoemView poem={poem as Poem} />);
  const article = screen.getByRole('article', { name: poem.title });
  expect(article.getAttribute('dir')).toBe('rtl');
  expect(article.getAttribute('lang')).toBe('ar');
  expect(article.querySelectorAll('p')).toHaveLength(61);
  expect(within(article).getByText('يَقُولُ رَاجِي رَحْمَةِ الْغَفُورِ')).toBeTruthy();
  expect(within(article).getByText('دَوْمًا سُلَيْمَانُ هُوَ الْجَمْزُورِي')).toBeTruthy();
  for (const chapter of poem.chapters) for (const [first, second] of chapter.verses) {
    expect(within(article).getByText(first)).toBeTruthy();
    expect(within(article).getByText(second)).toBeTruthy();
  }
  expect(document.getElementById('bayt-61')).toBeTruthy();
});

it.each(['ar', 'en'])('links every chapter to its reading section in %s', language => {
  state.language = language;
  render(<PoemView poem={poem as Poem} />);
  const nav = screen.getByRole('navigation', { name: language === 'ar' ? 'أبواب المنظومة' : 'Poem chapters' });
  const links = within(nav).getAllByRole('link');
  expect(links).toHaveLength(10);
  links.forEach((link, index) => {
    expect(link.getAttribute('href')).toBe(`#bab-${index + 1}`);
    const chapter = document.getElementById(`bab-${index + 1}`)!;
    expect(within(chapter).getByRole('heading').textContent).toBe(poem.chapters[index].title);
  });
  expect(screen.getByRole('article').getAttribute('dir')).toBe('rtl');
});

it('keeps the edition and transcription links in the sheet of its book line', () => {
  render(<PoemView poem={poem as Poem} />);
  fireEvent.click(screen.getByRole('button', { name: `المصدر: ${poem.title}` }));
  const sheet = screen.getByRole('dialog', { name: 'المصدر' });
  expect(within(sheet).getByRole('link', { name: `الضبط: ${poem.edition.name}` }).getAttribute('href')).toBe(poem.edition.url);
  expect(within(sheet).getByRole('link', { name: 'قوبل به كل بيت من نسخة رقمية' }).getAttribute('href')).toBe(poem.transcription);
});
