import dataFile from '../data/quran/tafsirSadi.json';
import type { TafsirPassage } from './tafsirSadi';
import { dataOf } from '../appData';

const data = dataOf(dataFile);

type Row = [number, number, number, number, number, string];
const rows = data.passages as Row[];
export const tafsirSadiDataVersion = data.source.version;

const byAyah = new Map<string, number[]>();
rows.forEach(([surah, from, to], index) => {
  for (let ayah = from; ayah <= to; ayah++) {
    const key = `${surah}:${ayah}`;
    byAyah.set(key, [...(byAyah.get(key) ?? []), index]);
  }
});

export function tafsirSadiOf(key: string): TafsirPassage | null {
  const found = byAyah.get(key)?.map(index => rows[index]);
  if (!found) return null;
  const first = found[0];
  const last = found[found.length - 1];
  return { surah: first[0], from: first[1], to: last[2], pages: [first[3], last[4]], text: found.map(row => row[5]).join('\n') };
}

export const singleAyahPassages = (): string[] =>
  rows.filter(([surah, from, to]) => from === to && byAyah.get(`${surah}:${from}`)?.length === 1).map(([surah, from]) => `${surah}:${from}`);
