import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { homeQuranSections } from '@/lib/homeQuranSections';
import HomeQuranWidget from './HomeQuranWidget';

const { state } = vi.hoisted(() => ({ state: { language: 'ar' } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => state }));
const sections = homeQuranSections([
  { number: 1, name: 'الفاتحة', nameTransliterated: 'Al-Fatihah' },
  { number: 2, name: 'البقرة', nameTransliterated: 'Al-Baqarah' },
  { number: 114, name: 'الناس', nameTransliterated: 'An-Nas' },
]);

afterEach(() => { cleanup(); state.language = 'ar'; });

describe('homepage Quran widget', () => {
  it('requires a selection and sends both actions to the chosen surah', () => {
    render(<HomeQuranWidget sections={sections} />);
    expect(screen.getByRole('button', { name: 'اقرأ' }).hasAttribute('disabled')).toBe(true);
    fireEvent.click(screen.getByRole('radio', { name: 'البقرة' }));
    expect(screen.getByRole('link', { name: 'اقرأ' }).getAttribute('href')).toBe('/quran/read/ayah/2/1');
    expect(screen.getByRole('link', { name: 'استكشف المتشابهات' }).getAttribute('href')).toBe('/quran/branches?s=2');
  });

  it('clears the previous selection when switching to juz and uses the exact juz start', () => {
    render(<HomeQuranWidget sections={sections} />);
    fireEvent.click(screen.getByRole('radio', { name: 'البقرة' }));
    fireEvent.click(screen.getByRole('button', { name: 'الأجزاء' }));
    expect(screen.getByRole('button', { name: 'اقرأ' }).hasAttribute('disabled')).toBe(true);
    fireEvent.click(screen.getByRole('radio', { name: 'الجزء ٢' }));
    expect(screen.getByRole('link', { name: 'اقرأ' }).getAttribute('href')).toBe('/quran/read/ayah/2/142');
    expect(screen.getByRole('link', { name: 'استكشف المتشابهات' }).getAttribute('href')).toBe('/quran/branches?juzFrom=2&juzTo=2');
  });

  it('finds sections by Arabic numerals and recovers after an empty search', () => {
    render(<HomeQuranWidget sections={sections} />);
    fireEvent.click(screen.getByRole('radio', { name: 'البقرة' }));
    const search = screen.getByRole('searchbox', { name: 'ابحث عن سورة' });
    fireEvent.change(search, { target: { value: '١١٤' } });
    expect(screen.getByRole('radio', { name: 'الناس' })).toBeTruthy();
    expect(screen.queryByRole('radio', { name: 'البقرة' })).toBeNull();
    expect(screen.getByRole('button', { name: 'اقرأ' }).hasAttribute('disabled')).toBe(true);
    fireEvent.change(search, { target: { value: 'xyzxyz' } });
    expect(screen.getByRole('status').textContent).toBe('لا توجد نتيجة مطابقة.');
    fireEvent.change(search, { target: { value: '' } });
    expect(screen.getByRole('radio', { name: 'البقرة' })).toBeTruthy();
  });

  it('supports English controls while retaining Arabic surah content', () => {
    state.language = 'en';
    render(<HomeQuranWidget sections={sections} />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Find a surah' }), { target: { value: 'baqarah' } });
    fireEvent.click(screen.getByRole('radio', { name: 'البقرة' }));
    expect(screen.getByRole('link', { name: 'Read' }).getAttribute('href')).toBe('/quran/read/ayah/2/1');
    fireEvent.click(screen.getByRole('button', { name: 'Juz' }));
    fireEvent.change(screen.getByRole('searchbox', { name: 'Find a juz' }), { target: { value: 'Juz 30' } });
    expect(screen.getAllByRole('radio')).toHaveLength(1);
    fireEvent.click(screen.getByRole('radio', { name: 'Juz 30' }));
    expect(screen.getByRole('link', { name: 'Read' }).getAttribute('href')).toBe('/quran/read/ayah/78/1');
  });

  it('finds a juz by its displayed Arabic label', () => {
    render(<HomeQuranWidget sections={sections} />);
    fireEvent.click(screen.getByRole('button', { name: 'الأجزاء' }));
    fireEvent.change(screen.getByRole('searchbox', { name: 'ابحث عن جزء' }), { target: { value: 'الجزء ٣٠' } });
    expect(screen.getAllByRole('radio')).toHaveLength(1);
    expect(screen.getByRole('radio', { name: 'الجزء ٣٠' })).toBeTruthy();
  });
});
