// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/components/language/LanguageContext';
import type { SimilarPair } from '@/lib/quran/similar';
import { SimilarList, VISIBLE } from './SimilarList';

afterEach(cleanup);

const pair: SimilarPair = { a: [74, 54, 55], b: [80, 11, 12], score: 1, roots: ['ذكر', 'شيا'], marksA: [[54, 0, 0], [54, 1, 1], [54, 2, 0]], marksB: [[11, 0, 0], [11, 1, 1], [11, 2, 0]] };
const ayat = { '74:54': 'كَلَّآ إِنَّهُۥ تَذۡكِرَةࣱ', '74:55': 'فَمَن شَآءَ ذَكَرَهُۥ', '80:11': 'كَلَّآ إِنَّهَا تَذۡكِرَةࣱ', '80:12': 'فَمَن شَآءَ ذَكَرَهُۥ' };
const names = { 74: 'المدثر', 80: 'عبس' };
const show = (pairs: SimilarPair[], pair = false) => render(<LanguageProvider><SimilarList pairs={pairs} ayat={ayat} names={names} pair={pair} /></LanguageProvider>);

describe('SimilarList', () => {
  it('shows both sides with the shared words marked and a link to compare them', () => {
    show([pair]);
    expect(screen.getByText('المدثر ٥٤–٥٥')).toBeTruthy();
    expect(screen.getByText('عبس ١١–١٢')).toBeTruthy();
    const marks = [...document.querySelectorAll('mark')];
    expect(marks.find(m => m.textContent === 'تَذۡكِرَةࣱ')!.className).toContain('text-amber-600');
    expect(marks.find(m => m.textContent === 'إِنَّهَا')!.className).toContain('text-sky-600');
    expect(screen.getByRole('link', { name: /آية بآية/ }).getAttribute('href')).toBe('/quran/compare?a=74&af=54&at=55&b=80&bf=11&bt=12&view=ayat');
    expect(screen.getByText('تقارب ١٠٠٪')).toBeTruthy();
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
});
