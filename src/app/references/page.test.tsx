// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReferencesPage from './page';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' }),
}));

describe('ReferencesPage', () => {
  it('lists the work, author, and digital edition in English', () => {
    render(<ReferencesPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'References' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'سير أعلام النبلاء' })).toBeTruthy();
    expect(screen.getByText('شمس الدين الذهبي')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Shamela Library' }).getAttribute('href')).toBe('https://shamela.ws/index.php/book/10906');
    expect(screen.getByRole('link', { name: 'Archive.org, third edition, 1405/1985' }).getAttribute('href')).toBe('https://archive.org/details/sanbz');
    expect(screen.getByRole('link', { name: 'Prophet’s Sira, volume 1' }).getAttribute('href')).toBe('https://archive.org/download/sanbz/sansera1_djvu.txt');
    expect(screen.getByRole('link', { name: 'Prophet’s Sira, volume 2' }).getAttribute('href')).toBe('https://archive.org/download/sanbz/sansera2_djvu.txt');
  });
});
