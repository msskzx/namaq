// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { branch, branchesHref, startingWith, variants, type BranchAyah } from '@/lib/quran/branches';
import BranchTree, { nodeSpans } from './BranchTree';
import ayat from './ayat.json';
import { inJuzRange } from '@/lib/quran/juz';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

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
    expect(container.querySelectorAll('a[href^="/quran/read/"]')).toHaveLength(0);
    expect(screen.getAllByRole('button', { name: /عرض.*السياق|عرض الآيات/ }).length).toBeGreaterThan(0);
    expect(screen.getByText('طَغَىٰ')).toBeTruthy();
  });

  it('keeps an ayah reference when all root words are shown as variants', () => {
    render(<BranchTree tree={{ words: ['قال'], ayat: ['1:1'], children: [] }} variants={[{ word: 'قال', conj: '', keys: ['1:1'], id: 'قال' }]} names={{}} pages={{ '1:1': 1 }} />);
    expect(screen.getByText('١:١').closest('button')).toBeTruthy();
  });

  it('keeps each ayah label inside its leaf context control with visible separators', () => {
    render(<BranchTree tree={tree} names={{ 15: 'سُورَةُ الحِجۡرِ', 51: 'سُورَةُ الذَّارِيَاتِ' }} pages={{ '15:45': 265, '44:51': 498, '51:15': 521 }} />);
    expect(screen.getByText('سُورَةُ الذَّارِيَاتِ ١٥').closest('button')).toBeTruthy();
    expect(screen.getByText('سُورَةُ الحِجۡرِ ٤٥').closest('button')).toBeTruthy();
    expect(screen.getByText('٤٤:٥١').closest('button')).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
    const references = screen.getByText('سُورَةُ الحِجۡرِ ٤٥').parentElement!.parentElement!;
    expect(within(references).getAllByText('·')).toHaveLength(1);
    expect(references.textContent?.startsWith('·')).toBe(false);
  });

  it('identifies al-Qamar ayah 54 in the combined leaf control', () => {
    render(<BranchTree tree={{ words: ['إِنَّ', 'ٱلْمُتَّقِينَ'], ayat: ['54:54'], children: [] }} names={{ 54: 'سُورَةُ القَمَرِ' }} pages={{ '54:54': 531 }} />);
    expect(screen.getByText('سُورَةُ القَمَرِ ٥٤').closest('button')).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
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
    expect(within(firstWords).getAllByRole('link').map(link => link.textContent)).toEqual(['يَطُوفُ', 'وَيَطُوفُ']);
    expect(screen.getByText('عَلَيْهِمْ')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'وَيَطُوفُ' }).getAttribute('href')).toBe(branchesHref('يطوف عليهم', { from: 26, to: 30 }, { spelling: 'وَيَطُوفُ' }));
    expect(screen.getByRole('link', { name: 'يَطُوفُ' }).getAttribute('href')).toBe(branchesHref('يطوف عليهم', { from: 26, to: 30 }, { spelling: 'يَطُوفُ' }));
    expect(screen.getByText('الإنسان ١٩').nextElementSibling?.textContent).toBe('وَيَطُوفُ');
    expect(screen.getByText('الواقعة ١٧').nextElementSibling?.textContent).toBe('يَطُوفُ');
  });

  it('gives every leaf a borderless context button beside its references and every inner node an outline one', () => {
    render(<BranchTree tree={tree} names={{}} pages={{}} />);
    const buttons = screen.getAllByRole('button', { name: /عرض الآيات في سياقها/ });
    expect(buttons.map(button => button.getAttribute('data-variant'))).toEqual(['outline', 'ghost', 'ghost']);
    expect(buttons.slice(1).every(button => button.textContent?.trim())).toBe(true);
    expect(screen.queryByRole('link')).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('replaces repeated leaf originals with an amber button for every represented ayah', async () => {
    const group = startingWith(ayat as BranchAyah[], 'ان مع العسر');
    render(<BranchTree tree={branch(group)} variants={variants(group)} names={{ 94: 'الشرح' }} pages={Object.fromEntries(group.map(a => [a.key, a.page]))} />);
    const button = screen.getByRole('button', { name: /عرض اختلافات الضبط والسياق/ });
    expect(button.getAttribute('data-variant')).toBe('ghost');
    expect(button.querySelector('[data-differing]')).toBeTruthy();
    expect(within(button).getAllByText(/الشرح/)).toHaveLength(2);
    expect(screen.queryByRole('link', { name: /الشرح/ })).toBeNull();
    expect(screen.queryByText(group[1].words.slice(1).join(' '))).toBeNull();
    fireEvent.click(button);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(new URL(vi.mocked(fetch).mock.calls[0][0] as string, 'http://localhost').searchParams.get('q')).toBe('94:5,94:6');
  });

  it('keeps an amber button on an inner node with differing marks', () => {
    const merged = { words: ['قال', 'نُوحًا'], ayat: [], forms: { '57:26': ['قال', 'نُوحًۭا'], '7:59': ['قال', 'نُوحًا'] }, children: [
      { words: ['رب'], ayat: ['7:59'], children: [] },
      { words: ['يا'], ayat: ['57:26'], children: [] },
    ] };
    render(<BranchTree tree={{ words: [], ayat: [], children: [merged] }} names={{}} pages={{}} />);
    expect(screen.getAllByRole('button', { name: /عرض اختلافات الضبط والسياق/ })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: /عرض الآيات في سياقها/ })).toHaveLength(2);
  });

  it('marks first-word differences separately from the shared root', () => {
    const group: BranchAyah[] = [
      { key: '1:1', page: 1, words: ['مِّنْ', 'رب'] },
      { key: '1:2', page: 1, words: ['مِن', 'رب'] },
      { key: '1:3', page: 1, words: ['وَمِن', 'رب'] },
    ];
    render(<BranchTree tree={branch(group)} variants={variants(group)} names={{}} pages={{ '1:1': 1, '1:2': 1, '1:3': 1 }} />);
    const firstWords = screen.getByRole('list', { name: 'صيغ الكلمة الأولى' });
    expect(within(firstWords).getAllByRole('button', { name: /عرض اختلافات الضبط والسياق/ })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: /عرض الآيات في سياقها/ })).toHaveLength(2);
  });

  it('opens every inner node on all its ayat and every leaf on its siblings under the same parent', async () => {
    render(<BranchTree tree={tree} names={{}} pages={{}} />);
    const [inner, , leaf] = screen.getAllByRole('button', { name: /عرض الآيات في سياقها/ });
    const asked = () => new URL(vi.mocked(fetch).mock.calls.at(-1)![0] as string, 'http://localhost').searchParams.get('q');
    fireEvent.click(inner);
    await vi.waitFor(() => expect(asked()).toBe('15:45,51:15,44:51'));
    fireEvent.click(leaf);
    await vi.waitFor(() => expect(asked()).toBe('44:51,15:45,51:15'));
  });

  it('spans a node over its own words and a leaf over each sibling branch under the same parent', () => {
    expect(nodeSpans(tree, 0)).toEqual({ '15:45': [0, 3], '51:15': [0, 3], '44:51': [0, 3] });
    expect(nodeSpans(tree.children[1], 3, tree)).toEqual({ '15:45': [3, 5], '51:15': [3, 5], '44:51': [3, 5] });
  });

  it('lists the differing marks of a merged node at the top of its overlay with the differing word highlighted', () => {
    const group = startingWith(ayat as BranchAyah[], 'قال رب').filter(a => ['26:24', '26:28', '28:16'].includes(a.key));
    render(<BranchTree tree={branch(group)} names={{}} pages={{}} />);
    const marks = screen.getByRole('region', { name: 'الضبط في هذه العقدة', hidden: true });
    expect(within(marks).getAllByRole('listitem', { hidden: true }).map(item => item.textContent)).toEqual([`${group[0].words.slice(0, 2).join(' ')}آيتان`, `${group[2].words.slice(0, 2).join(' ')}آية`]);
    expect([...marks.querySelectorAll('mark')].map(mark => mark.textContent)).toEqual([group[0].words[1], group[2].words[1]]);
  });
});
