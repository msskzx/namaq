import data from '../data/quran/tafsirSadi.json';
import { num } from './arabicNumber';

/**
 * Al-Sa'di's Taysir al-Karim al-Rahman, from Quranpedia's tafsir dump (scripts/quran/buildTafsirSadi.ts). Each passage
 * explains a run of ayat; Quran quotes inside it keep their ﴿…﴾ marks. docs/plans/sadi-tafsir.md
 */
export type TafsirPassage = { surah: number; from: number; to: number; pages: [number, number]; text: string };

export const TAFSIR_SADI_SOURCE = {
  book: 'تيسير الكريم الرحمن في تفسير كلام المنان',
  author: 'عبد الرحمن بن ناصر السعدي',
  edition: `${data.source.publisher}، ${data.source.edition}، تحقيق ${data.source.editor}`,
  version: data.source.version,
  url: 'https://quranpedia.net/book/3',
};

type Row = [number, number, number, number, number, string];
const rows = data.passages as Row[];
const byAyah = new Map<string, number>();
rows.forEach(([surah, from, to], index) => { for (let ayah = from; ayah <= to; ayah++) byAyah.set(`${surah}:${ayah}`, index); });

/** The passage that explains an ayah ("2:255"); null for a key outside the Quran. */
export function tafsirSadiOf(key: string): TafsirPassage | null {
  const index = byAyah.get(key);
  if (index === undefined) return null;
  const [surah, from, to, first, last, text] = rows[index];
  return { surah, from, to, pages: [first, last], text };
}

const arabicDigits = (text: string) => text.replace(/\d+/g, d => num(Number(d)).padStart(d.length, '٠'));

/** The line under a passage: the book and its page, then where the text comes from and which version. */
export const tafsirSadiCredit = (passage: TafsirPassage) =>
  `تيسير الكريم الرحمن للسعدي، ص ${num(passage.pages[0])} · الموسوعة القرآنية، إصدار ${arabicDigits(TAFSIR_SADI_SOURCE.version)}`;

/** Quranpedia's page of the printed book where a passage starts. */
export const tafsirSadiPage = (passage: TafsirPassage) => `https://quranpedia.net/book/3/1/${passage.pages[0]}`;

/** A passage's text in runs, Quran quotes (﴿…﴾, marks kept) apart from the prose so they take the Quran font. */
export function tafsirRuns(text: string): { text: string; quran: boolean }[] {
  return text.split(/(﴿[^﴾]*﴾)/).filter(Boolean).map(run => ({ text: run, quran: run.startsWith('﴿') }));
}
