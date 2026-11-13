// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import PageHint, { resetHints } from './PageHint';
import { HINTS, HINTS_SEEN, hintOfPath, parseHintsSeen } from '@shared/tabHints';

const { state } = vi.hoisted(() => ({ state: { path: '/quran/compare', language: 'ar' as 'ar' | 'en' } }));
vi.mock('next/navigation', () => ({ usePathname: () => state.path }));
vi.mock('../language/LanguageContext', () => ({ useLanguage: () => ({ language: state.language }) }));
afterEach(() => { cleanup(); localStorage.clear(); state.path = '/quran/compare'; state.language = 'ar'; });

describe('PageHint', () => {
  it('shows the page tip once, and a click puts it away for good', () => {
    render(<PageHint />);
    fireEvent.click(screen.getByRole('button', { name: new RegExp(HINTS.compare.ar) }));
    expect(screen.queryByRole('button')).toBeNull();
    expect(parseHintsSeen(localStorage.getItem(HINTS_SEEN))).toEqual(['compare']);
    cleanup();
    render(<PageHint />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('keeps each page apart, and replaying the tour brings them back', () => {
    localStorage.setItem(HINTS_SEEN, JSON.stringify(['compare']));
    state.path = '/quran/branches';
    render(<PageHint />);
    expect(screen.getByRole('button').textContent).toContain(HINTS.branches.ar);
    cleanup();
    state.path = '/quran/compare';
    resetHints();
    state.language = 'en';
    render(<PageHint />);
    expect(screen.getByRole('button').textContent).toContain(HINTS.compare.en);
  });

  it('shows nothing on pages without a tip', () => {
    for (const path of ['/', '/quizzes', '/quran', '/quran/prophets', '/quran/tajwid/tuhfat-al-atfal']) {
      state.path = path;
      render(<PageHint />);
      expect(screen.queryByRole('button')).toBeNull();
      cleanup();
    }
  });
});

describe('hintOfPath', () => {
  it('names the tip of each page that has one', () => {
    expect(['/quran/read', '/quran/branches', '/quran/compare', '/quran/prophets/musa', '/utilities'].map(hintOfPath)).toEqual(['read', 'branches', 'compare', 'prophets', 'utilities']);
    expect(hintOfPath('/quran/reader')).toBeNull();
  });

  it('reads a broken stored list as nothing seen', () => {
    expect(parseHintsSeen('{oops')).toEqual([]);
    expect(parseHintsSeen('["read","nope"]')).toEqual(['read']);
  });
});
