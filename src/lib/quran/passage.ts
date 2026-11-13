// The openings, order and oaths pages' passage types; the iltifat examples live in shared/quran/iltifat.ts.
export { resolve } from '@shared/quran/iltifat';
export type Range = [number, number];
export type Data = { names: Record<string, string>; ayat: Record<string, string> };
export type Surah = { number: number; name: string; plain: string };
