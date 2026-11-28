import surahRows from '../data/quran/surahs.json';
import corpus from './quranText/corpus';
import { corpusIndex } from './corpusIndex';
import { searchAyat } from './ayahSearch';
import { searchSurahs } from './surahSearch';

export type SurahRow = { number: number; name: string; nameTransliterated?: string | null; numberOfAyat: number };

export const AYAT_FOUND = 60;

export const SURAHS: SurahRow[] = surahRows;

const westernDigits = (text: string) => text.replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x660));

const inSurah = (surah: number) => (ayah: { key: string }) => ayah.key.startsWith(`${surah}:`);

export const surahAyat = (surah: number) => corpus.ayat.filter(inSurah(surah));

export function typedAyah(query: string): string | null {
  const typed = westernDigits(query.trim());
  const ref = typed.match(/^(.*?)[\s:]*(\d+)$/);
  if (!ref) return null;
  const [, name, ayah] = ref;
  const surah = /^\d+$/.test(name.trim()) ? SURAHS.find(row => row.number === Number(name.trim())) : name.trim() ? searchSurahs(SURAHS, name)[0] : undefined;
  return surah && Number(ayah) >= 1 && Number(ayah) <= surah.numberOfAyat ? `${surah.number}:${Number(ayah)}` : null;
}

export function ayatFound(query: string, limit: number) {
  const ref = typedAyah(query);
  const hits = searchAyat(corpusIndex(), query, limit).hits.map(hit => hit.key).filter(key => key !== ref);
  return { surahs: ref ? [] : searchSurahs(SURAHS, query), ayat: ref ? [ref, ...hits] : hits };
}

export function surahAyatFound(surah: number, query: string, limit: number) {
  const typed = westernDigits(query.trim());
  if (/^\d+$/.test(typed)) return Number(typed) >= 1 && Number(typed) <= (SURAHS[surah - 1]?.numberOfAyat ?? 0) ? [`${surah}:${Number(typed)}`] : [];
  return searchAyat(corpusIndex().filter(inSurah(surah)), query, limit).hits.map(hit => hit.key);
}
