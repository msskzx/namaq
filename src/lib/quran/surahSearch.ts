import { normalizeSubjectSearch } from '@/lib/subjectSearch';

const clean = (value: string) => normalizeSubjectSearch(value.replace(/ـ/g, '')).replace(/^سوره /, '');
const latinDigits = (value: string) => value.replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x660)).replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 0x6f0));

export function surahMatch(query: string, number: number, name: string): number | null {
  const q = clean(latinDigits(query));
  if (!q) return 0;
  if (/^\d+$/.test(q)) return String(number) === q ? 0 : String(number).startsWith(q) ? 1 : null;
  const n = clean(name);
  return n === q || n === `ال${q}` ? 0 : n.startsWith(q) || n.startsWith(`ال${q}`) ? 1 : n.includes(q) ? 2 : null;
}

export function searchSurahs<T extends { number: number; name: string }>(surahs: T[], query: string): T[] {
  return surahs
    .map(s => ({ s, rank: surahMatch(query, s.number, s.name) }))
    .filter((x): x is { s: T; rank: number } => x.rank !== null)
    .sort((x, y) => x.rank - y.rank)
    .map(x => x.s);
}
