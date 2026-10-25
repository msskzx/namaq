import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import Homepage from './Homepage';
import spread from '../quran/PageSpread.module.css';
import { getHomePreviews } from '@/lib/homePreviewData';

const { language } = vi.hoisted(() => ({ language: { current: 'ar' as 'en' | 'ar' } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: language.current }) }));
vi.mock('./HeroGraphPreview', () => ({ default: () => <div data-testid="family-preview" /> }));
vi.mock('./NasabPreview', () => ({ default: () => <div data-testid="nasab-preview" /> }));
vi.mock('@/lib/modelUnits', () => ({ loadUnitView: async (id: string) => {
  const { hadithView } = await import('@/lib/model/hadithView');
  return hadithView(id);
} }));
afterEach(() => { cleanup(); language.current = 'ar'; });

describe('homepage features', () => {
  it.each(['ar', 'en'] as const)('gives each of seven previews an explicit action and an unlinked heading in %s', async current => {
    language.current = current;
    render(<Homepage data={await getHomePreviews()} />);
    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings).toHaveLength(8);
    const hrefs = headings.slice(0, 7).map(heading => {
      expect(within(heading).queryByRole('link')).toBeNull();
      return within(heading.closest('section')!).getByRole('link', { name: `${current === 'ar' ? 'افتح' : 'Open'} ${heading.textContent}` }).getAttribute('href');
    });
    expect(hrefs[0]).toContain('/quran/branches?o=');
    expect(hrefs[1]).toContain('af=41&at=45');
    expect(hrefs[2]).toBe('/quran/prophets/musa');
    expect(hrefs[3]).toContain('/graphs?subject=');
    expect(hrefs[4]).toBe('/hadith/muslim-jibril');
    expect(hrefs[5]).toContain('/nasab?subject=');
    expect(hrefs[6]).toBe('/quizzes');
    expect(screen.queryByRole('table')).toBeNull();
    expect(screen.getByRole('article', { name: 'الشعراء ٤١–٤٥' })).toBeTruthy();
    expect(screen.getByRole('article', { name: 'الأعراف ١١٣–١١٧' })).toBeTruthy();
    for (const article of within(screen.getByRole('region', { name: current === 'ar' ? 'مقارنة الآيات' : 'Compare Quranic passages' })).getAllByRole('article')) expect(article.querySelectorAll('div[lang=ar] > p')).toHaveLength(5);
    const first = screen.getByRole('article', { name: 'الشعراء ٤١–٤٥' }).querySelector('div[lang=ar] > p')!;
    const rooted = Array.from(first.querySelectorAll('mark')).filter(m => m.className.includes(spread.root)).map(m => m.textContent);
    expect(rooted.slice(0, 2)).toEqual(['جَاۤءَ', 'لِفِرۡعَوۡنَ']);
    expect(rooted).toHaveLength(3);
    expect(first.querySelectorAll('mark').length).toBeGreaterThan(rooted.length);
    expect(headings.every(heading => heading.querySelector('svg') === null)).toBe(true);
    expect(screen.queryByText(/28:3/)).toBeNull();
    const milestones = within(screen.getByRole('region', { name: current === 'ar' ? 'محطات قصة موسى' : 'Musa timeline' })).getAllByRole('listitem');
    expect(within(milestones[0]).getByText(current === 'ar' ? '٣ سور' : '3 surahs')).toBeTruthy();
    expect(within(milestones[1]).getByText(current === 'ar' ? 'سورة واحدة' : '1 surah')).toBeTruthy();
    const previews = document.querySelectorAll('section[id]:not([aria-labelledby=home-title])');
    expect(previews).toHaveLength(7);
    for (const section of previews) {
      const paragraphs = section.querySelectorAll(':scope > header > div > p');
      const examplePrefix = current === 'ar' ? 'مثال:' : 'Example:';
      expect(paragraphs).toHaveLength(2);
      expect(paragraphs[0].textContent).not.toBe('');
      expect(paragraphs[0].textContent?.startsWith(examplePrefix)).toBe(false);
      expect(paragraphs[1].textContent?.startsWith(examplePrefix)).toBe(true);
    }
    expect(screen.queryByRole('search')).toBeNull();
    expect(screen.queryByRole('note')).toBeNull();
    expect(screen.getByTestId('family-preview')).toBeTruthy();
    expect(screen.getByTestId('nasab-preview')).toBeTruthy();
  });

  it('gives immediate feedback, prevents a second answer and can reset the sample question', async () => {
    const data = await getHomePreviews();
    render(<Homepage data={data} />);
    const choices = data.question!.choices;
    const incorrect = choices.find(choice => choice.value !== data.question!.answer)!;
    const correct = choices.find(choice => choice.value === data.question!.answer)!;
    const picked = screen.getByRole('button', { name: incorrect.labelArabic });
    picked.focus();
    fireEvent.click(picked);
    expect(screen.getByRole('status').textContent).toContain(`الإجابة الصحيحة: ${correct.labelArabic}`);
    expect(document.activeElement).toBe(picked);
    expect(picked.getAttribute('data-result')).toBe('incorrect');
    expect(screen.getByRole('button', { name: correct.labelArabic }).getAttribute('data-result')).toBe('correct');
    expect(screen.getByRole('status').getAttribute('data-result')).toBe('incorrect');
    expect(screen.getByRole('button', { name: correct.labelArabic }).getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: correct.labelArabic }));
    expect(screen.getByRole('status').textContent).toContain(`الإجابة الصحيحة: ${correct.labelArabic}`);
    fireEvent.click(screen.getByRole('button', { name: 'حاول مجددًا' }));
    expect(picked.hasAttribute('data-result')).toBe(false);
    expect(screen.getByRole('button', { name: correct.labelArabic }).hasAttribute('data-result')).toBe(false);
    expect(screen.getByRole('status').hasAttribute('data-result')).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: correct.labelArabic }));
    expect(screen.getByRole('status').textContent).toBe('إجابة صحيحة.');
    expect(screen.getByRole('status').getAttribute('data-result')).toBe('correct');
  });
});
