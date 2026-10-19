import { JUZ_STARTS } from './juz';
import { normalizeWord } from './normalize';

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

const arabicKey = (text: string) => normalizeWord(text).replace(/^سوره\s*/, '').replace(/\s+/g, '');
const latinKey = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .replace(/o/g, 'u')
    .replace(/e/g, 'i')
    .replace(/w/g, 'u')
    .replace(/y/g, 'i')
    .replace(/([dgkst])h/g, '$1')
    .replace(/(.)\1+/g, '$1')
    .replace(/(..)h$/, '$1');
const skeleton = (key: string) => key.replace(/[aiu]/g, '');

export function matchesSurah(surah: IndexSurah, query: string): boolean {
  const trimmed = query.trim();
  if (!trimmed) return true;
  const digits = westernDigits(trimmed);
  if (/^\d+$/.test(digits)) return surah.number === Number(digits);
  const arabic = arabicKey(trimmed);
  if (arabic && /[ء-ي]/.test(arabic) && arabicKey(surah.name).includes(arabic)) return true;
  const latin = latinKey(trimmed);
  if (!latin) return false;
  const name = latinKey(surah.nameTransliterated ?? '');
  return name.includes(latin) || (skeleton(latin).length >= 3 && skeleton(name).includes(skeleton(latin)));
}

const bare = (key: string, article: string) => (key.startsWith(article) ? key.slice(article.length) : key);
const sameName = (surah: IndexSurah, query: string) => {
  const arabic = bare(arabicKey(query), 'ال');
  const latin = bare(latinKey(query), 'al');
  return (
    (arabic !== '' && arabic === bare(arabicKey(surah.name), 'ال')) ||
    (latin !== '' && latin === bare(latinKey(surah.nameTransliterated ?? ''), 'al'))
  );
};

export type AyahReference = { surah: IndexSurah; ayah: number };

export function parseReference(query: string, surahs: IndexSurah[]): AyahReference | null {
  const match = westernDigits(query.trim()).match(/^(.*?\S)\s*[:：,،.\s]\s*(\d+)$/);
  if (!match) return null;
  const [, head, tail] = match;
  const ayah = Number(tail);
  const surah = /^\d+$/.test(head)
    ? surahs.find(candidate => candidate.number === Number(head))
    : (surahs.find(candidate => sameName(candidate, head)) ?? surahs.find(candidate => matchesSurah(candidate, head)));
  return surah && ayah >= 1 && ayah <= surah.numberOfAyat ? { surah, ayah } : null;
}
