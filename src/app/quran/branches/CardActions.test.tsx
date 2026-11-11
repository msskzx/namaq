import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { CardActions } from './Filters';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
vi.mock('@/components/common/NavigationLoader', () => ({ useNavigatingRouter: () => ({ push: () => {} }) }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: () => {} }) }));

afterEach(cleanup);

const link = (a: number, b: number, label: string) => ({ href: `/quran/compare?a=${a}&b=${b}`, label, labelEn: label });

describe('the tree → compare button', () => {
  it('opens the one surah pair of a tree across two surahs', () => {
    render(<CardActions id="t" text="عبارة" compareLinks={[link(2, 7, 'البقرة مع الأعراف · ٣٥ · ١٩')]} />);
    expect(screen.getByRole('link', { name: 'في المقارنة' }).getAttribute('href')).toBe('/quran/compare?a=2&b=7');
  });

  it('lists the pairs to pick from for a tree across more surahs', () => {
    const { container } = render(<CardActions id="t" text="عبارة" compareLinks={[link(2, 7, 'البقرة مع الأعراف · ٣٥ · ١٩'), link(7, 20, 'الأعراف مع طه · ١٩ · ١١٧')]} />);
    const picker = container.querySelector('details')!;
    expect(picker.querySelector('summary')!.getAttribute('aria-label')).toBe('في المقارنة');
    expect(within(picker).getAllByRole('link').map(item => [item.textContent, item.getAttribute('href')])).toEqual([
      ['البقرة مع الأعراف · ٣٥ · ١٩', '/quran/compare?a=2&b=7'],
      ['الأعراف مع طه · ١٩ · ١١٧', '/quran/compare?a=7&b=20'],
    ]);
  });

  it('has no compare button when compare holds no card of the tree', () => {
    render(<CardActions id="t" text="عبارة" />);
    expect(screen.queryByLabelText('في المقارنة')).toBeNull();
  });
});
