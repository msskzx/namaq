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

/**
 * Al-Sa'di's text for an ayah ("2:255"); null for a key outside the Quran. Where he splits an ayah between two passages
 * (2:219 ends one and starts the next), both come, one after the other.
 */
export function tafsirSadiOf(key: string): TafsirPassage | null {
  const found = byAyah.get(key)?.map(index => rows[index]);
  if (!found) return null;
  const first = found[0];
  const last = found[found.length - 1];
  return { surah: first[0], from: first[1], to: last[2], pages: [first[3], last[4]], text: found.map(row => row[5]).join('\n') };
}

/** The ayat al-Sa'di explains alone, in one passage of their own and in no other (the feed's tafsir card, owner 2026-11-18), in the book's order. */
export const singleAyahPassages = (): string[] =>
  rows.filter(([surah, from, to]) => from === to && byAyah.get(`${surah}:${from}`)?.length === 1).map(([surah, from]) => `${surah}:${from}`);
