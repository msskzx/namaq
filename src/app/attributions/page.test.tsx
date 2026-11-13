// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import lemmas from '@/app/quran/words/lemmas.json';
import { num } from '@shared/quran/arabicNumber';
import { SOURCES } from '@shared/sources';
import AttributionsPage from './page';

const lang = vi.hoisted(() => ({ language: 'en' as 'en' | 'ar' }));
vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => lang,
}));

afterEach(() => {
  cleanup();
  lang.language = 'en';
});

describe('AttributionsPage', () => {
  it('lists every source with its licence and where it is used', () => {
    render(<AttributionsPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Attributions' })).toBeTruthy();
    for (const source of SOURCES) {
      const card = document.getElementById(source.id) as HTMLElement;
      expect(within(card).getByRole('heading', { name: source.title.en })).toBeTruthy();
      expect(within(card).getByText(source.licence.en)).toBeTruthy();
      expect(within(card).getAllByRole('link', { name: source.link.label })[0].getAttribute('href')).toBe(source.link.url);
    }
  });

  it('keeps Siyar’s scans and OCR text', () => {
    render(<AttributionsPage />);
    const siyar = document.getElementById('siyar') as HTMLElement;
    expect(within(siyar).getByText('al-Dhahabi')).toBeTruthy();
    expect(within(siyar).getByRole('link', { name: 'المكتبة الشاملة' }).getAttribute('href')).toBe('https://shamela.ws/book/10906');
    expect(within(siyar).getByRole('link', { name: 'Archive.org, third edition, 1405/1985' }).getAttribute('href')).toBe('https://archive.org/details/sanbz');
    expect(within(siyar).getByRole('link', { name: 'Prophet’s Sira, volume 1' }).getAttribute('href')).toBe('https://archive.org/download/sanbz/sansera1_djvu.txt');
    expect(within(siyar).getByRole('link', { name: 'Prophet’s Sira, volume 2' }).getAttribute('href')).toBe('https://archive.org/download/sanbz/sansera2_djvu.txt');
  });

  it('credits the Quranic Arabic Corpus and Tanzil, and states the count it leaves out', () => {
    render(<AttributionsPage />);
    const corpus = screen.getByRole('heading', { name: 'Quranic Arabic Corpus' }).closest('section') as HTMLElement;
    expect(corpus.id).toBe('quranic-arabic-corpus');
    expect(within(corpus).getByRole('link', { name: 'corpus.quran.com' }).getAttribute('href')).toBe('https://corpus.quran.com');
    expect(within(corpus).getByText(/GNU GPL/)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'tanzil.net' }).getAttribute('href')).toBe('https://tanzil.net');
    expect(within(corpus).getByText(new RegExp(`no lemma to ${lemmas.unlemmatized.toLocaleString('en')} words`))).toBeTruthy();
    expect(within(corpus).getByText(/share a spelling carry the corpus’s number/)).toBeTruthy();
  });

  it('names the opposite words and the side that counts one form', () => {
    render(<AttributionsPage />);
    const corpus = screen.getByRole('heading', { name: 'Quranic Arabic Corpus' }).closest('section') as HTMLElement;
    expect(within(corpus).getByRole('link', { name: 'word counts and opposite words' }).getAttribute('href')).toBe('/quran/words');
    expect(within(corpus).getByText(/so that side counts the form «الآخرة» alone/)).toBeTruthy();
  });

  it('gives the corpus note in Arabic', () => {
    lang.language = 'ar';
    render(<AttributionsPage />);
    const corpus = screen.getByRole('heading', { name: 'المدوّنة القرآنية العربية' }).closest('section') as HTMLElement;
    expect(within(corpus).getByText(new RegExp(`لا مدخل في المدوّنة لـ${num(lemmas.unlemmatized)} كلمة`))).toBeTruthy();
  });
});
