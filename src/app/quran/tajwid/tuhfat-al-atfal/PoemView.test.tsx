import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { type Poem } from '@/lib/tajwid/poem';
import poem from './poem.json';
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

it.each(['ar', 'en'])('keeps edition and transcription links in a source disclosure in %s', language => {
  state.language = language;
  render(<PoemView poem={poem as Poem} />);
  const summary = screen.getByText(language === 'ar' ? 'الضبط والمصدر' : 'Edition and source');
  const details = summary.closest('details')!;
  expect(details.open).toBe(false);
  fireEvent.click(summary);
  expect(details.open).toBe(true);
  expect(within(details).getByRole('link', { name: poem.edition.name }).getAttribute('href')).toBe(poem.edition.url);
  expect(within(details).getByRole('link', { name: language === 'ar' ? 'نسخة رقمية' : 'digital transcription' }).getAttribute('href')).toBe(poem.transcription);
});
