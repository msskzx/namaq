// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import data from './trees.json';
import { type BranchAyah } from '@/lib/quran/branches';
import { type TreeGroup } from '@/lib/quran/phraseTrees';
import PieceList, { type SharedPiece } from './PieceList';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
afterEach(cleanup);

describe('PieceList', () => {
  it('renders a unified tree entry without an opening/inside badge', () => {
    const ayat = data.ayat as BranchAyah[];
    const tree = (data.trees as TreeGroup[]).find(group => group.id === 'يقيمون الصلوه')!;
    const entry: SharedPiece = {
      id: tree.id,
      text: tree.text,
      count: 6,
      shared: 2,
      opening: { id: tree.id, text: tree.text, count: 6 },
      keys: [...new Set(tree.occurrences.map(occurrence => occurrence.key))],
      phrase: tree,
    };
    render(<PieceList pieces={[entry]} ayat={new Map(ayat.map(ayah => [ayah.key, ayah]))} names={{}} juz={null} />);
    expect(screen.getByRole('region', { name: 'شجرة العبارات المشتركة' })).toBeTruthy();
    expect(screen.queryByText('داخل الآية')).toBeNull();
    expect(screen.queryByText('أول الآية')).toBeNull();
  });
});
