import { prisma } from '@/lib/prisma';
import { ayahWords } from '@/lib/quran/normalize';
import { getSharedTopics } from '@/lib/quran/topicEngine';
import ThemesView from '../themes/ThemesView';
import CompareControls, { DifferentSelection } from './CompareControls';
import { toThemeRows } from './toThemeRows';

const pick = (value: string | string[] | undefined, fallback: number) => {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n >= 1 && n <= 114 ? n : fallback;
};

async function load(number: number) {
  const rows = await prisma.ayah.findMany({ where: { surah: { number } }, orderBy: { number: 'asc' }, select: { text: true } });
  return rows.map((r, i) => ayahWords(r.text, i === 0 && number !== 1 && number !== 9).display.join(' '));
}

export default async function ThemesCompare({ query }: { query: Record<string, string | string[] | undefined> }) {
  const x = pick(query.a, 16);
  const y = pick(query.b, 43);
  const [a, b, allSurahs, shared] = await Promise.all([
    load(x),
    load(y),
    prisma.surah.findMany({ select: { number: true, name: true }, orderBy: { number: 'asc' } }),
    getSharedTopics(x, y),
  ]);
  const name = (n: number) => allSurahs.find((s) => s.number === n)?.name ?? '';

  const form = <CompareControls themes surahs={allSurahs} a={{ number: x, range: { from: 1, to: a.length }, count: a.length }} b={{ number: y, range: { from: 1, to: b.length }, count: b.length }} query={query} />;

  if (x === y) {
    return (
      <div className="flex flex-col gap-4">
        {form}
        <DifferentSelection themes />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {form}
      <ThemesView a={{ number: x, name: name(x), ayat: a }} b={{ number: y, name: name(y), ayat: b }} themes={toThemeRows(shared)} />
    </div>
  );
}
