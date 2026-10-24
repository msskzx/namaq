// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { branch, branchesHref, startingWith, variants, type BranchAyah } from '@/lib/quran/branches';
import BranchTree, { nodeSpans } from './BranchTree';
import ayat from './ayat.json';
import { inJuzRange } from '@/lib/quran/juz';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace }) }));

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
    expect(screen.getByRole('button', { name: /عرض الآيات في سياقها مَقَامٍ أَمِينٍۢ/ })).toBeTruthy();
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

  it('spans every ayah of a node from its start to the end of the node', () => {
    expect(nodeSpans(['15:45', '51:15'], 5)).toEqual({ '15:45': [0, 5], '51:15': [0, 5] });
  });

  it('opens a first-word box on its own ayat and then the other first words that share its child', async () => {
    const group = startingWith(ayat as BranchAyah[], 'الذين ينقضون');
    render(<BranchTree tree={branch(group)} variants={variants(group)} names={{}} pages={Object.fromEntries(group.map(a => [a.key, a.page]))} />);
    const firstWords = screen.getByRole('list', { name: 'صيغ الكلمة الأولى' });
    fireEvent.click(within(firstWords).getAllByRole('button')[1]);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalled());
    const params = new URL(vi.mocked(fetch).mock.calls[0][0] as string, 'http://localhost').searchParams;
    expect([params.get('q'), params.get('vs')]).toEqual(['13:25,2:27', '13:25']);
  });

  it('names each inner button after its node and highlights differing marks of a nested node at its own offset', () => {
    const merged = { words: ['قال', 'نُوحًا'], ayat: [], forms: { '57:26': ['قال', 'نُوحًۭا'], '7:59': ['قال', 'نُوحًا'] }, children: [
      { words: ['رب'], ayat: ['7:59'], children: [] },
      { words: ['يا'], ayat: ['57:26'], children: [] },
    ] };
    render(<BranchTree tree={{ words: ['إذ'], ayat: [], children: [merged, { words: ['هو'], ayat: ['1:1'], children: [] }] }} names={{}} pages={{}} />);
    expect(screen.getByRole('button', { name: 'عرض الآيات في سياقها: إذ' })).toBeTruthy();
    const nested = screen.getByRole('button', { name: 'عرض اختلافات الضبط والسياق: قال نُوحًا' });
    expect(nested).toBeTruthy();
    const marks = screen.getAllByRole('region', { name: 'الضبط في هذه العقدة', hidden: true });
    expect(marks).toHaveLength(1);
    expect([...marks[0].querySelectorAll('mark')].map(mark => mark.textContent)).toEqual(['نُوحًۭا', 'نُوحًا']);
  });

  it('lists the differing marks of a merged node at the top of its overlay with the differing word highlighted', () => {
    const group = startingWith(ayat as BranchAyah[], 'قال رب').filter(a => ['26:24', '26:28', '28:16'].includes(a.key));
    render(<BranchTree tree={branch(group)} names={{}} pages={{}} />);
    const marks = screen.getByRole('region', { name: 'الضبط في هذه العقدة', hidden: true });
    expect(within(marks).getAllByRole('listitem', { hidden: true }).map(item => item.textContent)).toEqual([`${group[0].words.slice(0, 2).join(' ')}آيتان`, `${group[2].words.slice(0, 2).join(' ')}آية`]);
    expect([...marks.querySelectorAll('mark')].map(mark => mark.textContent)).toEqual([group[0].words[1], group[2].words[1]]);
  });

  describe('surrounding ayat', () => {
    const basmala = ['بِسْمِ', 'ٱللَّهِ', 'ٱلرَّحْمَـٰنِ', 'ٱلرَّحِيمِ'];
    const around = {
      before: {
        '15:45': { key: '15:44', page: 265, words: ['لَهَا', 'سَبْعَةُ', 'أَبْوَٰبٍ'] },
        '51:15': { key: '51:14', page: 521, words: ['ذُوقُوا۟', 'فِتْنَتَكُمْ'] },
        '44:51': { key: '44:50', page: 498, words: ['إِنَّ', 'هَـٰذَا'], basmala },
      },
      after: {
        '15:45': { key: '15:46', page: 265, words: ['ٱدْخُلُوهَا', 'بِسَلَـٰمٍ'] },
        '51:15': null,
        '44:51': { key: '51:15', page: 521, words: ['إِنَّ', 'ٱلْمُتَّقِينَ'] },
      },
    };
    const names = { 15: 'الحجر', 44: 'الدخان', 51: 'الذاريات' };
    const pages = { '15:45': 265, '44:51': 498, '51:15': 521 };

    beforeEach(() => {
      replace.mockReset();
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => around }));
    });

    it('has no switch unless the page asks for one', () => {
      render(<BranchTree tree={tree} names={names} pages={pages} />);
      expect(screen.queryByRole('switch')).toBeNull();
    });

    it('loads nothing until the switch is turned on, then draws the ayah before and after every branch', async () => {
      const { container } = render(<BranchTree tree={tree} names={names} pages={pages} surround={{ on: false }} />);
      expect(fetch).not.toHaveBeenCalled();
      expect(container.querySelector('[data-ctx]')).toBeNull();

      fireEvent.click(screen.getByRole('switch', { name: 'الآيات المحيطة' }));
      await waitFor(() => expect(container.querySelectorAll('[data-ctx]')).toHaveLength(5));
      const url = new URL(vi.mocked(fetch).mock.calls[0][0] as string, 'http://localhost');
      expect(url.pathname).toBe('/api/quran/surrounding');
      expect(url.searchParams.get('before')).toBe('15:45,51:15,44:51');
      expect(url.searchParams.get('after')).toBe('15:45,51:15,44:51');
      expect(within(screen.getByRole('list', { name: 'الآيات السابقة' })).getByText('لَهَا سَبْعَةُ أَبْوَٰبٍ')).toBeTruthy();
      expect(screen.getByText('ٱدْخُلُوهَا بِسَلَـٰمٍ').closest('[data-ctx]')?.getAttribute('data-ctx')).toBe('15:45');
      expect(replace).not.toHaveBeenCalled();
    });

    it('puts the basmala after the previous surah\'s last ayah, in the same box', async () => {
      render(<BranchTree tree={tree} names={names} pages={pages} surround={{ on: true }} />);
      const box = (await screen.findByText('إِنَّ هَـٰذَا')).closest('[data-ctx]')!;
      expect(box.textContent?.indexOf('إِنَّ هَـٰذَا')).toBeLessThan(box.textContent!.indexOf(basmala.join(' ')));
      expect(within(box as HTMLElement).getByRole('link', { name: 'الدخان ٥٠' }).getAttribute('href')).toBe('/quran/read/498?a=44:50');
    });

    it('tags a neighbour that is itself in the tree and links to its branch', async () => {
      const { container } = render(<BranchTree tree={tree} names={names} pages={pages} surround={{ on: true }} />);
      const tag = await screen.findByRole('link', { name: 'في هذه الشجرة' });
      const target = container.querySelector(`[id="${tag.getAttribute('href')!.slice(1)}"]`);
      expect(target?.closest('[data-keys]')?.textContent).toContain('جَنَّـٰتٍۢ وَعُيُونٍ');
    });

    it('lights the whole path of the hovered neighbour', async () => {
      const { container } = render(<BranchTree tree={tree} names={names} pages={pages} surround={{ on: true }} />);
      await screen.findByText('لَهَا سَبْعَةُ أَبْوَٰبٍ');
      const css = container.querySelector('style')!.textContent!;
      expect(css).toContain('[data-ctx="44:51"]:hover');
      expect(css).toContain('[data-keys~="44:51"]');
      expect([...container.querySelectorAll('[data-keys~="44:51"]')].map(node => node.textContent)).toEqual(expect.arrayContaining([expect.stringContaining('إِنَّ ٱلْمُتَّقِينَ فِى'), expect.stringContaining('مَقَامٍ أَمِينٍۢ'), expect.stringContaining('إِنَّ هَـٰذَا')]));
    });

    it('shows, after a leaf that runs into the next ayah, the ayah after that one', async () => {
      const group = startingWith(ayat as BranchAyah[], 'يطوف عليهم');
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ before: {}, after: { '56:18': { key: '56:19', page: 535, words: ['لَّا', 'يُصَدَّعُونَ'] } } }) }));
      render(<BranchTree tree={branch(group)} variants={variants(group)} names={{ 56: 'الواقعة' }} pages={Object.fromEntries(group.map(a => [a.key, a.page]))} surround={{ on: true }} />);
      const box = (await screen.findByText('لَّا يُصَدَّعُونَ')).closest('[data-ctx]')!;
      expect(box.getAttribute('data-ctx')).toBe('56:17');
      expect(new URL(vi.mocked(fetch).mock.calls[0][0] as string, 'http://localhost').searchParams.get('after')!.split(',')).toEqual(expect.arrayContaining(['56:18', '52:24', '76:19']));
      expect(box.closest('li')!.parentElement!.closest('li')!.textContent).toContain('﴿١٧﴾');
    });

    it('turns on from its visible label too', () => {
      render(<BranchTree tree={tree} names={names} pages={pages} surround={{ on: false }} />);
      fireEvent.click(screen.getByText('الآيات المحيطة'));
      expect((screen.getByRole('switch') as HTMLInputElement).checked).toBe(true);
    });

    it('keeps the switch in the address when the page asks', () => {
      window.history.replaceState(null, '', '/quran/branches?o=x');
      render(<BranchTree tree={tree} names={names} pages={pages} surround={{ on: false, sync: true }} />);
      fireEvent.click(screen.getByRole('switch'));
      expect(replace).toHaveBeenCalledWith('/quran/branches?o=x&c=1', { scroll: false });
      window.history.replaceState(null, '', '/quran/branches?o=x&c=1');
      fireEvent.click(screen.getByRole('switch'));
      expect(replace).toHaveBeenLastCalledWith('/quran/branches?o=x', { scroll: false });
    });
  });
});
