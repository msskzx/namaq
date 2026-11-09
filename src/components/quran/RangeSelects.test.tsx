import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ScopeFields, type ScopeDraft } from './ScopeFilter';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));

afterEach(cleanup);

const allSurahs = Array.from({ length: 114 }, (_, i) => ({ number: i + 1, name: i === 69 ? 'سُورَةُ المَعَارِجِ' : i === 1 ? 'سُورَةُ البَقَرَةِ' : `سورة ${i + 1}` }));

function Harness({ start }: { start: ScopeDraft }) {
  const [draft, setDraft] = React.useState(start);
  return <><ScopeFields draft={draft} onChange={setDraft} range={null} allSurahs={allSurahs} /><output>{draft.values.join('-')}</output></>;
}

describe('surah and juz range lists', () => {
  it('names each surah beside its number', () => {
    render(<Harness start={{ unit: 'surah', values: ['70', '114'] }} />);
    const from = screen.getByRole('combobox', { name: 'From chapter' }) as HTMLSelectElement;
    expect(from.selectedOptions[0].textContent).toBe('70 المعارج');
  });

  it('starts the to list at the from surah and pulls to along', () => {
    render(<Harness start={{ unit: 'surah', values: ['1', '20'] }} />);
    fireEvent.change(screen.getByRole('combobox', { name: 'From chapter' }), { target: { value: '30' } });
    expect(screen.getByText('30-30')).toBeTruthy();
    const to = screen.getByRole('combobox', { name: 'To chapter' }) as HTMLSelectElement;
    expect(to.options[0].value).toBe('30');
    expect(to.options).toHaveLength(85);
  });

  it('turns a backwards range from the address bar into the one the lists show', () => {
    render(<Harness start={{ unit: 'surah', values: ['50', '10'] }} />);
    expect(screen.getByText('50-50')).toBeTruthy();
  });

  it('names the surah and ayah each juz starts at', () => {
    render(<Harness start={{ unit: 'juz', values: ['2', '30'] }} />);
    const from = screen.getByRole('combobox', { name: 'From juz' }) as HTMLSelectElement;
    expect(from.selectedOptions[0].textContent).toBe('2 · البقرة 142');
  });
});
