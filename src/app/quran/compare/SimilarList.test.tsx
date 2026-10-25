// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/components/language/LanguageContext';
import type { SimilarPair } from '@/lib/quran/similar';
import type { Passage } from '@/lib/quran/passages';
import { passageOf, SimilarList, VISIBLE } from './SimilarList';

afterEach(cleanup);

const pair: SimilarPair = { a: [74, 54, 55], b: [80, 11, 12], score: 1, roots: ['ذكر', 'شيا'], marksA: [[54, 0, 0, 'كلا'], [54, 1, 1, 'إن'], [54, 2, 0, 'ذكر']], marksB: [[11, 0, 0, 'كلا'], [11, 1, 1, 'إن'], [11, 2, 0, 'ذكر']] };
const ayat = { '74:54': 'كَلَّآ إِنَّهُۥ تَذۡكِرَةࣱ', '74:55': 'فَمَن شَآءَ ذَكَرَهُۥ', '80:11': 'كَلَّآ إِنَّهَا تَذۡكِرَةࣱ', '80:12': 'فَمَن شَآءَ ذَكَرَهُۥ' };
const names = { 74: 'المدثر', 80: 'عبس' };
const show = (pairs: SimilarPair[], pair = false) => render(<LanguageProvider><SimilarList pairs={pairs} ayat={ayat} names={names} pair={pair} /></LanguageProvider>);

describe('SimilarList', () => {
  it('shows both sides with the shared words marked and a link to compare them', () => {
    show([pair]);
    expect(screen.getByRole('article', { name: 'المدثر ٥٤–٥٥' })).toBeTruthy();
    expect(screen.getByRole('article', { name: 'عبس ١١–١٢' })).toBeTruthy();
    const marks = [...document.querySelectorAll('article mark')];
    expect(marks.find(m => m.textContent === 'تَذۡكِرَةࣱ')!.getAttribute('title')).toContain('يقابلها:');
    expect(marks.find(m => m.textContent === 'إِنَّهَا')!.getAttribute('title')).toContain('من جذر مشترك بلفظ مختلف');
    expect(screen.getByRole('link', { name: /آية بآية/ }).getAttribute('href')).toBe('/quran/compare?a=74&af=54&at=55&b=80&bf=11&bt=12&view=ayat');
    expect(screen.getByText('تقارب ١٠٠٪')).toBeTruthy();
  });

  it('names all counterparts, including a partner with different wording from the same root', () => {
    const linked: SimilarPair = { ...pair, marksA: [[54, 2, 0, 'ذكر']], marksB: [[11, 2, 0, 'ذكر'], [12, 2, 1, 'ذكر']] };
    show([linked]);
    const marks = [...document.querySelectorAll('mark')];
    const a = marks.find(m => m.textContent === 'تَذۡكِرَةࣱ' && m.title.includes('عبس'))!;
    expect(a.title).toBe('يقابلها: تَذۡكِرَةࣱ (عبس ١١)، ذَكَرَهُۥ (عبس ١٢)');
    expect(marks.find(m => m.textContent === 'ذَكَرَهُۥ')!.title).toContain('من جذر مشترك بلفظ مختلف');
  });

  it('shows the first rows and the rest on request', () => {
    const many = Array.from({ length: VISIBLE + 3 }, (_, k) => ({ ...pair, a: [74, k + 1, k + 1] as SimilarPair['a'] }));
    show(many);
    expect(screen.getAllByRole('link', { name: /آية بآية/ })).toHaveLength(VISIBLE);
    fireEvent.click(screen.getByRole('button', { name: /عرض الباقي/ }));
    expect(screen.getAllByRole('link', { name: /آية بآية/ })).toHaveLength(VISIBLE + 3);
  });

  it('says when a surah or a pair has none', () => {
    show([]);
    expect(screen.getByText('لا آيات متشابهة في هذه السورة.')).toBeTruthy();
    cleanup();
    show([], true);
    expect(screen.getByText('لا آيات متشابهة بين السورتين.')).toBeTruthy();
  });

  it('finds the shared passage that overlaps both sides of a pair, in either order', () => {
    const at = (surah: number, from: number, to: number) => ({ from: { surah, ayah: from, word: 0 }, to: { surah, ayah: to, word: 0 } });
    const passage = (a: Passage['a'], b: Passage['b']): Passage => ({ a, b, matched: 12, places: 3, marksA: [], marksB: [] });
    const flipped = passage(at(80, 12, 13), at(74, 55, 55));
    expect(passageOf(pair, [passage(at(74, 54, 54), at(81, 1, 1)), flipped])).toBe(flipped);
    expect(passageOf(pair, [passage(at(74, 56, 57), at(80, 11, 11))])).toBeUndefined();
    const longer = { ...passage(at(74, 54, 55), at(80, 11, 12)), matched: 20 };
    expect(passageOf(pair, [flipped, longer])).toBe(longer);
  });
});
