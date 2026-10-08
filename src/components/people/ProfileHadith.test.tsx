// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import ProfileHadith from './ProfileHadith';
import { hadithView } from '@/lib/model/hadithView';
import type { PersonHadith } from '@/lib/modelUnitPeople';

let mockLanguage = 'ar';

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: mockLanguage }),
}));

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <div data-testid="icon" />,
}));

vi.mock('@/components/hadith/IsnadSvg', () => ({
  default: ({ profiles }: { profiles: string[] }) => (
    <div data-testid="isnad-svg">
      <div data-testid="svg-profiles">{profiles.join(',')}</div>
      SVG Diagram
    </div>
  ),
}));

vi.mock('@/components/hadith/PageReader', () => ({
  default: () => <div>Page Reader</div>,
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('ProfileHadith', () => {
  const bukhari = hadithView('bukhari-jibril')!;
  const muslim = hadithView('muslim-jibril')!;

  const singleHadith: PersonHadith[] = [
    {
      unit: 'bukhari-jibril',
      title: 'بَاب سُؤَالِ جِبْرِيلَ النَّبِيَّ',
      book: 'صحيح البخاري',
      kitab: 'كتاب الإيمان',
      bab: 'بَاب سُؤَالِ جِبْرِيلَ النَّبِيَّ',
      roles: ['isnad', 'speaks'],
      view: bukhari,
    },
  ];

  const multipleHadith: PersonHadith[] = [
    {
      unit: 'bukhari-jibril',
      title: 'بَاب سُؤَالِ جِبْرِيلَ النَّبِيَّ',
      book: 'صحيح البخاري',
      kitab: 'كتاب الإيمان',
      bab: 'بَاب سُؤَالِ جِبْرِيلَ النَّبِيَّ',
      roles: ['isnad'],
      view: bukhari,
    },
    {
      unit: 'muslim-jibril',
      title: 'باب بيان الإيمان',
      book: 'صحيح مسلم',
      kitab: 'كتاب الإيمان',
      bab: 'باب بيان الإيمان',
      roles: ['speaks'],
      view: muslim,
    },
  ];

  it('renders nothing when hadith array is empty', () => {
    const { container } = render(<ProfileHadith slug="test-person" hadith={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the hadith heading', () => {
    render(<ProfileHadith slug="test-person" hadith={singleHadith} />);
    expect(screen.getByText(/الأحاديث/)).toBeTruthy();
  });

  it('renders the mode toggle with bubbles as default', () => {
    render(<ProfileHadith slug="test-person" hadith={singleHadith} />);
    const bubblesButton = screen.getByRole('button', { name: /الإسناد والفقاعات/ });
    expect(bubblesButton.className).toContain('bg-amber-400');
  });

  it('displays the place for the current hadith', () => {
    render(<ProfileHadith slug="test-person" hadith={singleHadith} />);
    const place = screen.getByText(/صحيح البخاري.*كتاب الإيمان/);
    expect(place).toBeTruthy();
  });

  it('shows role badges for all roles in the current hadith', () => {
    render(<ProfileHadith slug="test-person" hadith={singleHadith} />);
    expect(screen.getByText(/في الإسناد|In the isnad/)).toBeTruthy();
    expect(screen.getByText(/يتكلم|Speaks/)).toBeTruthy();
  });

  it('links the title to the hadith unit page', () => {
    render(<ProfileHadith slug="test-person" hadith={singleHadith} />);
    const links = screen.getAllByRole('link');
    const hadithLink = links.find((l) => (l as HTMLAnchorElement).href.includes('/hadith/bukhari-jibril'));
    expect(hadithLink).toBeTruthy();
  });

  it('does not show the compiler remark in the rendered output', () => {
    render(<ProfileHadith slug="test-person" hadith={singleHadith} />);
    const h2s = screen.queryAllByRole('heading', { level: 2 });
    const remarkHeading = h2s.find((h) => h.textContent?.includes('تعليق'));
    expect(remarkHeading).toBeUndefined();
  });

  it('switches to full text mode when the button is clicked', () => {
    render(<ProfileHadith slug="test-person" hadith={singleHadith} />);
    const textButton = screen.getByRole('button', { name: /النص كاملاً/ });
    fireEvent.click(textButton);
    expect(textButton.className).toContain('bg-amber-400');
  });

  it('keeps mode when rendered again', () => {
    const { rerender } = render(<ProfileHadith slug="test-person" hadith={multipleHadith} />);
    const textButton = screen.getByRole('button', { name: /النص كاملاً/ });
    fireEvent.click(textButton);
    expect(textButton.className).toContain('bg-amber-400');

    rerender(<ProfileHadith slug="test-person" hadith={multipleHadith} />);
    expect(textButton.className).toContain('bg-amber-400');
  });

  it('renders with multiple hadith', () => {
    render(<ProfileHadith slug="test-person" hadith={multipleHadith} />);
    expect(screen.getByText(/الأحاديث/)).toBeTruthy();
  });

  it('highlights the profile owner bubbles with the given slug', () => {
    const hadithWithAgent: PersonHadith[] = [
      {
        unit: 'muslim-jibril',
        title: 'باب بيان الإيمان',
        book: 'صحيح مسلم',
        kitab: 'كتاب الإيمان',
        bab: 'باب بيان الإيمان',
        roles: ['speaks'],
        view: muslim,
      },
    ];
    render(<ProfileHadith slug="umar-ibn-al-khattab" hadith={hadithWithAgent} />);
    const bubbles = screen.queryAllByText(/يتكلم/);
    expect(bubbles.length).toBeGreaterThan(0);
    const roundedBubbles = screen.queryAllByText((content: string, element: Element | null) => {
      return element?.className.includes('rounded-2xl') ?? false;
    });
    const highlightedBubbles = roundedBubbles.filter((el) =>
      el.className.includes('ring-amber-500'),
    );
    const unhighlightedBubbles = roundedBubbles.filter(
      (el) => !el.className.includes('ring-amber-500'),
    );
    expect(highlightedBubbles.length).toBeGreaterThan(0);
    expect(unhighlightedBubbles.length).toBeGreaterThan(0);
  });

  it('shows the correct title for each hadith', () => {
    render(<ProfileHadith slug="test-person" hadith={singleHadith} />);
    const titleLink = screen.getByRole('link', { name: /بَاب سُؤَالِ جِبْرِيلَ النَّبِيَّ/ });
    expect(titleLink).toBeTruthy();
    expect((titleLink as HTMLAnchorElement).href).toContain('/hadith/bukhari-jibril');
  });

  it('renders the hadith body without the remark', () => {
    render(<ProfileHadith slug="test-person" hadith={singleHadith} />);
    expect(screen.queryByText('تعليق')).toBeNull();
    expect(screen.getByTestId('isnad-svg')).toBeTruthy();
  });

  it('includes the isnad SVG in bubbles mode by default', () => {
    render(<ProfileHadith slug="test-person" hadith={singleHadith} />);
    expect(screen.getByTestId('isnad-svg')).toBeTruthy();
  });

  it('shows different badges for different roles', () => {
    const hadithWithMentioned: PersonHadith[] = [
      {
        unit: 'bukhari-jibril',
        title: 'test',
        book: 'test',
        kitab: null,
        bab: null,
        roles: ['mentioned'],
        view: bukhari,
      },
    ];
    render(<ProfileHadith slug="test-person" hadith={hadithWithMentioned} />);
    expect(screen.getByText(/مذكور|Mentioned/)).toBeTruthy();
  });

  it('navigates with pagination Next and Previous buttons', () => {
    render(<ProfileHadith slug="test-person" hadith={multipleHadith} />);
    const buttons = screen.getAllByRole('button');
    const nextButton = buttons.find((btn) => btn.textContent?.includes('التالي'));
    const prevButton = buttons.find((btn) => btn.textContent?.includes('السابق'));

    expect(screen.getByText('في الإسناد')).toBeTruthy();

    if (nextButton) fireEvent.click(nextButton);
    expect(screen.getByText('يتكلم')).toBeTruthy();
    expect(screen.queryByText('في الإسناد')).toBeNull();

    if (prevButton) fireEvent.click(prevButton);
    expect(screen.getByText('في الإسناد')).toBeTruthy();
  });

  it('keeps the selected mode after navigating with pagination', () => {
    render(<ProfileHadith slug="test-person" hadith={multipleHadith} />);
    const buttons = screen.getAllByRole('button');
    const textButton = buttons.find((btn) => btn.textContent?.includes('النص كاملاً'));
    fireEvent.click(textButton!);
    expect(textButton!.className).toContain('bg-amber-400');

    const nextButton = buttons.find((btn) => btn.textContent?.includes('التالي'));
    fireEvent.click(nextButton!);

    const textButtonAfter = screen.getAllByRole('button').find((btn) =>
      btn.textContent?.includes('النص كاملاً'),
    );
    expect(textButtonAfter!.className).toContain('bg-amber-400');
  });

  it('shows valid page labels when hadith list is shortened', () => {
    const { rerender } = render(<ProfileHadith slug="test-person" hadith={multipleHadith} />);
    const buttons = screen.getAllByRole('button');
    const nextButton = buttons.find((btn) => btn.textContent?.includes('التالي'));
    fireEvent.click(nextButton!);
    expect(screen.getByText('يتكلم')).toBeTruthy();

    const shortenedHadith: PersonHadith[] = [singleHadith[0]];
    rerender(<ProfileHadith slug="test-person" hadith={shortenedHadith} />);

    const pageLabel = screen.queryByText(/Page 2 of 2|صفحة 2 من 2/);
    expect(pageLabel).toBeNull();
    expect(screen.getByText('في الإسناد')).toBeTruthy();
  });

  it('shows exact Arabic badge texts for all roles', () => {
    render(<ProfileHadith slug="test-person" hadith={singleHadith} />);
    expect(screen.getByText('في الإسناد')).toBeTruthy();
    expect(screen.getByText('يتكلم')).toBeTruthy();
  });

  it('shows exact English badge texts for all roles', () => {
    mockLanguage = 'en';
    render(<ProfileHadith slug="test-person" hadith={singleHadith} />);
    expect(screen.getByText('In the isnad')).toBeTruthy();
    expect(screen.getByText('Speaks')).toBeTruthy();
    mockLanguage = 'ar';
  });
});
