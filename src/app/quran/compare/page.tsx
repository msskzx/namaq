import type { Metadata } from 'next';
import { faCodeCompare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/components/common/Button';
import { prisma } from '@/lib/prisma';
import { alignSurahs } from '@/lib/quran/compare';
import { ayahWords } from '@/lib/quran/normalize';
import CompareView from './CompareView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: مقارنة سورتين (تجريبي)',
};

const plainName = (name: string) => name.replace(/[ً-ٟـٰۖ-ۭ]/g, '').replace(/ٱ/g, 'ا');
const pick = (value: string | string[] | undefined, fallback: number) => {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n >= 1 && n <= 114 ? n : fallback;
};

async function load(number: number) {
  const rows = await prisma.ayah.findMany({ where: { surah: { number } }, orderBy: { number: 'asc' }, select: { text: true } });
  return rows.map((r, i) => ayahWords(r.text, i === 0 && number !== 1 && number !== 9));
}

export default async function QuranComparePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const [a, b] = [pick(query.a, 56), pick(query.b, 69)];
  const surahs = await prisma.surah.findMany({ select: { number: true, name: true }, orderBy: { number: 'asc' } });
  const [wordsA, wordsB] = await Promise.all([load(a), load(b)]);
  const nameOf = (n: number) => plainName(surahs.find(s => s.number === n)?.name ?? '');
  const rawName = (n: number) => surahs.find(s => s.number === n)?.name ?? '';

  const select = (name: string, value: number, label: string) => (
    <select name={name} aria-label={label} defaultValue={value} className="min-w-0 flex-1 rounded border border-amber-400 bg-white dark:bg-gray-900 px-2 py-1 text-sm">
      {surahs.map(s => (
        <option key={s.number} value={s.number}>{`${s.number.toLocaleString('ar-EG')}. ${plainName(s.name)}`}</option>
      ))}
    </select>
  );

  return (
    <div dir="rtl" className="max-w-5xl mx-auto p-4 flex flex-col gap-4 text-gray-900 dark:text-gray-200">
      <form method="get" className="flex flex-wrap items-center gap-2">
        {select('a', a, 'السورة الأولى')}
        {select('b', b, 'السورة الثانية')}
        <Button type="submit" size="sm" variant="primary">
          <FontAwesomeIcon icon={faCodeCompare} />
          قارن
        </Button>
      </form>
      <CompareView
        a={{ number: a, name: rawName(a), plain: nameOf(a), words: wordsA.map(w => w.display.join(' ')) }}
        b={{ number: b, name: rawName(b), plain: nameOf(b), words: wordsB.map(w => w.display.join(' ')) }}
        rows={alignSurahs(wordsA.map(w => w.norm), wordsB.map(w => w.norm))}
      />
    </div>
  );
}
