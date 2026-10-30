// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Experiments from './Experiments';
import { metadata } from './page';
import { EXPERIMENT_SECTIONS } from '@/lib/navigation';
import { getAllNavLinks } from '@/lib/siteLinks';

const { language } = vi.hoisted(() => ({ language: { current: 'en' as 'en' | 'ar' } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: language.current }) }));
afterEach(() => { cleanup(); language.current = 'en'; });

describe('experiments directory', () => {
  it.each(['en', 'ar'] as const)('lists existing pages in the former navbar order with an experimental notice in %s', current => {
    language.current = current;
    render(<Experiments />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(current === 'ar' ? 'تجارب' : 'Experiments');
    expect(document.body.textContent).toContain(current === 'ar' ? 'تجريبية وغير مكتملة' : 'experimental and incomplete');
    expect(screen.getAllByRole('heading', { level: 2 }).map(heading => heading.textContent)).toEqual(EXPERIMENT_SECTIONS.map(section => section.label[current]));
    const hrefs = screen.getAllByRole('link').map(link => link.getAttribute('href'));
    for (const { href } of getAllNavLinks(current)) {
      if (href === '/people/prophet-muhammad') continue;
      expect(hrefs, href).toContain(href);
    }
    expect(hrefs).toContain('/quizzes/party');
    expect(hrefs).toContain('/quizzes/questions');
    expect(hrefs).not.toContain('/experiments');
  });

  it('requests exclusion from indexing and link following', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
