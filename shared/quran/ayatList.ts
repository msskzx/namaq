import surahRows from '../data/quran/surahs.json';
import corpus from './quranText/corpus';
import { corpusIndex } from './corpusIndex';
import { searchAyat } from './ayahSearch';
import { compactQuery } from './searchText';
import { searchSurahs, surahRank, westernDigits } from './surahSearch';

export type SurahRow = { number: number; name: string; nameTransliterated?: string | null; numberOfAyat: number };

export const SURAHS: SurahRow[] = surahRows;

const FOUND = 60;

const inSurah = (surah: number) => (ayah: { key: string }) => ayah.key.startsWith(`${surah}:`);

export const surahAyat = (surah: number) => corpus.ayat.filter(inSurah(surah));

function surahNamed(name: string): SurahRow | undefined {
  const rest = name.replace(/^سور[ةه]\s*/, '').trim();
  if (/^\d+$/.test(rest)) return SURAHS.find(row => row.number === Number(rest));
  if (compactQuery(rest).join('').replace(/^ال/, '').length < 2) return undefined;
  const ranked = SURAHS.map(surah => ({ surah, rank: surahRank(surah, rest) })).filter(found => found.rank !== null && found.rank <= 1);
  ranked.sort((a, b) => a.rank! - b.rank!);
  return ranked[0]?.surah;
}

export function typedAyah(query: string): string | null {
  const ref = westernDigits(query.trim()).match(/^(.*?)[\s:]*(\d+)$/);
  if (!ref || !ref[1].trim()) return null;
  const surah = surahNamed(ref[1].trim());
  const ayah = Number(ref[2]);
  return surah && ayah >= 1 && ayah <= surah.numberOfAyat ? `${surah.number}:${ayah}` : null;
}

const byWords = (query: string, ayat: () => ReturnType<typeof corpusIndex>) => (searchable(query) ? searchAyat(ayat(), query, FOUND).hits.map(hit => hit.key) : []);
const searchable = (query: string) => compactQuery(westernDigits(query).replace(/\d/g, '')).join('').length >= 2;

export function ayatFound(query: string) {
  const ref = typedAyah(query);
  if (ref) return { surahs: [], ayat: [ref, ...byWords(query, corpusIndex).filter(key => key !== ref)] };
  return { surahs: searchSurahs(SURAHS, query), ayat: byWords(query, corpusIndex) };
}

export function surahAyatFound(surah: number, query: string) {
  const typed = westernDigits(query.trim());
  const count = SURAHS[surah - 1]?.numberOfAyat ?? 0;
  if (/^\d+$/.test(typed)) return Number(typed) >= 1 && Number(typed) <= count ? [`${surah}:${Number(typed)}`] : [];
  const ref = typedAyah(query);
  if (ref?.startsWith(`${surah}:`)) return [ref];
  return byWords(query, () => corpusIndex().filter(inSurah(surah)));
}
