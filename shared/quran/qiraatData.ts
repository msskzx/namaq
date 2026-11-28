import data from '../data/quran/qiraat.json';
import type { WordDifference } from './qiraat';

const ayat = (data as unknown as { ayat: Record<string, WordDifference[]> }).ayat;

export const qiraatOf = (key: string): WordDifference[] => ayat[key] ?? [];
export const hasQiraat = (key: string) => key in ayat;
export const qiraatAyat = (): string[] => Object.keys(ayat);
