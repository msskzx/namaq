// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import ayat from './ayat.json';
import { branchesHref, pieces, sharedOpenings, type BranchAyah } from '@/lib/quran/branches';
import PieceList from './PieceList';

afterEach(cleanup);

const all = ayat as BranchAyah[];
const groups = sharedOpenings(all);
const cut = pieces(groups);
const byKey = new Map(all.map(ayah => [ayah.key, ayah]));
const yatuf = cut.find(p => p.id === 'يطوف عليهم')!;
const whole = cut.find(p => p.opening.count === p.count && p.id !== p.opening.id)!;
const piece = cut.find(p => p.opening.id === 'يايها الذين' && p.count === 2)!;

describe('PieceList', () => {
  it('draws each piece as its tree, naming the opening only when the piece was cut from a larger one', () => {
    const { container } = render(<PieceList pieces={[yatuf, piece]} ayat={byKey} names={{}} juz={{ from: 1, to: 30 }} />);
    const [first, second] = [...container.querySelectorAll<HTMLElement>('ul[aria-label="المتشابهات"] > li')];
    expect(within(first).getByRole('region', { name: 'شجرة الفواتح' }).textContent).toContain('٣ آيات');
    expect(within(first).queryByRole('link', { name: /^يَـٰٓأَيُّهَا/ })).toBeNull();
    expect(within(first).getByRole('list', { name: 'صيغ الكلمة الأولى' })).toBeTruthy();
    const card = within(second).getByRole('region', { name: 'شجرة الفواتح' });
    expect(card.textContent).toContain('آيتان');
    expect(within(card).getByRole('link', { name: /\(٩٠\)$/ }).getAttribute('href')).toBe(branchesHref('يايها الذين', { from: 1, to: 30 }));
  });

  it('names no opening when the piece holds all of its ayat', () => {
    render(<PieceList pieces={[whole]} ayat={byKey} names={{}} juz={null} />);
    expect(screen.queryByText(/من:/)).toBeNull();
  });

  it('folds the pieces under their openings, each with a link to the whole tree', () => {
    const opening = cut.find(p => p.id === 'يطوف عليهم')!.opening;
    const { container } = render(<PieceList pieces={cut} openings={[opening]} ayat={byKey} names={{}} juz={null} />);
    expect(within(screen.getByRole('region', { name: 'شجرة الفواتح', hidden: true })).getByText('٣ آيات')).toBeTruthy();
    expect(container.querySelector('summary')!.textContent).toContain('٣ آيات · مجموعة');
    expect(screen.getByRole('link', { name: 'الشجرة كاملة' }).getAttribute('href')).toBe(branchesHref('يطوف عليهم'));
  });
});
