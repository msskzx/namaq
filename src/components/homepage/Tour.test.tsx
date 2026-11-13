import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { tourRecitePage, tourStory, tourTree, TOUR_RECITE } from '@/lib/tourTree';
import { TOUR_AYAH } from '@shared/quran/tour';
import Tour, { TOUR_SEEN } from './Tour';

const { nav } = vi.hoisted(() => ({ nav: { search: '', replace: vi.fn(), refresh: vi.fn() } }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: nav.replace, refresh: nav.refresh }),
  useSearchParams: () => new URLSearchParams(nav.search),
}));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
vi.mock('@/app/quran/branches/AyahCards', () => ({ default: ({ ayahKeys }: { ayahKeys: string[] }) => <div data-testid="matrix">{ayahKeys.join(' ')}</div> }));

const tour = tourTree()!;
const names = { 15: 'الحجر', 44: 'الدخان', 51: 'الذاريات', 52: 'الطور', 54: 'القمر', 77: 'المرسلات' };

afterEach(() => { cleanup(); localStorage.clear(); nav.search = ''; nav.replace.mockClear(); });

describe('first-visit tour', () => {
  it('builds the app tour tree, which holds the ayah the app recitation starts from', () => {
    expect(tour.ayat.map(ayah => ayah.key)).toContain(TOUR_AYAH);
  });

  it('waits for a tap on a node, shows its ayah, then for a view choice, and is not shown again', () => {
    const { container } = render(<Tour tour={tour} names={names} />);
    fireEvent.click(screen.getByRole('button', { name: /ابدأ/ }));
    expect(screen.getByTestId('matrix').textContent).toContain(TOUR_AYAH);
    fireEvent.click(screen.getByRole('button', { name: /التالي/ }));
    expect(screen.queryByRole('button', { name: /التالي/ })).toBeNull();
    fireEvent.click(container.querySelector<HTMLElement>(`[data-node][data-keys="${TOUR_AYAH}"]`)!);
    expect(screen.getByText(tour.ayat.find(ayah => ayah.key === TOUR_AYAH)!.words.join(' '))).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /التالي/ }));
    expect(screen.queryByRole('button', { name: /إلى الرئيسية/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'مصفوفة' }));
    fireEvent.click(screen.getByRole('button', { name: /إلى الرئيسية/ }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(localStorage.getItem(TOUR_SEEN)).toBe('1');
    cleanup();
    render(<Tour tour={tour} names={names} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('plays again from the settings link from a clean start, and skipping every step ends it', () => {
    localStorage.setItem(TOUR_SEEN, '1');
    nav.search = 'tour=1';
    const { container, rerender } = render(<Tour tour={tour} names={names} />);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /ابدأ/ }));
    fireEvent.click(screen.getByRole('button', { name: /ابدأ/ }));
    fireEvent.click(screen.getByRole('button', { name: 'تخطَّ' }));
    fireEvent.click(container.querySelector<HTMLElement>(`[data-node][data-keys="${TOUR_AYAH}"]`)!);
    fireEvent.click(screen.getByRole('button', { name: 'تخطَّ' }));
    fireEvent.click(screen.getByRole('button', { name: 'تخطَّ' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(nav.replace).toHaveBeenCalledWith('/', { scroll: false });
    nav.search = '';
    rerender(<Tour tour={tour} names={names} />);
    nav.search = 'tour=1';
    rerender(<Tour tour={tour} names={names} />);
    fireEvent.click(screen.getByRole('button', { name: /ابدأ/ }));
    expect(screen.getByRole('heading', { name: 'المصفوفة' })).toBeTruthy();
  });

  it('ends with Adam’s story map, which waits for a dot, and recite on the last page, which waits for a tap', async () => {
    const recite = { ...TOUR_RECITE, data: await tourRecitePage(), names: { 111: 'سورة المسد', 112: 'سورة الإخلاص', 113: 'سورة الفلق', 114: 'سورة الناس' } };
    const { container } = render(<Tour tour={null} story={tourStory()} recite={recite} names={names} />);
    fireEvent.click(screen.getByRole('button', { name: /ابدأ/ }));
    expect(screen.getByRole('heading', { name: 'قصص الأنبياء' })).toBeTruthy();
    expect(screen.getByText('اضغط نقطة لترى آياتها')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /التالي/ })).toBeNull();
    fireEvent.click(container.querySelector<HTMLElement>('[data-dot]')!);
    expect(screen.getByRole('heading', { level: 2, name: tourStory().events[0].title })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'التالي' }));
    expect(screen.getByRole('heading', { name: 'سمّع من المصحف' })).toBeTruthy();
    const veiled = () => container.querySelectorAll('[data-veiled]').length;
    const before = veiled();
    expect(before).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: /إلى الرئيسية/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'اضغط لتظهر الآية التالية' }));
    expect(veiled()).toBeLessThan(before);
    fireEvent.click(screen.getByRole('button', { name: /إلى الرئيسية/ }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
