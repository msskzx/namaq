vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { branch, variants, type BranchAyah } from '@/lib/quran/branches';
import { BranchFeedback, BranchInputs, BranchPreview } from './BranchAnswers';
import { branchesCorrect, emptyBranchAnswers } from '@/lib/quiz/score';

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
  it('keeps surrounding ayat and path keys attached to reordered answer text', async () => {
    const own = { tree: { words: ['حرم'], ayat: [], children: [
      { words: ['نَبِّـُٔونِى', 'بِعِلْمٍ'], ayat: ['6:143'], children: [] },
      { words: ['أَمْ', 'كُنتُمْ', 'شُهَدَآءَ'], ayat: ['6:144'], children: [] },
    ] }, asked: [0, 1] };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ before: {}, after: {
      '6:143': { key: '6:144', words: ['السياق الأول'] },
      '6:144': { key: '6:145', words: ['السياق الثاني'] },
    } }) }));
    try {
      const { container } = render(<BranchFeedback question={own} typed={['ام كنتم', 'نبئوني بعلم']} names={{}} ar />);
      const first = container.querySelector('[data-answer]')!.closest('[data-node]')!;
      expect(first.getAttribute('data-keys')).toBe('6:144');
      fireEvent.click(screen.getByRole('switch', { name: 'الآيات المحيطة' }));
      const following = await screen.findByText('السياق الثاني');
      expect(first.parentElement!.contains(following)).toBe(true);
      expect(first.parentElement!.textContent).not.toContain('السياق الأول');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('offers surrounding ayat only after revealing the solution and loads them on demand', async () => {
    const fetchContext = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ before: { '52:24': { key: '52:23', words: ['السياق السابق'] } }, after: {} }) });
    vi.stubGlobal('fetch', fetchContext);
    try {
      const { rerender } = render(<BranchInputs question={question} typed={[]} onChange={() => {}} onCheck={() => {}} ar />);
      expect(screen.queryByRole('switch')).toBeNull();
      rerender(<BranchFeedback question={question} typed={typed} names={{}} ar />);
      const toggle = screen.getByRole('switch', { name: 'الآيات المحيطة' });
      expect(screen.queryByRole('link', { name: 'شجرة العبارة' })).toBeNull();
      expect(toggle).toHaveProperty('checked', false);
      expect(fetchContext).not.toHaveBeenCalled();
      fireEvent.click(toggle);
      expect(await screen.findByText('السياق السابق')).toBeTruthy();
      expect(fetchContext).toHaveBeenCalledWith(expect.stringContaining('/api/quran/surrounding?'));
      fireEvent.click(toggle);
      expect(screen.queryByText('السياق السابق')).toBeNull();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('reserves the same preview text space at every difficulty', () => {
    const { container, rerender } = render(<BranchPreview leaves={1} ar={false} />);
    const reservedText = () => container.querySelector('[data-tree-content]')!.textContent!.replaceAll('You type this', '');
    const initial = reservedText();
    expect(screen.getAllByText('You type this')).toHaveLength(1);
    rerender(<BranchPreview leaves={10} ar={false} />);
    expect(screen.getAllByText('You type this')).toHaveLength(6);
    expect(reservedText()).toBe(initial);
    expect(container.querySelectorAll('[data-node] [aria-hidden="true"].invisible')).toHaveLength(6);
  });

  it('shows the beginnings before the shared root without answer-stage controls', () => {
    const prefixes = [{ word: 'يوم يتذكر', keys: ['52:24'], conj: '', id: 'يوم يتذكر' }, { word: 'وقال', keys: ['56:17'], conj: '', id: 'وقال' }];
    const { container } = render(<BranchInputs question={{ ...question, prefixes }} typed={[]} onChange={() => {}} onCheck={() => {}} ar />);
    expect(screen.getByText('يوم يتذكر')).toBeTruthy();
    expect(screen.getByText('وقال')).toBeTruthy();
    expect(container.querySelectorAll('[data-node] button, [data-node] a')).toHaveLength(0);
    expect(screen.getAllByRole('textbox')).toHaveLength(4);
  });

  it('offers context for every feedback leaf and distinguishes differing marks', () => {
    const merged = { words: ['مِنْ', 'رب'], ayat: ['1:1', '1:2'], forms: { '1:1': ['مِّنْ', 'رب'], '1:2': ['مِنْ', 'رب'] }, children: [] };
    const own = { tree: { words: ['قال'], ayat: [], children: [merged, { words: ['يا'], ayat: ['1:3'], children: [] }] }, branches: [{ words: [], ayat: [{ key: '1:1', page: 1, words: [] }, { key: '1:2', page: 1, words: [] }, { key: '1:3', page: 1, words: [] }] }] };
    render(<BranchFeedback question={own} typed={['من رب', 'يا']} names={{}} ar />);
    expect(screen.getByRole('button', { name: /عرض اختلافات الضبط والسياق/ }).getAttribute('data-variant')).toBe('highlight');
    expect(screen.getAllByRole('button', { name: /عرض الآيات في سياقها/ }).map(button => button.getAttribute('data-variant'))).toEqual(['outline', 'outline']);
    expect(screen.getAllByRole('button', { name: /إظهار المسار/ })).toHaveLength(3);
  });

  it('opens a feedback leaf on its siblings under the same parent', async () => {
    HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    const own = { tree: { words: ['قال'], ayat: [], children: [{ words: ['رب'], ayat: ['1:1'], children: [] }, { words: ['يا'], ayat: ['1:2', '1:3'], children: [] }] }, branches: [] };
    render(<BranchFeedback question={own} typed={['رب', 'يا']} names={{}} ar />);
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
    render(<BranchFeedback question={own} typed={['رب اغفر', 'ربي يا']} names={{}} ar />);
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
    expect(within(screen.getByRole('region', { name: 'أكمل الشجرة' })).getByRole('toolbar', { name: 'تكبير الشجرة' })).toBeTruthy();
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
    render(<BranchFeedback question={question} typed={partial} names={{}} ar={false} />);
    expect(screen.getAllByText('No answer')).toHaveLength(2);
    expect(screen.getAllByText('Nothing typed')).toHaveLength(2);
    const nodes = [...within(screen.getByRole('region', { name: 'Answer tree' })).getAllByText(/Correct|No answer/)].map(verdict => verdict.closest<HTMLElement>('[data-answer]')!.dataset.answer);
    expect(nodes).toEqual(['correct', 'correct', 'incorrect', 'incorrect']);
  });

  it('checks a completed tree through form submission', () => {
    const onCheck = vi.fn();
    render(<BranchInputs question={question} typed={typed} onChange={vi.fn()} onCheck={onCheck} ar={true} />);
    fireEvent.submit(screen.getByRole('button', { name: 'تحقق' }).closest('form')!);
    expect(onCheck).toHaveBeenCalledOnce();
  });

  it('shows corrections and each leaf reference as plain text', () => {
    render(<BranchFeedback question={question} typed={[typed[0], typed[1], typed[3], 'wrong']} names={{ 52: 'الطور' }} ar={false} />);
    expect(screen.getByRole('region', { name: 'Answer tree' })).toBeTruthy();
    expect(screen.getAllByText('Correct', { exact: true })).toHaveLength(3);
    expect(screen.getAllByText('Wrong at word 1')).toHaveLength(1);
    expect(screen.getByText('wrong').tagName).toBe('DEL');
    expect(screen.getAllByText('بِأَكْوَابٍ').length).toBeGreaterThan(0);
    expect(screen.getAllByText('إِذَا رَأَيْتَهُمْ').length).toBeGreaterThan(0);
    for (const ref of [...screen.getAllByText('الطور ٢٤'), ...screen.getAllByText('٥٦:١٧')]) expect(ref.closest('button, a')).toBeNull();
    expect(document.querySelector('a[href^="/quran/read/"]')).toBeNull();
  });

  it('draws each joined spelling without a link before checking, and tags each ayah with it after', () => {
    const variants = [{ word: 'يَطُوفُ', conj: '', keys: ['52:24'], id: 'يطوف عليهم' }, { word: 'وَيَطُوفُ', conj: 'و', keys: ['56:17', '76:19'], id: 'يطوف عليهم' }];
    const { unmount } = render(<BranchInputs question={{ ...question, variants }} typed={emptyBranchAnswers(question)} onChange={vi.fn()} onCheck={vi.fn()} ar={false} />);
    expect(screen.getByText('وَيَطُوفُ')).toBeTruthy();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    unmount();
    render(<BranchFeedback question={{ ...question, variants }} typed={typed} names={{}} ar={false} />);
    expect(screen.getAllByText('وَيَطُوفُ')).toHaveLength(3);
  });
});
