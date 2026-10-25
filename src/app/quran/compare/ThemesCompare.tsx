import { prisma } from '@/lib/prisma';
import { rangeParams, type CompareRange } from '@/lib/quran/compareRange';
import { ayahWords, plainName } from '@/lib/quran/normalize';
import { getSharedTopics } from '@/lib/quran/topicEngine';
import ThemesView from '../themes/ThemesView';
import PairForm from './PairForm';
import { toThemeRows } from './toThemeRows';
import { NOTE } from '../panel';

const pick = (value: string | string[] | undefined, fallback: number) => {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n >= 1 && n <= 114 ? n : fallback;
};

async function load(number: number) {
  const rows = await prisma.ayah.findMany({ where: { surah: { number } }, orderBy: { number: 'asc' }, select: { text: true } });
  return rows.map((r, i) => ayahWords(r.text, i === 0 && number !== 1 && number !== 9).display.join(' '));
}

export default async function ThemesCompare({ query, range }: { query: Record<string, string | string[] | undefined>; range: CompareRange }) {
  const x = pick(query.a, 16);
  const y = pick(query.b, 43);
  const [a, b, allSurahs, shared] = await Promise.all([
    load(x),
    load(y),
    prisma.surah.findMany({ select: { number: true, name: true }, orderBy: { number: 'asc' } }),
    getSharedTopics(x, y),
  ]);
  const name = (n: number) => allSurahs.find((s) => s.number === n)?.name ?? '';

  const side = (surah: number, ayat: string[]) => ({ surah, from: 1, to: ayat.length, max: ayat.length });
  const form = (
    <PairForm surahs={allSurahs.map(s => ({ number: s.number, name: plainName(s.name) }))} ayat={false} keep={{ mode: 'themes', ...rangeParams(range) }} a={side(x, a)} b={side(y, b)} />
  );

  if (x === y) {
    return (
      <div className="flex flex-col gap-4">
        {form}
        <p className={NOTE}>اختر سورتين مختلفتين.</p>
      </div>
    );
  }

  return (
    <ThemesView level={2} controls={form} a={{ number: x, name: name(x), ayat: a }} b={{ number: y, name: name(y), ayat: b }} themes={toThemeRows(shared)} />
  );
}
