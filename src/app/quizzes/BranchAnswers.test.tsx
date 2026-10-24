// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { branch, variants, type BranchAyah } from '@/lib/quran/branches';
import { BranchFeedback, BranchInputs, branchesCorrect, emptyBranchAnswers } from './BranchAnswers';

const tree = {
  words: ['يَطُوفُ', 'عَلَيْهِمْ'], ayat: [], children: [
    { words: ['غِلْمَانٌ', 'لَهُمْ'], ayat: ['52:24'], children: [] },
    { words: ['وِلْدَانٌ', 'مُخَلَّدُونَ'], ayat: [], children: [
      { words: ['بِأَكْوَابٍ'], ayat: ['56:17'], children: [] },
      { words: ['إِذَا', 'رَأَيْتَهُمْ'], ayat: ['76:19'], children: [] },
    ] },
  ],
};
const question = { tree, phrase: 'يطوف عليهم', branches: [{ words: [], ayat: [{ key: '52:24', page: 524, words: [] }, { key: '56:17', page: 535, words: [] }, { key: '76:19', page: 579, words: [] }] }] };
const typed = ['غلمان لهم', 'ولدان مخلدون', 'بأكواب', 'إذا رأيتهم'];
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
afterEach(cleanup);

describe('complete branch tree answers', () => {
  it('offers context for every feedback leaf and distinguishes differing marks', () => {
    const merged = { words: ['مِنْ', 'رب'], ayat: ['1:1', '1:2'], forms: { '1:1': ['مِّنْ', 'رب'], '1:2': ['مِنْ', 'رب'] }, children: [] };
    const own = { tree: { words: ['قال'], ayat: [], children: [merged, { words: ['يا'], ayat: ['1:3'], children: [] }] }, branches: [{ words: [], ayat: [{ key: '1:1', page: 1, words: [] }, { key: '1:2', page: 1, words: [] }, { key: '1:3', page: 1, words: [] }] }] };
    render(<BranchFeedback question={own} typed={['من رب', 'يا']} names={{}} juz={null} ar />);
    expect(screen.getByRole('button', { name: /عرض اختلافات الضبط والسياق/ }).querySelector('[data-differing]')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /عرض الآيات في سياقها/ }).map(button => button.getAttribute('data-variant'))).toEqual(['outline', 'ghost']);
  });

  it('opens a feedback leaf on its siblings under the same parent', async () => {
    HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    const own = { tree: { words: ['قال'], ayat: [], children: [{ words: ['رب'], ayat: ['1:1'], children: [] }, { words: ['يا'], ayat: ['1:2', '1:3'], children: [] }] }, branches: [] };
    render(<BranchFeedback question={own} typed={['رب', 'يا']} names={{}} juz={null} ar />);
    fireEvent.click(screen.getAllByRole('button', { name: /عرض الآيات في سياقها/ })[1]);
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const params = new URL(vi.mocked(fetch).mock.calls[0][0] as string, 'http://localhost').searchParams;
    expect(params.get('q')).toBe('1:1,1:2,1:3');
    vi.unstubAllGlobals();
  });

  it('marks only the words every ayah of a feedback dialog shares', async () => {
    HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [
      { ayah: { key: '1:1', page: 1, words: ['قال', 'رب', 'اغفر', 'لي'] }, before: null, after: null, match: { exact: [0], rooted: [1] } },
      { ayah: { key: '1:2', page: 1, words: ['قال', 'ربي', 'يا'] }, before: null, after: null, match: { exact: [0], rooted: [1] } },
    ] }));
    const own = { tree: { words: ['قال'], ayat: [], children: [{ words: ['رب', 'اغفر'], ayat: ['1:1'], children: [] }, { words: ['ربي', 'يا'], ayat: ['1:2'], children: [] }] }, branches: [] };
    render(<BranchFeedback question={own} typed={['رب اغفر', 'ربي يا']} names={{}} juz={null} ar />);
    fireEvent.click(screen.getAllByRole('button', { name: /عرض الآيات في سياقها/ })[1]);
    await waitFor(() => expect(screen.getAllByTitle('في كل الآيات بلفظها').map(word => word.textContent)).toEqual(['قال', 'قال']));
    expect(screen.getAllByTitle('في كل الآيات بجذرها أو بضبط مختلف').map(word => word.textContent)).toEqual(['رب', 'ربي']);
    vi.unstubAllGlobals();
  });

  it('keeps original spelling references out of the unanswered quiz tree', () => {
    const group: BranchAyah[] = [
      { key: '1:1', page: 1, words: ['مِّنْ', 'ربْ', 'زيد'] },
      { key: '1:2', page: 1, words: ['مِن', 'رب', 'عمر'] },
      { key: '1:3', page: 1, words: ['وَمِن', 'رب', 'علي'] },
    ];
    const own = { tree: branch(group), variants: variants(group) };
    render(<BranchInputs question={own} typed={[]} onChange={vi.fn()} onCheck={vi.fn()} ar />);
    expect(screen.queryByRole('button', { name: /عرض اختلافات الضبط والسياق/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /عرض الآيات في سياقها/ })).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getAllByRole('textbox')).toHaveLength(3);
  });

  it('requires intermediate nodes and every leaf, with every word in each node', () => {
    expect(emptyBranchAnswers(question)).toEqual(['', '', '', '']);
    expect(branchesCorrect(question, typed)).toBe(true);
    expect(branchesCorrect(question, ['غلمان لهم', 'ولدان مخلدون'])).toBe(false);
    expect(branchesCorrect(question, ['', ...typed.slice(1)])).toBe(false);
    expect(branchesCorrect(question, [typed[0], typed[1], '', typed[3]])).toBe(false);
    expect(branchesCorrect(question, ['غلمان', ...typed.slice(1)])).toBe(false);
    expect(branchesCorrect(question, [])).toBe(false);
    expect(branchesCorrect(question, [...typed, 'extra'])).toBe(false);
  });

  it('accepts sibling leaves in either order but preserves their parent', () => {
    expect(branchesCorrect(question, [typed[0], typed[1], typed[3], typed[2]])).toBe(true);
    expect(branchesCorrect(question, [typed[2], typed[1], typed[0], typed[3]])).toBe(false);
  });

  it('shows fields at every non-root node without leaking their text or citations', () => {
    const onChange = vi.fn();
    const onCheck = vi.fn();
    render(<BranchInputs question={question} typed={emptyBranchAnswers(question)} onChange={onChange} onCheck={onCheck} ar={false} />);
    expect(screen.getAllByRole('textbox')).toHaveLength(4);
    expect(screen.getByText('يَطُوفُ عَلَيْهِمْ')).toBeTruthy();
    expect(screen.queryByText('غِلْمَانٌ لَهُمْ')).toBeNull();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Check' }).hasAttribute('disabled')).toBe(true);
    fireEvent.change(screen.getByRole('textbox', { name: 'Node 4' }), { target: { value: 'إذا رأيتهم' } });
    expect(onChange).toHaveBeenCalledWith(['', '', '', 'إذا رأيتهم']);
    fireEvent.submit(screen.getByRole('button', { name: 'Check' }).closest('form')!);
    expect(onCheck).not.toHaveBeenCalled();
  });

  it('allows checking a partial tree and marks its empty leaves incorrect', () => {
    const onCheck = vi.fn();
    const partial = [typed[0], typed[1], '', ''];
    const { unmount } = render(<BranchInputs question={question} typed={partial} onChange={vi.fn()} onCheck={onCheck} ar={false} />);
    expect(screen.getByRole('button', { name: 'Check' }).hasAttribute('disabled')).toBe(false);
    fireEvent.submit(screen.getByRole('button', { name: 'Check' }).closest('form')!);
    expect(onCheck).toHaveBeenCalledOnce();
    unmount();
    render(<BranchFeedback question={question} typed={partial} names={{}} juz={null} ar={false} />);
    expect(screen.getAllByText('No answer')).toHaveLength(2);
    expect(screen.getAllByText('Incorrect')).toHaveLength(2);
  });

  it('checks a completed tree through form submission', () => {
    const onCheck = vi.fn();
    render(<BranchInputs question={question} typed={typed} onChange={vi.fn()} onCheck={onCheck} ar={true} />);
    fireEvent.submit(screen.getByRole('button', { name: 'تحقق' }).closest('form')!);
    expect(onCheck).toHaveBeenCalledOnce();
  });

  it('shows corrections and combines each leaf reference with its context control', () => {
    render(<BranchFeedback question={question} typed={[typed[0], typed[1], typed[3], 'wrong']} names={{ 52: 'الطور' }} juz={null} ar={false} />);
    expect(screen.getByRole('region', { name: 'Answer tree' })).toBeTruthy();
    expect(screen.getAllByText('Correct', { exact: true })).toHaveLength(3);
    expect(screen.getByText('Incorrect')).toBeTruthy();
    expect(screen.getByText('بِأَكْوَابٍ')).toBeTruthy();
    expect(screen.getByText('إِذَا رَأَيْتَهُمْ')).toBeTruthy();
    expect(screen.getByText('الطور ٢٤').closest('button')).toBeTruthy();
    expect(screen.getByText('٥٦:١٧').closest('button')).toBeTruthy();
    expect(document.querySelector('a[href^="/quran/read/"]')).toBeNull();
  });

  it('draws each joined spelling without a link before checking, and tags each ayah with it after', () => {
    const variants = [{ word: 'يَطُوفُ', conj: '', keys: ['52:24'], id: 'يطوف عليهم' }, { word: 'وَيَطُوفُ', conj: 'و', keys: ['56:17', '76:19'], id: 'يطوف عليهم' }];
    const { unmount } = render(<BranchInputs question={{ ...question, variants }} typed={emptyBranchAnswers(question)} onChange={vi.fn()} onCheck={vi.fn()} ar={false} />);
    expect(screen.getByText('وَيَطُوفُ')).toBeTruthy();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    unmount();
    render(<BranchFeedback question={{ ...question, variants }} typed={typed} names={{}} juz={null} ar={false} />);
    expect(screen.getAllByText('وَيَطُوفُ')).toHaveLength(3);
  });
});
