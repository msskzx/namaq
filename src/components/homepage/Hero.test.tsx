import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Hero from './Hero';

const { state } = vi.hoisted(() => ({ state: { language: 'ar' } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => state }));
afterEach(cleanup);
describe('homepage introduction', () => {
  it.each(['ar', 'en'])('introduces visual Quran learning and both entry modes in %s', language => {
    state.language = language;
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(language === 'ar' ? 'الآيات' : 'ayat');
    expect(screen.getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(['/quran/branches', '/quizzes?topic=BRANCHES']);
  });
});
