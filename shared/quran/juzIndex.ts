import { JUZ_STARTS } from './juz';
import { sameSurahName, searchSurahs } from './surahSearch';

export type JuzStart = { juz: number; surah: number; ayah: number; page: number };

const JUZ_PAGES = [1, 22, 42, 62, 82, 102, 121, 142, 162, 182, 201, 222, 242, 262, 282, 302, 322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582];

export const JUZ_INDEX: JuzStart[] = JUZ_STARTS.map((key, at) => {
  const [surah, ayah] = key.split(':').map(Number);
  return { juz: at + 1, surah, ayah, page: JUZ_PAGES[at] };
});

export type IndexSurah = { number: number; name: string; nameTransliterated?: string | null; numberOfAyat: number; page: number | null };
export type JuzEntry = { surah: IndexSurah; from: number; page: number };
export type JuzGroup = JuzStart & { entries: JuzEntry[] };

export function juzGroups(surahs: IndexSurah[]): JuzGroup[] {
  const byNumber = new Map(surahs.map(surah => [surah.number, surah]));
  return JUZ_INDEX.map((start, at) => {
    const next = JUZ_INDEX[at + 1];
    const last = next ? (next.ayah === 1 ? next.surah - 1 : next.surah) : 114;
    const entries: JuzEntry[] = [];
    for (let number = start.surah; number <= last; number++) {
      const surah = byNumber.get(number);
      if (!surah) continue;
      const from = number === start.surah ? start.ayah : 1;
      entries.push({ surah, from, page: from === 1 ? (surah.page ?? start.page) : start.page });
    }
    return { ...start, entries };
  });
}

const westernDigits = (text: string) => text.replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x660));

export { matchesSurah } from './surahSearch';

export type AyahReference = { surah: IndexSurah; ayah: number };

export function parseReference(query: string, surahs: IndexSurah[]): AyahReference | null {
  const match = westernDigits(query.trim()).match(/^(.*?\S)\s*[:：,،.\s]\s*(\d+)$/);
  if (!match) return null;
  const [, head, tail] = match;
  const ayah = Number(tail);
  const surah = /^\d+$/.test(head)
    ? surahs.find(candidate => candidate.number === Number(head))
    : (surahs.find(candidate => sameSurahName(candidate, head)) ?? searchSurahs(surahs, head)[0]);
  return surah && ayah >= 1 && ayah <= surah.numberOfAyat ? { surah, ayah } : null;
}
