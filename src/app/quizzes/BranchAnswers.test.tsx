vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render as renderUI, screen } from '@testing-library/react';
import { NavSlotElement } from '@/components/common/NavBar';
import { BranchFeedback, BranchInputs, BranchPreview } from './BranchAnswers';
import { firstBoxes, writeBlank as write } from './writeBlankTesting';
import { branchesCorrect, emptyBranchAnswers } from '@shared/quiz/score';
import { branchNodes } from '@shared/quiz/branchAnswers';
import { readBookmarks } from '@shared/bookmarks';
import { branchesHref } from '@shared/quran/branches';
import { SWRConfig } from 'swr';

const quranSurrounding = vi.hoisted(() => vi.fn());
const quranContexts = vi.hoisted(() => vi.fn());
vi.mock('@/lib/quran/quranText', () => ({ quranSurrounding, quranContexts }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), prefetch: vi.fn() }) }));

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
afterEach(() => { cleanup(); localStorage.clear(); });

function Chrome({ children }: { children: React.ReactNode }) {
  const [slot, setSlot] = React.useState<HTMLDivElement | null>(null);
  return <><header aria-label="Quiz top bar"><div ref={setSlot} /></header><NavSlotElement.Provider value={slot}>{children}</NavSlotElement.Provider></>;
}
const render = (ui: React.ReactNode) => renderUI(ui, { wrapper: Chrome });

const contexts = (keys: string[]) => keys.map(key => ({ before: null, after: null, ayah: { key, page: 1, words: ['آية', key] }, match: { exact: [], rooted: [] } }));
const fresh = (ui: React.ReactNode) => <SWRConfig value={{ provider: () => new Map() }}>{ui}</SWRConfig>;

describe('complete branch tree answers', () => {
  // Quizzes draw the matrix only (owner, 2026-11-17): no tree, no view switch, no rotate button.
  it('draws the graded answer as the ayah cards, each ayah with its verdict, and saves the tree address', async () => {
    quranContexts.mockReset().mockImplementation(async (keys: string[]) => contexts(keys));
    render(fresh(<BranchFeedback question={question} typed={[typed[0], typed[1], typed[3], 'wrong']} names={{}} ar={false} />));
    expect(await screen.findByRole('region', { name: 'مصفوفة الآيات' })).toBeTruthy();
    expect(screen.queryByRole('region', { name: 'Answer tree' })).toBeNull();
    expect(screen.queryByRole('button', { name: /Show tree|tree/i })).toBeNull();
    expect(await screen.findAllByText('Wrong at word 1')).toHaveLength(1);
    expect(screen.getByText('wrong').tagName).toBe('DEL');
    expect(screen.getByRole('button', { name: 'الآيات المحيطة' })).toBeTruthy();
    expect(document.querySelectorAll('[data-answer]').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'حفظ' }));
    expect(readBookmarks().find(saved => saved.id === question.phrase)?.href).toBe(branchesHref(question.phrase));
  });

  it('marks an empty leaf of a partly typed answer as unanswered', async () => {
    quranContexts.mockReset().mockImplementation(async (keys: string[]) => contexts(keys));
    render(fresh(<BranchFeedback question={question} typed={[typed[0], typed[1], '', '']} names={{}} ar={false} />));
    expect((await screen.findAllByText('No answer')).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Nothing typed').length).toBeGreaterThan(0);
    expect(document.querySelector('[data-answer="correct"]')).toBeTruthy();
  });

  it('clears only the requested answers without checking or revealing the solution', () => {
    const own = { ...question, asked: [0, 2] };
    const onChange = vi.fn();
    const onCheck = vi.fn();
    render(<BranchInputs question={own} typed={typed} onChange={onChange} onCheck={onCheck} ar />);
    fireEvent.click(screen.getByRole('button', { name: 'مسح الإجابات' }));
    expect(onChange).toHaveBeenCalledWith(emptyBranchAnswers(own));
    expect(onCheck).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'اعرض بطاقات الآيات' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'مشاركة' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'الآيات المحيطة' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'تدوير الشجرة' })).toBeNull();
    expect(screen.queryByText(/اكتب كل طرف فارغ/)).toBeNull();
  });

  it('shows the example as the matrix, with recite-mode boxes for as many answers as chosen', () => {
    const { rerender } = render(<BranchPreview leaves={2} ar={false} />);
    expect(firstBoxes('Node \\d+')).toHaveLength(2);
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.queryByRole('button', { name: /Tree/ })).toBeNull();
    rerender(<BranchPreview leaves={1} ar={false} />);
    expect(firstBoxes('Node \\d+')).toHaveLength(1);
  });

  it('shows the beginnings before the shared root without answer-stage controls', () => {
    const prefixes = [{ word: 'يوم يتذكر', keys: ['52:24'], conj: '', id: 'يوم يتذكر' }, { word: 'وقال', keys: ['56:17'], conj: '', id: 'وقال' }];
    const { container } = render(<BranchInputs question={{ ...question, prefixes }} typed={[]} onChange={() => {}} onCheck={() => {}} ar />);
    expect(screen.getByText('يوم يتذكر')).toBeTruthy();
    expect(screen.getByText('وقال')).toBeTruthy();
    // No way off the page mid-quiz.
    expect(container.querySelectorAll('a')).toHaveLength(0);
    // The node 56:17 and 76:19 share is asked in the row of each leaf under it, with a box for each of its words.
    const shared = tree.children[1];
    expect(firstBoxes('العقدة ٢')).toHaveLength(shared.children.length);
    expect(screen.getAllByLabelText(/^العقدة ٢، الكلمة /)).toHaveLength(shared.children.length * shared.words.length);
  });

  it('keeps original spelling references out of the unanswered quiz tree', () => {
    // The root and a first word are voiced differently across the ayat; the quiz shows neither difference.
    const own = {
      tree: { words: ['رب'], ayat: [], forms: { '1:1': ['ربْ'], '1:2': ['رب'], '1:3': ['رب'] }, children: [
        { words: ['زيد'], ayat: ['1:1'], children: [] }, { words: ['عمر'], ayat: ['1:2'], children: [] }, { words: ['علي'], ayat: ['1:3'], children: [] },
      ] },
      prefixes: [{ word: 'مِن', conj: '', keys: ['1:1', '1:2'], id: 'من رب', forms: { '1:1': ['مِّنْ'], '1:2': ['مِن'] } }, { word: 'وَمِن', conj: 'و', keys: ['1:3'], id: 'من رب' }],
    };
    render(<BranchInputs question={own} typed={[]} onChange={vi.fn()} onCheck={vi.fn()} ar />);
    expect(document.querySelector('[data-differs]')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
    expect(firstBoxes('العقدة \\S+')).toHaveLength(own.tree.children.length);
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

  it('shows recite-mode boxes at every non-root node without showing their text or citations', () => {
    const onChange = vi.fn();
    const onCheck = vi.fn();
    render(<BranchInputs question={question} typed={emptyBranchAnswers(question)} onChange={onChange} onCheck={onCheck} ar={false} />);
    branchNodes(tree).forEach((_, index) => expect(firstBoxes(`Node ${index + 1}`).length).toBeGreaterThan(0));
    expect(screen.getAllByText('يَطُوفُ عَلَيْهِمْ').length).toBeGreaterThan(0);
    expect(screen.queryByText('غِلْمَانٌ لَهُمْ')).toBeNull();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    write('Node 4', 'إذا رأيتهم');
    expect(onChange).toHaveBeenLastCalledWith(['', '', '', 'إذا رأيتهم']);
  });

  it('checks with nothing written, so one who does not know can move on (owner, 2026-11-21)', () => {
    const onCheck = vi.fn();
    render(<BranchInputs question={question} typed={emptyBranchAnswers(question)} onChange={vi.fn()} onCheck={onCheck} ar={false} />);
    const check = screen.getByRole('button', { name: 'Check' });
    expect(check.hasAttribute('disabled')).toBe(false);
    fireEvent.submit(check.closest('form')!);
    expect(onCheck).toHaveBeenCalledTimes(1);
  });

});
