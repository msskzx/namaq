import { faCodeCompare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/components/common/Button';
import { prisma } from '@/lib/prisma';
import { ayahWords } from '@/lib/quran/normalize';
import { getSharedTopics } from '@/lib/quran/topicEngine';
import { num } from '@/lib/quran/arabicNumber';
import ThemesView from '../themes/ThemesView';
import { toThemeRows } from './toThemeRows';

const pick = (value: string | string[] | undefined, fallback: number) => {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n >= 1 && n <= 114 ? n : fallback;
};

const SUGGESTED_PAIRS: [number, number][] = [
  [16, 43],
  [57, 64],
  [55, 56],
  [75, 76],
];

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

  const select = (fieldName: string, value: number, label: string) => (
    <select name={fieldName} aria-label={label} defaultValue={value} className="min-w-0 flex-1 rounded border border-amber-400 bg-white dark:bg-gray-900 px-2 py-1 text-sm">
      {allSurahs.map((s) => (
        <option key={s.number} value={s.number}>{`${num(s.number)}. ${s.name}`}</option>
      ))}
    </select>
  );

  const form = (
    <form method="get" dir="rtl" className="max-w-5xl mx-auto p-4 flex flex-wrap items-center gap-2">
      <input type="hidden" name="mode" value="themes" />
      {select('a', x, 'السورة الأولى')}
      {select('b', y, 'السورة الثانية')}
      <Button type="submit" size="sm" variant="outline">
        <FontAwesomeIcon icon={faCodeCompare} />
        قارن
      </Button>
    </form>
  );

  const suggestions = (
    <div dir="rtl" className="max-w-5xl mx-auto px-4 flex flex-wrap items-center gap-2">
      {SUGGESTED_PAIRS.map(([p, q]) => (
        <Button key={`${p}-${q}`} size="sm" variant="outline" active={p === x && q === y} href={`/quran/compare?mode=themes&a=${p}&b=${q}`}>
          {name(p)} ↔ {name(q)}
        </Button>
      ))}
    </div>
  );

  if (x === y) {
    return (
      <>
        {form}
        {suggestions}
        <p dir="rtl" className="max-w-5xl mx-auto p-4 text-sm text-gray-600 dark:text-gray-400">اختر سورتين مختلفتين.</p>
      </>
    );
  }

  return (
    <>
      {form}
      {suggestions}
      <ThemesView a={{ number: x, name: name(x), ayat: a }} b={{ number: y, name: name(y), ayat: b }} themes={toThemeRows(shared)} />
    </>
  );
}
