import type { Metadata } from 'next';
import { faCodeCompare, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/components/common/Button';
import { prisma } from '@/lib/prisma';
import { alignSurahs, clampRange } from '@/lib/quran/compare';
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
  const ra = clampRange(query.af, query.at, wordsA.length);
  const rb = clampRange(query.bf, query.bt, wordsB.length);
  const whole = [ra.from === 1 && ra.to === wordsA.length, rb.from === 1 && rb.to === wordsB.length].every(Boolean);
  const slice = (w: typeof wordsA, r: typeof ra) => w.slice(r.from - 1, r.to);
  const nameOf = (n: number) => plainName(surahs.find(s => s.number === n)?.name ?? '');
  const rawName = (n: number) => surahs.find(s => s.number === n)?.name ?? '';

  const select = (name: string, value: number, label: string) => (
    <select name={name} aria-label={label} defaultValue={value} className="min-w-0 flex-1 rounded border border-amber-400 bg-white dark:bg-gray-900 px-2 py-1 text-sm">
      {surahs.map(s => (
        <option key={s.number} value={s.number}>{`${s.number.toLocaleString('ar-EG')}. ${plainName(s.name)}`}</option>
      ))}
    </select>
  );
  const ayahInput = (name: string, value: number, max: number, label: string) => (
    <input type="number" name={name} aria-label={label} defaultValue={value} min={1} max={max} className="w-16 rounded border border-amber-400 bg-white dark:bg-gray-900 px-2 py-1 text-sm" />
  );

  return (
    <div dir="rtl" className="max-w-5xl mx-auto p-4 flex flex-col gap-4 text-gray-900 dark:text-gray-200">
      <form method="get" className="flex flex-wrap items-center gap-2">
        <div className="flex w-full items-center gap-2">
          {select('a', a, 'السورة الأولى')}
          {ayahInput('af', ra.from, wordsA.length, 'من آية (الأولى)')}
          {ayahInput('at', ra.to, wordsA.length, 'إلى آية (الأولى)')}
        </div>
        <div className="flex w-full items-center gap-2">
          {select('b', b, 'السورة الثانية')}
          {ayahInput('bf', rb.from, wordsB.length, 'من آية (الثانية)')}
          {ayahInput('bt', rb.to, wordsB.length, 'إلى آية (الثانية)')}
        </div>
        <Button type="submit" size="sm" variant="outline">
          <FontAwesomeIcon icon={faCodeCompare} />
          قارن
        </Button>
        <Button size="sm" href="/quran/compare?a=55&af=46&at=61&b=55&bf=62&bt=77">
          <FontAwesomeIcon icon={faLightbulb} />
          مثال: الرحمن ٤٦–٦١ مقابل ٦٢–٧٧
        </Button>
      </form>
      {a === b && ra.from === rb.from && ra.to === rb.to ? <p className="text-sm text-gray-600 dark:text-gray-400">اختر مقطعين مختلفين.</p> : <CompareView
        a={{ number: a, name: rawName(a), plain: nameOf(a), words: wordsA.map(w => w.display.join(' ')), range: whole ? undefined : ra }}
        b={{ number: b, name: rawName(b), plain: nameOf(b), words: wordsB.map(w => w.display.join(' ')), range: whole ? undefined : rb }}
        rows={alignSurahs(slice(wordsA, ra).map(w => w.norm), slice(wordsB, rb).map(w => w.norm), { a: ra.from, b: rb.from }, whole)}
      />}
    </div>
  );
}
