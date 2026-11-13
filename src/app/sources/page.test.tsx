// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { sourcesIn } from '@shared/sources';
import SourcesPage from './page';

const shelf = vi.hoisted(() => ({ data: undefined as unknown }));
vi.mock('swr', () => ({ default: () => ({ data: shelf.data }) }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));

afterEach(() => {
  cleanup();
  shelf.data = undefined;
});

describe('SourcesPage', () => {
  it('lists every book with its uses before the shelf loads', () => {
    render(<SourcesPage />);
    for (const book of sourcesIn('books')) {
      const card = document.getElementById(book.id) as HTMLElement;
      expect(within(card).getByRole('heading', { name: book.title.ar })).toBeTruthy();
      for (const use of book.uses.filter(u => u.href)) expect(within(card).getByRole('link', { name: use.en }).getAttribute('href')).toBe(use.href);
    }
    expect(screen.getByRole('link', { name: 'Read the pages' }).getAttribute('href')).toBe('/sources/siyar-alam-al-nubala-risalah');
  });

  it('adds the shelf counts once loaded, and shows a held book the list does not name', () => {
    shelf.data = { sources: [
      { slug: 'siyar-alam-al-nubala-risalah', title: 'سير أعلام النبلاء', entryCount: 40, pageCount: 300 },
      { slug: 'other', title: 'كتاب آخر', entryCount: 1, pageCount: 2 },
    ] };
    render(<SourcesPage />);
    expect(screen.getByRole('link', { name: 'Read the pages (40 entries · 300 pages)' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /كتاب آخر/ }).getAttribute('href')).toBe('/sources/other');
  });
});
