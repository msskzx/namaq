// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { branchesHref } from '@/lib/quran/branches';
import BranchTree from './BranchTree';

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

  it('links every ayah to its reader page under its surah name and number', () => {
    render(<BranchTree tree={tree} names={{ 15: 'سُورَةُ الحِجۡرِ', 51: 'سُورَةُ الذَّارِيَاتِ' }} pages={{ '15:45': 265, '44:51': 498, '51:15': 521 }} />);
    expect(screen.getByRole('link', { name: 'سُورَةُ الذَّارِيَاتِ ١٥' }).getAttribute('href')).toBe('/quran/read/521');
    expect(screen.getByRole('link', { name: 'سُورَةُ الحِجۡرِ ٤٥' }).getAttribute('href')).toBe('/quran/read/265');
    expect(screen.getByRole('link', { name: '٤٤ ٥١' }).getAttribute('href')).toBe('/quran/read/498');
  });

  it('links a branch to the tree of its own phrase, but not the root or a leaf', () => {
    const deep = { ...tree, children: [{ words: ['جَنَّـٰتٍۢ'], ayat: [], children: tree.children }] };
    render(<BranchTree tree={deep} names={{}} pages={{}} />);
    expect(screen.getByRole('link', { name: 'جَنَّـٰتٍۢ' }).getAttribute('href')).toBe(branchesHref('إن المتقين في جنت'));
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
      { word: 'يَطُوفُ', conj: '', keys: ['56:17'] },
      { word: 'وَيَطُوفُ', conj: 'و', keys: ['76:19'], id: 'ويطوف عليهم' },
    ];
    render(<BranchTree tree={merged} variants={variants} names={{ 56: 'الواقعة', 76: 'الإنسان' }} pages={{ '56:17': 535, '76:19': 579 }} juz={{ from: 26, to: 30 }} />);
    const firstWords = screen.getByRole('list', { name: 'صيغ الكلمة الأولى' });
    expect(firstWords.textContent).toBe('يَطُوفُوَيَطُوفُ');
    expect(screen.getByText('عَلَيْهِمْ')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'وَيَطُوفُ' }).getAttribute('href')).toBe(branchesHref('ويطوف عليهم', { from: 26, to: 30 }));
    expect(screen.getByRole('link', { name: 'الإنسان ١٩' }).nextElementSibling?.textContent).toBe('وَيَطُوفُ');
    expect(screen.getByRole('link', { name: 'الواقعة ١٧' }).nextElementSibling?.textContent).toBe('يَطُوفُ');
  });
});
