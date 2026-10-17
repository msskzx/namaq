// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
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
});
