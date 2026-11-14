import data from '../data/quran/tafsirSadi.json';

export type TafsirSegment = { text: string; quran?: boolean };
export type TafsirPassage = { part: number; page: number; segments: TafsirSegment[] };

const passages: TafsirPassage[] = data.passages;
const ayat: Record<string, number[]> = data.ayat;
export const TAFSIR_SADI_SOURCE = data.source;
const quran: Record<string, string> = data.quran;
export const tafsirAyahText = (key: string) => quran[key] ?? '';
export const tafsirSadiOf = (key: string): TafsirPassage[] => (ayat[key] ?? []).map(index => passages[index]);
export const tafsirSadiPage = (passage: TafsirPassage) => `https://quranpedia.net/book/3/${passage.part}/${passage.page}`;
