// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { branchesHref } from '@/lib/quran/branches';
import OpeningSearch from './OpeningSearch';

const navigation = vi.hoisted(() => ({
  search: '',
  push: vi.fn(),
  replace: vi.fn(),
  params: new Map<string, URLSearchParams>(),
}));
const language = vi.hoisted(() => ({ value: 'ar' }));

vi.mock('next/navigation', () => ({
  usePathname: () => '/quran/branches',
  useRouter: () => ({ push: navigation.push, replace: navigation.replace }),
  useSearchParams: () => {
    if (!navigation.params.has(navigation.search)) navigation.params.set(navigation.search, new URLSearchParams(navigation.search));
    return navigation.params.get(navigation.search);
  },
}));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: language.value }) }));

afterEach(() => {
  cleanup();
  navigation.search = '';
  navigation.push.mockClear();
  navigation.replace.mockClear();
  language.value = 'ar';
});

const phrase = (id: string, text: string, count: number, partition?: string) => ({ id, text, count, ...(partition ? { partition } : {}) });
const suggestionOptions = () => within(screen.getByLabelText('عبارات مقترحة')).getAllByRole('option');

describe('opening search journey', () => {
  it('opens a valid suggestion after a range update removes the highlighted candidate', () => {
    const first = phrase('قال رب', 'قَالَ رَبِّ', 4);
    const second = phrase('قال رب اني', 'قَالَ رَبِّ إِنِّي', 2);
    const { rerender } = render(<OpeningSearch top={[]} phrases={[first, second]} current="" />);
    const box = screen.getByRole('combobox');
    fireEvent.change(box, { target: { value: 'قال' } });
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    expect(suggestionOptions()[1].getAttribute('aria-selected')).toBe('true');
    rerender(<OpeningSearch top={[]} phrases={[first]} current="" juz={{ from: 25, to: 30 }} />);
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(navigation.push).toHaveBeenCalledWith(branchesHref(first.id, { from: 25, to: 30 }));
  });

  it.each([
    ['أرأيتم', 'ارءيتم'],
    ['ارايتم', 'ارءيتم'],
    ['أفرأيتم', 'افرءيتم'],
    ['مسؤول', 'مسئول'],
    ['شىء', 'شيء'],
  ])('finds %s against the original phrase spelling %s', (query, id) => {
    render(<OpeningSearch top={[]} phrases={[phrase(id, `النص ${id}`, 2)]} current="" />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: query } });

    expect(suggestionOptions()).toHaveLength(1);
    expect(suggestionOptions()[0].textContent).toContain(id);
  });

  it('keeps typing local and opens the selected phrase with its original ID', () => {
    const target = phrase('ارءيتم', 'أَرَءَيْتُمْ', 2);
    render(<OpeningSearch top={[]} phrases={[target]} current="ان المتقين" juz={{ from: 25, to: 30 }} view={{ grouped: true, page: 4 }} />);
    const box = screen.getByRole('combobox');
    fireEvent.change(box, { target: { value: 'ارايتم' } });

    expect(navigation.push).not.toHaveBeenCalled();
    expect(navigation.replace).not.toHaveBeenCalled();
    expect(suggestionOptions()[0].textContent).toContain('أَرَءَيْتُمْ');
    fireEvent.click(suggestionOptions()[0]);

    expect(navigation.push).toHaveBeenCalledWith(branchesHref('ارءيتم', { from: 25, to: 30 }, { grouped: true, page: 4 }));
  });

  it('uses arrow keys to select a suggestion and Enter to open it', () => {
    const phrases = [phrase('قال رب اني', 'قَالَ رَبِّ أَنِّي', 2, 'two'), phrase('قال رب اني', 'قَالَ رَبِّ إِنِّي', 7, 'seven')];
    render(<OpeningSearch top={[]} phrases={phrases} current="" />);
    const box = screen.getByRole('combobox');
    fireEvent.change(box, { target: { value: 'قال رب اني' } });
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    fireEvent.keyDown(box, { key: 'Enter' });

    expect(navigation.push).toHaveBeenCalledWith(branchesHref('قال رب اني', undefined, { partition: 'seven' }));
  });

  it('offers distinct vocalized choices and counts for an ambiguous legacy phrase', () => {
    const alternatives = [phrase('قال رب اني', 'قَالَ رَبِّ أَنَّىٰ', 2, 'two'), phrase('قال رب اني', 'قَالَ رَبِّ إِنِّي', 7, 'seven')];
    render(<OpeningSearch top={[]} phrases={[]} alternatives={alternatives} current="قال رب اني" view={{ grouped: true, page: 3 }} juz={{ from: 1, to: 9 }} />);
    const choices = within(screen.getByRole('group', { name: /مجموعات العبارة|matching phrase groups/i })).getAllByRole('link');

    expect(choices).toHaveLength(2);
    expect(choices.map(choice => choice.textContent)).toEqual(expect.arrayContaining([expect.stringMatching(/2|٢/), expect.stringMatching(/7|٧/)]));
    expect(choices.map(choice => choice.getAttribute('href'))).toEqual([
      branchesHref('قال رب اني', { from: 1, to: 9 }, { partition: 'two', grouped: true, page: 3 }),
      branchesHref('قال رب اني', { from: 1, to: 9 }, { partition: 'seven', grouped: true, page: 3 }),
    ]);
  });

  it('keeps hamza variants distinct from unrelated consonant mismatches', () => {
    render(<OpeningSearch top={[]} phrases={[phrase('ارءيتم', 'أَرَءَيْتُمْ', 2)]} current="" />);
    const box = screen.getByRole('combobox');
    fireEvent.change(box, { target: { value: 'ازايتم' } });

    expect(screen.getByText('لا عبارة مشتركة تطابق البحث.')).toBeTruthy();
  });
});
