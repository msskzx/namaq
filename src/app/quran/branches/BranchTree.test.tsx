vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { branch, branchesHref, startingWith, variants, type BranchAyah } from '@/lib/quran/branches';
import BranchTree from './BranchTree';
import data from './trees.json';
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
    render(<BranchTree tree={tree} names={{ 15: 'سُورَةُ الحِجۡرِ', 44: 'سُورَةُ الدُّخَانِ', 51: 'سُورَةُ الذَّارِيَاتِ' }} />);
    expect(screen.getAllByText('إِنَّ ٱلْمُتَّقِينَ فِى')).toHaveLength(1);
    expect(screen.getByText('جَنَّـٰتٍۢ وَعُيُونٍ')).toBeTruthy();
    expect(screen.getByText('مَقَامٍ أَمِينٍۢ')).toBeTruthy();
  });

  it('fits the complete tree by default and switches between fit and manual zoom', () => {
    let resize: ResizeObserverCallback = () => {};
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: ResizeObserverCallback) { resize = callback; }
      observe() {}
      disconnect() {}
      unobserve() {}
    });
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000);
    const { container } = render(<BranchTree tree={tree} names={{}} surround={{ on: false }} />);
    const viewport = container.querySelector('[data-tree-viewport]') as HTMLDivElement;
    const content = container.querySelector('[data-tree-content]') as HTMLDivElement;
    Object.defineProperties(viewport, { clientWidth: { configurable: true, value: 500 }, clientHeight: { configurable: true, value: 576 } });
    Object.defineProperties(content, {
      offsetWidth: { configurable: true, value: 1000 },
      offsetHeight: { configurable: true, value: 800 },
    });
    act(() => resize([], {} as ResizeObserver));

    const firstRow = container.querySelector('[data-tree]')!.firstElementChild!;
    expect(firstRow.querySelector('[role="switch"]')).not.toBeNull();
    expect(firstRow.querySelector('[role="toolbar"]')).not.toBeNull();
    expect(content.style.transform).toBe('scale(0.5)');
    expect(viewport.style.height).toBe('clamp(22rem, 70svh, 36rem)');
    expect(viewport.classList.contains('overflow-hidden')).toBe(true);
    expect(container.querySelector('[data-tree]')!.classList.contains('overflow-hidden')).toBe(true);
    const fit = screen.getByRole('button', { name: 'ملاءمة' });
    expect(fit.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'تكبير' }));
    expect(content.style.transform).toBe('scale(0.6)');
    expect(viewport.classList.contains('overflow-auto')).toBe(true);
    expect(fit.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(fit);
    expect(content.style.transform).toBe('scale(0.5)');
    expect(fit.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'تصغير' }));
    expect(content.style.transform).toBe('scale(0.4)');
    fireEvent.click(fit);
    expect(content.style.transform).toBe('scale(0.5)');
    Object.defineProperty(content, 'offsetHeight', { configurable: true, value: 100 });
    act(() => resize([], {} as ResizeObserver));
    expect(viewport.style.height).toBe('clamp(22rem, 70svh, 36rem)');
  });

  it('keeps a fixed viewport while fitting and zooming different diagram sizes', () => {
    let resize: ResizeObserverCallback = () => {};
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: ResizeObserverCallback) { resize = callback; }
      observe() {}
      disconnect() {}
      unobserve() {}
    });
    const { container } = render(<BranchTree tree={tree} names={{}} viewportHeight="320px" />);
    const viewport = container.querySelector<HTMLElement>('[data-tree-viewport]')!;
    const content = container.querySelector<HTMLElement>('[data-tree-content]')!;
    Object.defineProperties(viewport, { clientWidth: { configurable: true, value: 500 }, clientHeight: { configurable: true, value: 320 } });
    Object.defineProperties(content, { offsetWidth: { configurable: true, value: 500 }, offsetHeight: { configurable: true, value: 800 } });
    act(() => resize([], {} as ResizeObserver));
    expect(content.style.transform).toBe('scale(0.4)');
    expect(viewport.style.height).toBe('320px');
    fireEvent.click(screen.getByRole('button', { name: 'تكبير' }));
    expect(content.style.transform).toBe('scale(0.5)');
    expect(viewport.style.height).toBe('320px');
    Object.defineProperty(content, 'offsetHeight', { configurable: true, value: 100 });
    act(() => resize([], {} as ResizeObserver));
    fireEvent.click(screen.getByRole('button', { name: 'ملاءمة' }));
    expect(content.style.transform).toBe('scale(1)');
    expect(viewport.style.height).toBe('320px');
    Object.defineProperties(content, { offsetWidth: { configurable: true, value: 200 }, offsetHeight: { configurable: true, value: 100 } });
    act(() => resize([], {} as ResizeObserver));
    expect(content.style.transform).toBe('scale(2)');
    Object.defineProperty(content, 'offsetHeight', { configurable: true, value: 200 });
    act(() => resize([], {} as ResizeObserver));
    expect(content.style.transform).toBe('scale(1.6)');
  });

  it('zooms the tree, not the page, on a trackpad or touch pinch', () => {
    let resize: ResizeObserverCallback = () => {};
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: ResizeObserverCallback) { resize = callback; }
      observe() {}
      disconnect() {}
      unobserve() {}
    });
    const { container } = render(<BranchTree tree={tree} names={{}} viewportHeight="320px" />);
    const viewport = container.querySelector<HTMLElement>('[data-tree-viewport]')!;
    const content = container.querySelector<HTMLElement>('[data-tree-content]')!;
    Object.defineProperties(viewport, { clientWidth: { configurable: true, value: 500 }, clientHeight: { configurable: true, value: 320 } });
    Object.defineProperties(content, { offsetWidth: { configurable: true, value: 1000 }, offsetHeight: { configurable: true, value: 640 } });
    act(() => resize([], {} as ResizeObserver));
    expect(content.style.transform).toBe('scale(0.5)');
    expect(viewport.classList.contains('touch-pan-x')).toBe(true);
    expect(viewport.classList.contains('touch-pan-y')).toBe(true);

    expect(fireEvent.wheel(viewport, { deltaY: -10 })).toBe(true);
    expect(content.style.transform).toBe('scale(0.5)');
    expect(fireEvent.wheel(viewport, { deltaY: -100, ctrlKey: true })).toBe(false);
    expect(Number(content.style.transform.slice(6, -1))).toBeCloseTo(0.5 * Math.E);

    fireEvent.click(screen.getByRole('button', { name: 'ملاءمة الشجرة' }));
    const touch = (x: number) => ({ clientX: x, clientY: 0 });
    fireEvent.touchStart(viewport, { touches: [touch(100), touch(200)] });
    expect(fireEvent.touchMove(viewport, { touches: [touch(50), touch(250)] })).toBe(false);
    expect(content.style.transform).toBe('scale(1)');
    fireEvent.touchStart(viewport, { touches: [touch(50), touch(250), touch(300)] });
    fireEvent.touchEnd(viewport, { touches: [touch(50), touch(250)] });
    fireEvent.touchMove(viewport, { touches: [touch(0), touch(300)] });
    expect(content.style.transform).toBe('scale(1.5)');
    fireEvent.touchMove(viewport, { touches: [touch(-1000), touch(1300)] });
    expect(content.style.transform).toBe('scale(2)');
    fireEvent.touchEnd(viewport, { touches: [] });
    expect(fireEvent.touchMove(viewport, { touches: [touch(0)] })).toBe(true);
  });

  it('joins the juz 30 opening variants to their branches without an empty box', () => {
    const group = startingWith(data.ayat as BranchAyah[], 'اما من').filter(a => inJuzRange(a.key, { from: 30, to: 30 }));
    const tree = branch(group);
    const { container } = render(<BranchTree tree={tree} variants={variants(group)} names={{}} />);
    expect(screen.getByRole('list', { name: 'صيغ الكلمة الأولى' }).children).toHaveLength(3);
    expect([...container.querySelectorAll('div')].filter(node => !node.textContent?.trim() && !node.closest('[role="toolbar"]') && !node.querySelector('[role="toolbar"]'))).toHaveLength(0);
    expect(container.querySelectorAll('a[href^="/quran/read/"]')).toHaveLength(0);
    expect(screen.getAllByRole('button', { name: /عرض.*السياق|عرض الآيات/ }).length).toBeGreaterThan(0);
    expect(screen.getByText('طَغَىٰ')).toBeTruthy();
  });

  it('keeps an ayah reference when all root words are shown as variants', () => {
    render(<BranchTree tree={{ words: ['قال'], ayat: ['1:1'], children: [] }} variants={[{ word: 'قال', conj: '', keys: ['1:1'], id: 'قال' }]} names={{}} />);
    expect(screen.getByText('١:١').closest('button, a')).toBeNull();
  });

  it('shows each ayah label as plain text under its leaf, with visible separators', () => {
    render(<BranchTree tree={tree} names={{ 15: 'سُورَةُ الحِجۡرِ', 51: 'سُورَةُ الذَّارِيَاتِ' }} />);
    expect(['سُورَةُ الذَّارِيَاتِ ١٥', 'سُورَةُ الحِجۡرِ ٤٥', '٤٤:٥١'].map(label => screen.getByText(label).closest('button, a'))).toEqual([null, null, null]);
    expect(screen.queryByRole('link')).toBeNull();
    const references = screen.getByText('سُورَةُ الحِجۡرِ ٤٥').parentElement!.parentElement!;
    expect(within(references).getAllByText('·')).toHaveLength(1);
    expect(references.textContent?.startsWith('·')).toBe(false);
  });

  it('identifies al-Qamar ayah 54 under its leaf', () => {
    render(<BranchTree tree={{ words: ['إِنَّ', 'ٱلْمُتَّقِينَ'], ayat: ['54:54'], children: [] }} names={{ 54: 'سُورَةُ القَمَرِ' }} />);
    expect(screen.getByText('سُورَةُ القَمَرِ ٥٤')).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByText('·')).toBeNull();
  });

  it('gives a branch a button to the tree of its own phrase, but not the root or a leaf, and no text links', () => {
    const deep = { ...tree, children: [{ words: ['جَنَّـٰتٍۢ'], ayat: [], children: tree.children }] };
    render(<BranchTree tree={deep} names={{}} />);
    expect(screen.getAllByRole('link').map(link => [link.getAttribute('aria-label'), link.getAttribute('href')])).toEqual([['عرض هذا الجزء وحده', branchesHref('ان المتقين في جنت')]]);
    expect(screen.getByText('جَنَّـٰتٍۢ').closest('a')).toBeNull();
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
    render(<BranchTree tree={merged} variants={variants} names={{ 56: 'الواقعة', 76: 'الإنسان' }} juz={{ from: 26, to: 30 }} />);
    const firstWords = screen.getByRole('list', { name: 'صيغ الكلمة الأولى' });
    expect(within(firstWords).getAllByRole('listitem').map(item => item.querySelector('[data-node] span.block')?.textContent)).toEqual(['يَطُوفُ', 'وَيَطُوفُ']);
    expect(screen.getByText('عَلَيْهِمْ')).toBeTruthy();
    expect(within(firstWords).getAllByRole('link', { name: 'عرض هذا الجزء وحده' }).map(link => link.getAttribute('href'))).toEqual([
      branchesHref('يطوف عليهم', { from: 26, to: 30 }, { spelling: 'يَطُوفُ' }),
      branchesHref('يطوف عليهم', { from: 26, to: 30 }, { spelling: 'وَيَطُوفُ' }),
    ]);
    expect(screen.getByText('الإنسان ١٩').nextElementSibling?.textContent).toBe('وَيَطُوفُ');
    expect(screen.getByText('الواقعة ١٧').nextElementSibling?.textContent).toBe('يَطُوفُ');
  });

  it('gives every node the same outline context and path buttons, with its references outside them', () => {
    render(<BranchTree tree={tree} names={{}} />);
    const buttons = screen.getAllByRole('button', { name: /عرض الآيات في سياقها|إظهار المسار/ });
    expect(buttons).toHaveLength(6);
    expect(buttons.every(button => button.getAttribute('data-variant') === 'outline' && !button.textContent?.trim())).toBe(true);
    expect(screen.getByRole('button', { name: 'عرض الآيات في سياقها: مَقَامٍ أَمِينٍۢ' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'إظهار المسار: مَقَامٍ أَمِينٍۢ' })).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('replaces repeated leaf originals with an amber button for every represented ayah', async () => {
    const group = startingWith(data.ayat as BranchAyah[], 'ان مع العسر');
    render(<BranchTree tree={branch(group)} variants={variants(group)} names={{ 94: 'الشرح' }} />);
    const button = screen.getByRole('button', { name: /عرض اختلافات الضبط والسياق/ });
    expect(button.getAttribute('data-variant')).toBe('highlight');
    expect(within(button).queryByText(/الشرح/)).toBeNull();
    expect(screen.getAllByText(/الشرح/)).toHaveLength(2);
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
    render(<BranchTree tree={{ words: [], ayat: [], children: [merged] }} names={{}} />);
    expect(screen.getAllByRole('button', { name: /عرض اختلافات الضبط والسياق/ })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: /عرض الآيات في سياقها/ })).toHaveLength(2);
  });

  it('marks first-word differences separately from the shared root', () => {
    const group: BranchAyah[] = [
      { key: '1:1', page: 1, words: ['مِّنْ', 'رب'] },
      { key: '1:2', page: 1, words: ['مِن', 'رب'] },
      { key: '1:3', page: 1, words: ['وَمِن', 'رب'] },
    ];
    render(<BranchTree tree={branch(group)} variants={variants(group)} names={{}} />);
    const firstWords = screen.getByRole('list', { name: 'صيغ الكلمة الأولى' });
    expect(within(firstWords).getAllByRole('button', { name: /عرض اختلافات الضبط والسياق/ })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: /عرض الآيات في سياقها/ })).toHaveLength(2);
  });

  it('opens every inner node on all its ayat and every leaf on its siblings under the same parent', async () => {
    render(<BranchTree tree={tree} names={{}} />);
    const [inner, , leaf] = screen.getAllByRole('button', { name: /عرض الآيات في سياقها/ });
    const asked = () => new URL(vi.mocked(fetch).mock.calls.at(-1)![0] as string, 'http://localhost').searchParams.get('q');
    fireEvent.click(inner);
    await vi.waitFor(() => expect(asked()).toBe('15:45,51:15,44:51'));
    fireEvent.click(leaf);
    await vi.waitFor(() => expect(asked()).toBe('44:51,15:45,51:15'));
  });

  it('opens a first-word box on its own ayat and then the other first words that share its child', async () => {
    const group = startingWith(data.ayat as BranchAyah[], 'الذين ينقضون');
    render(<BranchTree tree={branch(group)} variants={variants(group)} names={{}} />);
    const firstWords = screen.getByRole('list', { name: 'صيغ الكلمة الأولى' });
    fireEvent.click(within(firstWords).getAllByRole('button', { name: /عرض/ })[1]);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalled());
    const params = new URL(vi.mocked(fetch).mock.calls[0][0] as string, 'http://localhost').searchParams;
    expect(params.get('q')).toBe('13:25,2:27');
  });

  it('opens the overlay only from its button, never from the node text or box', () => {
    render(<BranchTree tree={tree} names={{}} />);
    const leafText = screen.getByText('مَقَامٍ أَمِينٍۢ');
    const box = leafText.closest('[data-node]')!;
    const dialog = box.querySelector('dialog')!;
    fireEvent.click(leafText);
    fireEvent.click(box);
    expect(dialog.open).toBe(false);
    fireEvent.click(within(box as HTMLElement).getByRole('button', { name: /عرض الآيات في سياقها/ }));
    expect(dialog.open).toBe(true);
  });

  it('gives every node the same plain border until its path is lit, the root too', () => {
    const { container } = render(<BranchTree tree={tree} names={{}} />);
    const nodes = [...container.querySelectorAll('[data-node]')];
    nodes.forEach(node => expect(node.className).toContain('border-[var(--home-rule)]'));
    const root = nodes[0];
    fireEvent.click(screen.getAllByRole('button', { name: /^إظهار المسار/ })[0]);
    expect(root.className).toContain('border-[var(--home-accent)]');
    expect(root.className).not.toContain('border-[var(--home-rule)]');
  });

  it('lights a path only from its button, never on hover or focus, and keeps several pinned', () => {
    const { container } = render(<BranchTree tree={tree} names={{}} />);
    const lit = () => [...container.querySelectorAll('[data-lit]')].map(node => node.querySelector('span.block')?.textContent);
    const leaf = screen.getByText('مَقَامٍ أَمِينٍۢ').closest('[data-node]')!;
    fireEvent.mouseEnter(leaf);
    fireEvent.focus(leaf);
    expect(lit()).toEqual([]);
    expect(leaf.className).toContain('border-[var(--home-rule)]');
    expect(leaf.className).not.toContain('border-[var(--home-accent)]');
    const pin = screen.getByRole('button', { name: 'إظهار المسار: جَنَّـٰتٍۢ وَعُيُونٍ' });
    fireEvent.click(pin);
    expect(pin.getAttribute('aria-pressed')).toBe('true');
    expect(lit()).toEqual(['إِنَّ ٱلْمُتَّقِينَ فِى', 'جَنَّـٰتٍۢ وَعُيُونٍ']);
    fireEvent.click(screen.getByRole('button', { name: 'إظهار المسار: مَقَامٍ أَمِينٍۢ' }));
    expect(lit()).toHaveLength(3);
    fireEvent.click(pin);
    expect(lit()).toEqual(['إِنَّ ٱلْمُتَّقِينَ فِى', 'مَقَامٍ أَمِينٍۢ']);
  });

  it('lights only the connector to the lit branch, with the vertical segment from the junction to it', () => {
    const { container } = render(<BranchTree tree={tree} names={{}} />);
    fireEvent.click(screen.getByRole('button', { name: 'إظهار المسار: مَقَامٍ أَمِينٍۢ' }));
    const branches = [...container.querySelectorAll('li')];
    expect(branches.map(item => item.querySelector(':scope > [data-line]')!.className.includes('home-accent'))).toEqual([false, true]);
    expect((container.querySelector('[data-stem]') as HTMLElement).style.display).not.toBe('none');
  });

  it('names each inner button after its node and highlights differing marks of a nested node at its own offset', () => {
    const merged = { words: ['قال', 'نُوحًا'], ayat: [], forms: { '57:26': ['قال', 'نُوحًۭا'], '7:59': ['قال', 'نُوحًا'] }, children: [
      { words: ['رب'], ayat: ['7:59'], children: [] },
      { words: ['يا'], ayat: ['57:26'], children: [] },
    ] };
    render(<BranchTree tree={{ words: ['إذ'], ayat: [], children: [merged, { words: ['هو'], ayat: ['1:1'], children: [] }] }} names={{}} />);
    expect(screen.getByRole('button', { name: 'عرض الآيات في سياقها: إذ' })).toBeTruthy();
    const nested = screen.getByRole('button', { name: 'عرض اختلافات الضبط والسياق: قال نُوحًا' });
    expect(nested).toBeTruthy();
    const marks = screen.getAllByRole('region', { name: 'الضبط في هذه العقدة', hidden: true });
    expect(marks).toHaveLength(1);
    expect([...marks[0].querySelectorAll('mark')].map(mark => mark.textContent)).toEqual(['نُوحًۭا', 'نُوحًا']);
  });

  it('lists the differing marks of a merged node at the top of its overlay with the differing word highlighted', () => {
    const group = startingWith(data.ayat as BranchAyah[], 'قال رب').filter(a => ['26:24', '26:28', '28:16'].includes(a.key));
    render(<BranchTree tree={branch(group)} names={{}} />);
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

    beforeEach(() => {
      replace.mockReset();
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => around }));
    });

    it('shows preceding neighbors for both prefixed and trunk-starting ayat', () => {
      const { container } = render(<BranchTree tree={tree} names={names}
        prefixes={[{ word: 'قالوا', conj: '', id: 'phrase', keys: ['15:45'] }, { word: '', conj: '', id: 'phrase', keys: ['51:15', '44:51'] }]}
        surround={{ on: true, data: { ...around, before: { ...around.before, '51:14': { key: '51:13', page: 521, words: ['يَوْمَ هُمْ عَلَى النَّارِ يُفْتَنُونَ'] }, '44:50': { key: '44:49', page: 498, words: ['ذُقْ إِنَّكَ أَنتَ الْعَزِيزُ الْكَرِيمُ'] } } } }} />);
      expect(container.querySelectorAll('[data-ctx]')).toHaveLength(7);
      const before = screen.getByRole('list', { name: 'ما قبل العبارة' });
      expect(before.children).toHaveLength(3);
      expect(screen.queryByText('بداية الآية')).toBeNull();
      expect(before.children[1].querySelectorAll('[data-ctx]')).toHaveLength(2);
      expect(screen.getByText('ذُوقُوا۟ فِتْنَتَكُمْ')).toBeTruthy();
      expect(screen.getByText('إِنَّ هَـٰذَا')).toBeTruthy();
      const trunkContext = container.querySelector<HTMLButtonElement>('[data-node="n-1"] [data-context-open]')!;
      const open = vi.spyOn(trunkContext, 'click').mockImplementation(() => {});
      const neighbour = screen.getByText('ذُوقُوا۟ فِتْنَتَكُمْ').closest('[data-node]') as HTMLElement;
      fireEvent.click(within(neighbour).getByRole('button', { name: /عرض الآيات في سياقها/ }));
      expect(open).toHaveBeenCalledOnce();
    });

    it('names the surrounding-ayat and fit controls without visible labels', () => {
      render(<BranchTree tree={tree} names={names} surround={{ on: false }} />);
      expect(screen.getByRole('switch', { name: 'الآيات المحيطة' }).closest('[title]')?.getAttribute('title')).toBe('الآيات المحيطة');
      expect(screen.getByRole('button', { name: 'ملاءمة' }).getAttribute('title')).toBe('ملاءمة');
      expect(screen.queryByText('الآيات المحيطة')).toBeNull();
      expect(screen.queryByText('ملاءمة')).toBeNull();
    });

    it('has no surrounding-ayat switch unless the page asks for one', () => {
      render(<BranchTree tree={tree} names={names} />);
      expect(screen.queryByRole('switch', { name: 'الآيات المحيطة' })).toBeNull();
    });

    it('loads nothing until the switch is turned on, then draws the ayah before and after every branch', async () => {
      const { container } = render(<BranchTree tree={tree} names={names} surround={{ on: false }} />);
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
      render(<BranchTree tree={tree} names={names} surround={{ on: true }} />);
      const box = (await screen.findByText('إِنَّ هَـٰذَا')).closest('[data-ctx]')!;
      expect(box.textContent?.indexOf('إِنَّ هَـٰذَا')).toBeLessThan(box.textContent!.indexOf(basmala.join(' ')));
      expect(within(box as HTMLElement).getByText('الدخان ٥٠').closest('a')).toBeNull();
      expect(box.querySelector('a[href^="/quran/read/"]')).toBeNull();
    });

    it('puts the reference under the ayah text, like the tree\'s own leaves', async () => {
      render(<BranchTree tree={tree} names={names} surround={{ on: true }} />);
      const box = (await screen.findByText('ٱدْخُلُوهَا بِسَلَـٰمٍ')).closest('[data-ctx]')!;
      expect(box.textContent!.indexOf('ٱدۡخُلُوهَا')).toBeLessThan(box.textContent!.indexOf('الحجر ٤٦'));
    });

    it('tags a neighbour that is itself in the tree and links to its branch', async () => {
      const { container } = render(<BranchTree tree={tree} names={names} surround={{ on: true }} />);
      const tag = await screen.findByRole('link', { name: 'في هذه الشجرة' });
      const target = container.querySelector(`[id="${tag.getAttribute('href')!.slice(1)}"]`);
      expect(target?.closest('[data-keys]')?.textContent).toContain('جَنَّـٰتٍۢ وَعُيُونٍ');
    });

    it('lights the whole path from a neighbour\'s path button', async () => {
      const { container } = render(<BranchTree tree={tree} names={names} surround={{ on: true }} />);
      fireEvent.click(within((await screen.findByText('إِنَّ هَـٰذَا')).closest('[data-node]') as HTMLElement).getByRole('button', { name: /^إظهار المسار/ }));
      expect([...container.querySelectorAll('[data-lit]')].map(node => node.textContent)).toEqual([expect.stringContaining('إِنَّ هَـٰذَا'), expect.stringContaining('إِنَّ ٱلْمُتَّقِينَ فِى'), expect.stringContaining('مَقَامٍ أَمِينٍۢ'), expect.stringContaining('إِنَّ ٱلْمُتَّقِينَ')]);
    });

    it('opens the overlay of the node a neighbour joins: the root before, the leaf after', async () => {
      render(<BranchTree tree={tree} names={names} surround={{ on: true }} />);
      const before = (await screen.findByText('إِنَّ هَـٰذَا')).closest('[data-node]') as HTMLElement;
      fireEvent.click(within(before).getByRole('button', { name: /عرض الآيات في سياقها/ }));
      expect(screen.getByText('إِنَّ ٱلْمُتَّقِينَ فِى').closest('[data-node]')!.querySelector('dialog')!.open).toBe(true);
      const after = screen.getByText('ٱدْخُلُوهَا بِسَلَـٰمٍ').closest('[data-node]') as HTMLElement;
      fireEvent.click(within(after).getByRole('button', { name: /عرض الآيات في سياقها/ }));
      expect(screen.getByText('جَنَّـٰتٍۢ وَعُيُونٍ').closest('[data-node]')!.querySelector('dialog')!.open).toBe(true);
    });

    it('shows, after a leaf that runs into the next ayah, the ayah after that one', async () => {
      const group = startingWith(data.ayat as BranchAyah[], 'يطوف عليهم');
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ before: {}, after: { '56:18': { key: '56:19', page: 535, words: ['لَّا', 'يُصَدَّعُونَ'] } } }) }));
      render(<BranchTree tree={branch(group)} variants={variants(group)} names={{ 56: 'الواقعة' }} surround={{ on: true }} />);
      const box = (await screen.findByText('لَّا يُصَدَّعُونَ')).closest('[data-ctx]')!;
      expect(box.getAttribute('data-ctx')).toBe('56:17');
      expect(new URL(vi.mocked(fetch).mock.calls[0][0] as string, 'http://localhost').searchParams.get('after')!.split(',')).toEqual(expect.arrayContaining(['56:18', '52:24', '76:19']));
      expect(box.closest('li')!.parentElement!.closest('li')!.textContent).toContain('﴿١٧﴾');
    });


    it('keeps the switch in the address without asking the server for the page again', () => {
      window.history.replaceState(null, '', '/quran/branches?o=x');
      render(<BranchTree tree={tree} names={names} surround={{ on: false, sync: true }} />);
      fireEvent.click(screen.getByRole('switch', { name: 'الآيات المحيطة' }));
      expect(`${window.location.pathname}${window.location.search}`).toBe('/quran/branches?o=x&c=1');
      fireEvent.click(screen.getByRole('switch', { name: 'الآيات المحيطة' }));
      expect(`${window.location.pathname}${window.location.search}`).toBe('/quran/branches?o=x');
      expect(replace).not.toHaveBeenCalled();
    });

    it('follows the address over a cached page when the browser goes back to a tree it switched on', async () => {
      window.history.replaceState(null, '', '/quran/branches?o=x&c=1');
      const { container } = render(<BranchTree tree={tree} names={names} surround={{ on: false, sync: true }} />);
      expect((screen.getByRole('switch', { name: 'الآيات المحيطة' }) as HTMLInputElement).checked).toBe(true);
      await waitFor(() => expect(container.querySelectorAll('[data-ctx]')).toHaveLength(5));
      window.history.replaceState(null, '', '/');
    });

    it('carries the switch into the branch links once it is turned on', () => {
      const group = startingWith(data.ayat as BranchAyah[], 'ان المتقين');
      render(<BranchTree tree={branch(group)} names={names} view={{}} surround={{ on: false, sync: true }} />);
      const link = () => screen.getAllByRole('link').find(a => a.getAttribute('href')!.startsWith('/quran/branches?'))!;
      expect(new URL(link().getAttribute('href')!, 'http://localhost').searchParams.has('c')).toBe(false);
      fireEvent.click(screen.getByRole('switch', { name: 'الآيات المحيطة' }));
      expect(new URL(link().getAttribute('href')!, 'http://localhost').searchParams.get('c')).toBe('1');
    });

    it('draws the ayat the page already loaded without fetching them', () => {
      const { container } = render(<BranchTree tree={tree} names={names} surround={{ on: true, sync: true, data: around }} />);
      expect(container.querySelectorAll('[data-ctx]')).toHaveLength(5);
      fireEvent.click(screen.getByRole('switch', { name: 'الآيات المحيطة' }));
      fireEvent.click(screen.getByRole('switch', { name: 'الآيات المحيطة' }));
      expect(container.querySelectorAll('[data-ctx]')).toHaveLength(5);
      expect(fetch).not.toHaveBeenCalled();
    });

  });
});

it('joins whole prefixes to the complete phrase without removing its first word', () => {
  render(<BranchTree tree={{ words: ['أَءِذَا', 'مِتْنَا', 'وَكُنَّا', 'تُرَابًا'], ayat: ['23:82', '37:16', '56:47'], children: [] }} names={{}}
    prefixes={[{ word: 'قَالُوا', conj: '', keys: ['23:82'], id: 'phrase' }, { word: 'وَكَانُوا يَقُولُونَ', conj: '', keys: ['56:47'], id: 'phrase' }, { word: '', conj: '', keys: ['37:16'], id: 'phrase' }]}
    surround={{ on: false, data: { before: { '37:16': { key: '37:15', page: 446, words: ['وَقَالُوا إِنْ هَٰذَا إِلَّا سِحْرٌ مُبِينٌ'] } }, after: {} } }} />);
  const before = screen.getByRole('list', { name: 'ما قبل العبارة' });
  expect(before.children).toHaveLength(3);
  expect(within(before.children[2] as HTMLElement).getByText('وَقَالُوا إِنْ هَٰذَا إِلَّا سِحْرٌ مُبِينٌ')).toBeTruthy();
  expect(within(before.children[2] as HTMLElement).getByText('٣٧:١٥')).toBeTruthy();
  expect(screen.getByText('وَكَانُوا يَقُولُونَ')).toBeTruthy();
  expect(screen.getByText('أَءِذَا مِتْنَا وَكُنَّا تُرَابًا')).toBeTruthy();
  expect(screen.queryByRole('link')).toBeNull();
});
