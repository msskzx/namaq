import { faCodeCompare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/components/common/Button';
import { prisma } from '@/lib/prisma';
import { ayahWords } from '@/lib/quran/normalize';
import { getSharedTopics } from '@/lib/quran/topicEngine';
import ThemesView from '../themes/ThemesView';
import SurahPicker from './SurahPicker';
import { toThemeRows } from './toThemeRows';
import { NOTE, PANEL } from '../panel';

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

  const select = (fieldName: string, value: number, label: string) => <SurahPicker name={fieldName} label={label} value={value} surahs={allSurahs} />;

  const form = (
    <form key={`${x}-${y}`} method="get" className={`${PANEL} flex flex-wrap items-center gap-2`}>
      <input type="hidden" name="mode" value="themes" />
      {select('a', x, 'السورة الأولى')}
      {select('b', y, 'السورة الثانية')}
      <Button type="submit" variant="primary">
        <FontAwesomeIcon icon={faCodeCompare} />
        قارن
      </Button>
    </form>
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
    <div className="flex flex-col gap-4">
      {form}
      <ThemesView a={{ number: x, name: name(x), ayat: a }} b={{ number: y, name: name(y), ayat: b }} themes={toThemeRows(shared)} />
    </div>
  );
}
