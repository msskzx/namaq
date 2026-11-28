import { num } from './arabicNumber';

// see docs/plans/sadi-tafsir.md
export type TafsirPassage = { surah: number; from: number; to: number; pages: [number, number]; text: string };

export const TAFSIR_SADI_VERSION = '2026-08-10';

const arabicDigits = (text: string) => text.replace(/\d+/g, d => num(Number(d)).padStart(d.length, '٠'));

export const tafsirSadiCredit = (passage: TafsirPassage) =>
  `تيسير الكريم الرحمن للسعدي، ص ${num(passage.pages[0])} · الموسوعة القرآنية، إصدار ${arabicDigits(TAFSIR_SADI_VERSION)}`;

export const tafsirSadiPage = (passage: TafsirPassage) => `https://quranpedia.net/book/3/1/${passage.pages[0]}`;

export function tafsirRuns(text: string): { text: string; quran: boolean }[] {
  return text.split(/(﴿[^﴾]*﴾)/).filter(Boolean).map(run => ({ text: run, quran: run.startsWith('﴿') }));
}
