// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { branch, branchesHref, startingWith, variants, type BranchAyah } from '@/lib/quran/branches';
import BranchTree from './BranchTree';
import ayat from './ayat.json';
import { inJuzRange } from '@/lib/quran/juz';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

afterEach(cleanup);

const tree = {
  words: ['إِنَّ', 'ٱلْمُتَّقِينَ', 'فِى'],
  ayat: [],
  children: [
    { words: ['جَنَّـٰتٍۢ', 'وَعُيُونٍ'], ayat: ['15:45', '51:15'], children: [] },
    { words: ['مَقَامٍ', 'أَمِينٍۢ'], ayat: ['44:51'], children: [] },
  ],
};

describe('BranchTree', () => {
  it('draws the shared words once and each branch after them', () => {
    render(<BranchTree tree={tree} names={{ 15: 'سُورَةُ الحِجۡرِ', 44: 'سُورَةُ الدُّخَانِ', 51: 'سُورَةُ الذَّارِيَاتِ' }} pages={{ '15:45': 265, '44:51': 498, '51:15': 521 }} />);
    expect(screen.getAllByText('إِنَّ ٱلْمُتَّقِينَ فِى')).toHaveLength(1);
    expect(screen.getByText('جَنَّـٰتٍۢ وَعُيُونٍ')).toBeTruthy();
    expect(screen.getByText('مَقَامٍ أَمِينٍۢ')).toBeTruthy();
  });

  it('joins the juz 30 opening variants to their branches without an empty box', () => {
    const group = startingWith(ayat as BranchAyah[], 'اما من').filter(a => inJuzRange(a.key, { from: 30, to: 30 }));
    const tree = branch(group);
    const { container } = render(<BranchTree tree={tree} variants={variants(group)} names={{}} pages={Object.fromEntries(group.map(a => [a.key, a.page]))} />);
    expect(screen.getByRole('list', { name: 'صيغ الكلمة الأولى' }).children).toHaveLength(3);
    expect([...container.querySelectorAll('div')].filter(node => !node.textContent?.trim())).toHaveLength(0);
    expect(container.querySelectorAll('a[href^="/quran/read/"]')).toHaveLength(group.length);
    expect(screen.getByText('طَغَىٰ')).toBeTruthy();
  });

  it('keeps an ayah reference when all root words are shown as variants', () => {
    render(<BranchTree tree={{ words: ['قال'], ayat: ['1:1'], children: [] }} variants={[{ word: 'قال', conj: '', keys: ['1:1'], id: 'قال' }]} names={{}} pages={{ '1:1': 1 }} />);
    expect(screen.getByRole('link', { name: '١:١' }).getAttribute('href')).toBe('/quran/read/1?a=1:1');
  });

  it('links every ayah to its exact position on the reader page', () => {
    render(<BranchTree tree={tree} names={{ 15: 'سُورَةُ الحِجۡرِ', 51: 'سُورَةُ الذَّارِيَاتِ' }} pages={{ '15:45': 265, '44:51': 498, '51:15': 521 }} />);
    expect(screen.getByRole('link', { name: 'سُورَةُ الذَّارِيَاتِ ١٥' }).getAttribute('href')).toBe('/quran/read/521?a=51:15');
    expect(screen.getByRole('link', { name: 'سُورَةُ الحِجۡرِ ٤٥' }).getAttribute('href')).toBe('/quran/read/265?a=15:45');
    expect(screen.getByRole('link', { name: '٤٤:٥١' }).getAttribute('href')).toBe('/quran/read/498?a=44:51');
    const references = screen.getByRole('link', { name: 'سُورَةُ الحِجۡرِ ٤٥' }).parentElement!.parentElement!;
    expect(within(references).getAllByText('·')).toHaveLength(1);
    expect(references.textContent?.startsWith('·')).toBe(false);
  });

  it('targets al-Qamar ayah 54 on page 531', () => {
    render(<BranchTree tree={{ words: ['إِنَّ', 'ٱلْمُتَّقِينَ'], ayat: ['54:54'], children: [] }} names={{ 54: 'سُورَةُ القَمَرِ' }} pages={{ '54:54': 531 }} />);
    expect(screen.getByRole('link', { name: 'سُورَةُ القَمَرِ ٥٤' }).getAttribute('href')).toBe('/quran/read/531?a=54:54');
    expect(screen.queryByText('·')).toBeNull();
  });

  it('links a branch to the tree of its own phrase, but not the root or a leaf', () => {
    const deep = { ...tree, children: [{ words: ['جَنَّـٰتٍۢ'], ayat: [], children: tree.children }] };
    render(<BranchTree tree={deep} names={{}} pages={{}} />);
    expect(screen.getByRole('link', { name: 'جَنَّـٰتٍۢ' }).getAttribute('href')).toBe(branchesHref('ان المتقين في جنت'));
    expect(screen.queryByRole('link', { name: 'إِنَّ ٱلْمُتَّقِينَ فِى' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'جَنَّـٰتٍۢ وَعُيُونٍ' })).toBeNull();
  });

  it('draws each first word before the shared words and tags every ayah with its own', () => {
    const merged = {
      words: ['يَطُوفُ', 'عَلَيْهِمْ'],
      ayat: [],
      children: [{ words: ['وِلْدَٰنٌ', 'مُّخَلَّدُونَ'], ayat: ['56:17', '76:19'], children: [] }],
    };
    const variants = [
      { word: 'يَطُوفُ', conj: '', keys: ['56:17'], id: 'يطوف عليهم' },
      { word: 'وَيَطُوفُ', conj: 'و', keys: ['76:19'], id: 'يطوف عليهم' },
    ];
    render(<BranchTree tree={merged} variants={variants} names={{ 56: 'الواقعة', 76: 'الإنسان' }} pages={{ '56:17': 535, '76:19': 579 }} juz={{ from: 26, to: 30 }} />);
    const firstWords = screen.getByRole('list', { name: 'صيغ الكلمة الأولى' });
    expect(firstWords.textContent).toBe('يَطُوفُوَيَطُوفُ');
    expect(screen.getByText('عَلَيْهِمْ')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'وَيَطُوفُ' }).getAttribute('href')).toBe(branchesHref('يطوف عليهم', { from: 26, to: 30 }, { spelling: 'وَيَطُوفُ' }));
    expect(screen.getByRole('link', { name: 'يَطُوفُ' }).getAttribute('href')).toBe(branchesHref('يطوف عليهم', { from: 26, to: 30 }, { spelling: 'يَطُوفُ' }));
    expect(screen.getByRole('link', { name: 'الإنسان ١٩' }).nextElementSibling?.textContent).toBe('وَيَطُوفُ');
    expect(screen.getByRole('link', { name: 'الواقعة ١٧' }).nextElementSibling?.textContent).toBe('يَطُوفُ');
  });

  it('hides leaf alternatives until expanded and lists every complete original in its own row', () => {
    const group = startingWith(ayat as BranchAyah[], 'ان مع العسر');
    render(<BranchTree tree={branch(group)} variants={variants(group)} names={{ 94: 'الشرح' }} pages={Object.fromEntries(group.map(a => [a.key, a.page]))} />);
    const toggle = screen.getByRole('button', { name: 'عرض صيغ الكتابة الأصلية' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    for (const a of group) {
      const list = document.getElementById(toggle.getAttribute('aria-controls')!)!;
      const row = within(list).getByText(a.words.slice(1).join(' ')).closest('li')!;
      expect(within(row).getByRole('link').getAttribute('href')).toBe(`/quran/read/${a.page}?a=${a.key}`);
    }
    expect(within(document.getElementById(toggle.getAttribute('aria-controls')!)!).getAllByRole('listitem')).toHaveLength(2);
    fireEvent.click(toggle);
    expect(document.getElementById(toggle.getAttribute('aria-controls')!)).toBeNull();
  });

  it('lists both complete originals of an inner node including the displayed original', () => {
    const merged = { words: ['قال', 'نُوحًا'], ayat: [], forms: { '57:26': ['قال', 'نُوحًۭا'], '7:59': ['قال', 'نُوحًا'] }, children: [
      { words: ['رب'], ayat: ['7:59'], children: [] },
      { words: ['يا'], ayat: ['57:26'], children: [] },
    ] };
    render(<BranchTree tree={{ words: [], ayat: [], children: [merged, { words: ['موسى'], ayat: ['2:54'], children: [] }] }} names={{ 57: 'الحديد' }} pages={{ '7:59': 158, '57:26': 541, '2:54': 8 }} />);
    fireEvent.click(screen.getByRole('button', { name: 'عرض صيغ الكتابة الأصلية' }));
    const rows = screen.getByText('قال نُوحًۭا').closest('ul')!;
    expect([...rows.children].map(row => row.textContent)).toEqual(['قال نُوحًا٧:٥٩', 'قال نُوحًۭاالحديد ٢٦']);
  });

  it('shows opening-box originals separately without repeating the hidden first word at the root', () => {
    const group: BranchAyah[] = [
      { key: '1:1', page: 1, words: ['مِّنْ', 'رب'] },
      { key: '1:2', page: 1, words: ['مِن', 'رب'] },
      { key: '1:3', page: 1, words: ['وَمِن', 'رب'] },
    ];
    render(<BranchTree tree={branch(group)} variants={variants(group)} names={{}} pages={{ '1:1': 1, '1:2': 1, '1:3': 1 }} />);
    const firstWords = screen.getByRole('list', { name: 'صيغ الكلمة الأولى' });
    fireEvent.click(within(firstWords).getByRole('button', { name: 'عرض صيغ الكتابة الأصلية' }));
    expect(within(firstWords).getByText('مِّنْ')).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });
});
