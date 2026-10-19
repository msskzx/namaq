// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import TextCompare from './TextCompare';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: () => {} }) }));
vi.mock('@/lib/prisma', () => ({
  prisma: {
    ayah: { findMany: async () => Array.from({ length: 20 }, () => ({ text: 'بسم الله' })) },
    surah: { findMany: async () => Array.from({ length: 114 }, (_, i) => ({ number: i + 1, name: `سورة ${i + 1}` })) },
  },
}));
vi.mock('./SimilarAyat', () => ({ default: () => null }));

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

afterEach(cleanup);

const value = (label: string) => label.startsWith('السورة')
  ? (screen.getByRole('combobox', { name: label }).parentElement!.querySelector('input[type=hidden]') as HTMLInputElement).value
  : (screen.getByRole('spinbutton', { name: label }) as HTMLInputElement).value;

describe('TextCompare', () => {
  it('shows the newly chosen surahs and ranges in its fields when the page moves to another comparison', async () => {
    const { rerender } = render(await TextCompare({ query: { a: '56', b: '69' } }));
    rerender(await TextCompare({ query: { a: '2', af: '3', at: '5', b: '3', bf: '4', bt: '6' } }));
    expect(['السورة الأولى', 'من آية (الأولى)', 'إلى آية (الأولى)', 'السورة الثانية', 'من آية (الثانية)', 'إلى آية (الثانية)'].map(value)).toEqual(['2', '3', '5', '3', '4', '6']);
  });
});
