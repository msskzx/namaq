// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Experiments, { LIVE, LIVE_INSIDE } from './Experiments';
import { metadata } from './page';
import { getAllNavLinks } from '@/lib/siteLinks';

const { language } = vi.hoisted(() => ({ language: { current: 'en' as 'en' | 'ar' } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: language.current }) }));
afterEach(() => { cleanup(); language.current = 'en'; });

describe('experiments directory', () => {
  it.each(['en', 'ar'] as const)('lists live features first, then every other page, with no page title in %s', current => {
    language.current = current;
    render(<Experiments />);
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
    expect(document.body.textContent).not.toContain(current === 'ar' ? 'تجريبية' : 'experimental');
    const hrefs = screen.getAllByRole('link').map(link => link.getAttribute('href'));
    for (const { href } of getAllNavLinks(current)) {
      if (href === '/people/prophet-muhammad') continue;
      expect(hrefs, href).toContain(href);
    }
    for (const href of ['/quizzes/party', '/quizzes/questions', '/library?tab=saved', '/library?tab=forgotten', '/library?tab=notes', '/quran/read/recite', '/quran/prophets/muhammad', '/quran/words', '/search', '/utilities']) expect(hrefs).toContain(href);
    expect(hrefs).not.toContain('/experiments');
    // A live page leaves the experiments list, so it is listed once.
    for (const { href } of LIVE) expect(hrefs.filter(h => h === href), href).toHaveLength(1);
  });

  it('lists the live features in the first section', () => {
    render(<Experiments />);
    const live = screen.getByRole('heading', { level: 2, name: 'Live' }).closest('section')!;
    const hrefs = [...live.querySelectorAll('a')].map(link => link.getAttribute('href'));
    expect(hrefs).toEqual(LIVE.map(item => item.href));
    for (const href of ['/quran/read', '/quran/branches', '/quran/compare', '/quran/prophets']) expect(hrefs).toContain(href);
  });

  it('marks every live feature in green, with the features that live inside other pages', () => {
    render(<Experiments />);
    const live = screen.getByRole('heading', { level: 2, name: 'Live' }).closest('section')!;
    expect(live.querySelector('h2')!.className).toContain('--home-green');
    expect(live.querySelectorAll('li svg[class*="--home-green"]')).toHaveLength(LIVE.length + LIVE_INSIDE.length);
    expect(screen.getByRole('list', { name: 'Inside the pages' }).textContent).toContain('ten readers');
    const rest = [...document.querySelectorAll('section')].filter(section => section !== live);
    for (const section of rest) expect(section.querySelector('svg[class*="--home-green"]')).toBeNull();
    cleanup();
    language.current = 'ar';
    render(<Experiments />);
    expect(screen.getByRole('list', { name: 'داخل الصفحات' }).children).toHaveLength(LIVE_INSIDE.length);
  });

  it('requests exclusion from indexing and link following', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
