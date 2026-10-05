// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ModelEntries from './ModelEntries';
import type { ModelEntryDto } from '@/lib/modelView';

const { language } = vi.hoisted(() => ({ language: { current: 'ar' as 'en' | 'ar' } }));
vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: language.current }),
}));

afterEach(() => {
  cleanup();
  language.current = 'ar';
});

const entry = (over: Partial<ModelEntryDto>): ModelEntryDto => ({
  unit: 'u',
  assertionId: 'a',
  predicate: 'name.kunya',
  parts: ['أَبُو عَبْدِ اللهِ'],
  text: 'أَبُو عَبْدِ اللهِ',
  parsed: null,
  classified: null,
  object: null,
  objectMention: null,
  origins: [{ author: 'al-dhahabi' }],
  spanIds: ['s1'],
  status: 'PROPOSED',
  identification: 'PROPOSED',
  reviewed: false,
  ...over,
});

describe('ModelEntries', () => {
  it('shows each value with who said it, its status and its citation, grouped by what it is', () => {
    render(
      <ModelEntries
        entries={[
          entry({ assertionId: 'b', predicate: 'islam.age', parsed: 16, parts: ['x'] }),
          entry({
            assertionId: 'c',
            predicate: 'islam.age',
            parsed: 8,
            parts: ['y'],
            origins: [{ mention: 'عُرْوَةَ' }],
          }),
          entry({}),
        ]}
        spans={[
          {
            unit: 'u',
            spanId: 's1',
            witness: 'siyar-alam-al-nubala-risalah',
            volume: 4,
            page: '41',
          },
        ]}
      />,
    );
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'الكنية',
      'عمره عند إسلامه',
    ]);
    expect(screen.getByText('أَبُو عَبْدِ اللهِ').getAttribute('lang')).toBe('ar');
    expect(screen.getByText('16 سنة').getAttribute('lang')).toBeNull();
    expect(screen.getByText('16 سنة')).toBeTruthy();
    expect(screen.getByText('8 سنة')).toBeTruthy();
    expect(screen.getByText('ورد عن: عُرْوَةَ')).toBeTruthy();
    expect(screen.getAllByText('غير مراجَع')).toHaveLength(3);
    expect(screen.getAllByText('سير أعلام النبلاء، مج 4، ص 41').length).toBeGreaterThan(0);
  });

  it('says in English that none of it is reviewed', () => {
    language.current = 'en';
    render(<ModelEntries entries={[entry({ predicate: 'sex', classified: 'MALE' })]} spans={[]} />);
    expect(screen.getByText('Male')).toBeTruthy();
    expect(screen.getByText('Not reviewed')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2 }).textContent).toContain('experimental');
  });
});
