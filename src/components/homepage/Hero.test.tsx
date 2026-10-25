import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Hero from './Hero';
import Exploration from './Exploration';

const { language } = vi.hoisted(() => ({ language: { current: 'ar' as 'en' | 'ar' } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: language.current }) }));
afterEach(() => { cleanup(); language.current = 'ar'; });

describe('homepage introduction', () => {
  it.each(['ar', 'en'] as const)('keeps the introduction free of search and duplicate actions in %s', current => {
    language.current = current;
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('نَمَق');
    expect(screen.queryByRole('search')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it.each(['ar', 'en'] as const)('states the goal and that every claim carries its evidence in %s', current => {
    language.current = current;
    render(<Hero />);
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
    expect(document.querySelectorAll('section > p')).toHaveLength(1);
    expect(document.body.textContent).toContain(current === 'ar' ? 'مدعومة بالدليل' : 'backed by evidence');
  });

  it.each(['ar', 'en'] as const)('keeps every subject accessible in %s', current => {
    language.current = current;
    render(<Exploration />);
    expect(screen.getByRole('heading', { name: current === 'ar' ? 'أبواب الاستكشاف' : 'Ways to explore' })).toBeTruthy();
    expect(screen.getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(['/quran', '/hadith', '/people', '/sources', '/quizzes']);
    expect(screen.getAllByRole('heading', { level: 3 }).map(heading => heading.textContent)).toEqual(current === 'ar'
      ? ['القرآن', 'الحديث', 'التراجم', 'المصادر', 'الاختبارات']
      : ['Quran', 'Hadith', 'Biographies', 'Sources', 'Quizzes']);
  });
});
