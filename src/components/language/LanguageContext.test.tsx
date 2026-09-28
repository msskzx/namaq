// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import Cookies from 'js-cookie';
import { LanguageProvider, useLanguage } from './LanguageContext';

function Probe() {
  const { language } = useLanguage();
  return <span>{language}</span>;
}

beforeEach(() => {
  localStorage.clear();
  Cookies.remove('language');
  document.documentElement.lang = 'en';
  document.documentElement.dir = '';
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  Cookies.remove('language');
});

describe('LanguageProvider', () => {
  it('defaults to Arabic when nothing is stored', () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );

    expect(screen.getByText('ar')).not.toBeNull();
  });

  it('reads a localStorage-saved language synchronously, before any effect runs', () => {
    localStorage.setItem('language', 'en');

    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );

    expect(screen.getByText('en')).not.toBeNull();
  });

  it('reads a cookie-saved language when cookie consent was accepted', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    Cookies.set('language', 'en', { expires: 365 });

    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );

    expect(screen.getByText('en')).not.toBeNull();
  });

  it('sets document lang and dir reactively', async () => {
    localStorage.setItem('language', 'en');

    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(document.documentElement.lang).toBe('en');
      expect(document.documentElement.dir).toBe('ltr');
    });
  });
});
