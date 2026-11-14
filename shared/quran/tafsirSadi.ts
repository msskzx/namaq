import { num } from './arabicNumber';

/**
 * Al-Sa'di's Taysir al-Karim al-Rahman, from Quranpedia's tafsir dump (scripts/quran/buildTafsirSadi.ts). Each passage
 * explains a run of ayat; Quran quotes inside it keep their ﴿…﴾ marks. The text itself is read through
 * tafsirSadiData.ts, so the website's client code that only draws a passage does not carry the book.
 * docs/plans/sadi-tafsir.md
 */
export type TafsirPassage = { surah: number; from: number; to: number; pages: [number, number]; text: string };

/** The dump version the data was built from; tafsirSadiData.test.ts checks the data agrees. */
export const TAFSIR_SADI_VERSION = '2026-08-10';

const arabicDigits = (text: string) => text.replace(/\d+/g, d => num(Number(d)).padStart(d.length, '٠'));

/** The line under a passage: the book and its page, then where the text comes from and which version. */
export const tafsirSadiCredit = (passage: TafsirPassage) =>
  `تيسير الكريم الرحمن للسعدي، ص ${num(passage.pages[0])} · الموسوعة القرآنية، إصدار ${arabicDigits(TAFSIR_SADI_VERSION)}`;

/** Quranpedia's page of the printed book where a passage starts. */
export const tafsirSadiPage = (passage: TafsirPassage) => `https://quranpedia.net/book/3/1/${passage.pages[0]}`;

/** A passage's text in runs, Quran quotes (﴿…﴾, marks kept) apart from the prose so they take the Quran font. */
export function tafsirRuns(text: string): { text: string; quran: boolean }[] {
  return text.split(/(﴿[^﴾]*﴾)/).filter(Boolean).map(run => ({ text: run, quran: run.startsWith('﴿') }));
}
