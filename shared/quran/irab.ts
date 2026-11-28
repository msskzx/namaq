import { num } from './arabicNumber';

// see docs/plans/irab.md
export type IrabData = { source: { morphology: string; syntax: string }; strings: string[]; ayat: number[][][] };
export type IrabWord = { role: string | null; morph: string; head: number | null };

export function irabWordsOf(data: IrabData, starts: number[], key: string): IrabWord[] {
  const [surah, ayah] = key.split(':').map(Number);
  const at = starts[surah - 1] + ayah - 1;
  const next = starts[surah] ?? data.ayat.length;
  if (!(surah >= 1 && surah <= 114 && ayah >= 1 && at < next)) return [];
  return data.ayat[at].map(([role, morph, head]) => ({ role: role < 0 ? null : data.strings[role], morph: data.strings[morph], head: head < 0 ? null : head }));
}

export const IRAB_SOURCES = [
  { name: 'المدونة القرآنية', url: 'https://corpus.quran.com' },
  { name: 'الشجرة النحوية للقرآن', url: 'https://github.com/NoorBayan/Quranic' },
];

export type UkbariEntry = [number, number, number, number, number, string];
export type UkbariData = { source: { version: string; book: number; from?: string }; entries: UkbariEntry[] };
export type BookPassage = { surah: number; ayah: number; from: number; to: number; page: number; text: string };

const indexes = new WeakMap<UkbariData, Map<string, number[]>>();

export function ukbariOf(data: UkbariData, key: string, words: number[]): BookPassage[] {
  let index = indexes.get(data);
  if (!index) {
    index = new Map();
    data.entries.forEach(([surah, ayah], at) => {
      const id = `${surah}:${ayah}`;
      index!.set(id, [...(index!.get(id) ?? []), at]);
    });
    indexes.set(data, index);
  }
  const all = (index.get(key) ?? []).map(at => data.entries[at]).map(([surah, ayah, from, to, page, text]) => ({ surah, ayah, from, to, page, text }));
  const onWord = all.filter(passage => passage.from >= 0 && words.some(word => word >= passage.from && word <= passage.to));
  return onWord.length ? onWord : all.filter(passage => passage.from < 0);
}

export const ukbariCredit = (passage: BookPassage) => `التبيان في إعراب القرآن للعكبري، ص ${num(passage.page)}`;
export const ukbariPage = (passage: BookPassage) => `https://quranpedia.net/book/309/1/${passage.page}`;
