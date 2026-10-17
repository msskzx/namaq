// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/components/language/LanguageContext';
import type { SimilarPair } from '@/lib/quran/similar';
import { SimilarList, VISIBLE } from './SimilarList';

afterEach(cleanup);

const pair: SimilarPair = { a: [74, 54, 55], b: [80, 11, 12], score: 1, roots: ['ذكر', 'شيا'], marksA: [54002, 55001, 55002], marksB: [11002, 12001, 12002] };
const ayat = { '74:54': 'كَلَّآ إِنَّهُۥ تَذۡكِرَةࣱ', '74:55': 'فَمَن شَآءَ ذَكَرَهُۥ', '80:11': 'كَلَّآ إِنَّهَا تَذۡكِرَةࣱ', '80:12': 'فَمَن شَآءَ ذَكَرَهُۥ' };
const names = { 74: 'المدثر', 80: 'عبس' };
const show = (pairs: SimilarPair[], pair = false) => render(<LanguageProvider><SimilarList pairs={pairs} ayat={ayat} names={names} pair={pair} /></LanguageProvider>);

describe('SimilarList', () => {
  it('shows both sides with the shared words marked and a link to compare them', () => {
    show([pair]);
    expect(screen.getByText('المدثر ٥٤–٥٥')).toBeTruthy();
    expect(screen.getByText('عبس ١١–١٢')).toBeTruthy();
    expect([...document.querySelectorAll('mark')].map(m => m.textContent)).toContain('تَذۡكِرَةࣱ');
    expect(screen.getByRole('link', { name: /قارن النصين/ }).getAttribute('href')).toBe('/quran/compare?a=74&af=54&at=55&b=80&bf=11&bt=12');
    expect(screen.getByText('تقارب ١٠٠٪')).toBeTruthy();
  });

  it('shows the first rows and the rest on request', () => {
    const many = Array.from({ length: VISIBLE + 3 }, (_, k) => ({ ...pair, a: [74, k + 1, k + 1] as SimilarPair['a'] }));
    show(many);
    expect(screen.getAllByRole('link', { name: /قارن النصين/ })).toHaveLength(VISIBLE);
    fireEvent.click(screen.getByRole('button', { name: /عرض الباقي/ }));
    expect(screen.getAllByRole('link', { name: /قارن النصين/ })).toHaveLength(VISIBLE + 3);
  });

  it('says when a surah has none', () => {
    show([]);
    expect(screen.getByText('لا آيات متشابهة في هذه السورة.')).toBeTruthy();
  });
});
