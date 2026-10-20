// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { branch, branchesHref, startingWith, variants, type BranchAyah } from '@/lib/quran/branches';
import BranchTree from './BranchTree';
import ayat from './ayat.json';
import { inJuzRange } from '@/lib/quran/juz';

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
    expect(screen.getByRole('link', { name: '١ ١' }).getAttribute('href')).toBe('/quran/read/1?a=1:1');
  });

  it('links every ayah to its exact position on the reader page', () => {
    render(<BranchTree tree={tree} names={{ 15: 'سُورَةُ الحِجۡرِ', 51: 'سُورَةُ الذَّارِيَاتِ' }} pages={{ '15:45': 265, '44:51': 498, '51:15': 521 }} />);
    expect(screen.getByRole('link', { name: 'سُورَةُ الذَّارِيَاتِ ١٥' }).getAttribute('href')).toBe('/quran/read/521?a=51:15');
    expect(screen.getByRole('link', { name: 'سُورَةُ الحِجۡرِ ٤٥' }).getAttribute('href')).toBe('/quran/read/265?a=15:45');
    expect(screen.getByRole('link', { name: '٤٤ ٥١' }).getAttribute('href')).toBe('/quran/read/498?a=44:51');
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
});
