import data from '../data/quran/qiraat.json';
import type { WordDifference } from './qiraat';

const ayat = (data as unknown as { ayat: Record<string, WordDifference[]> }).ayat;

/** The word differences of an ayah ("2:85"), in the order of its words; empty when the readers agree. */
export const qiraatOf = (key: string): WordDifference[] => ayat[key] ?? [];
export const hasQiraat = (key: string) => key in ayat;
/** Every ayah whose readers differ, in the Quran's order (the feed's readings card). */
export const qiraatAyat = (): string[] => Object.keys(ayat);
