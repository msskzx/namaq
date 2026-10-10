import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { faEye, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { prisma } from '@/lib/prisma';
import { CURATED } from '@/lib/quran/curatedShifts';
import { ayahWords, plainName } from '@/lib/quran/normalize';
import { findOpeners, findShifts } from '@/lib/quran/shifts';
import ShiftsView, { type CuratedView } from './ShiftsView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: تحولات داخل السورة (تجريبي)',
};

const EXAMPLES: [number, string][] = [[43, 'الزخرف'], [55, 'الرحمن'], [26, 'الشعراء'], [77, 'المرسلات'], [12, 'يوسف'], [18, 'الكهف']];
const pick = (value: string | string[] | undefined, fallback: number) => {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n >= 1 && n <= 114 ? n : fallback;
};

async function load(numbers: number[]) {
  const rows = await prisma.ayah.findMany({
    where: { surah: { number: { in: numbers } } },
    orderBy: [{ surah: { number: 'asc' } }, { number: 'asc' }],
    select: { text: true, surah: { select: { number: true } } },
  });
  const words = new Map<number, ReturnType<typeof ayahWords>[]>();
  for (const r of rows) {
    const list = words.get(r.surah.number) ?? [];
    list.push(ayahWords(r.text, list.length === 0 && r.surah.number !== 1 && r.surah.number !== 9));
    words.set(r.surah.number, list);
  }
  return words;
}

export default async function QuranShiftsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const n = pick((await searchParams).s, 43);
  const curatedSurahs = [...new Set(CURATED.map(c => c.surah))];
  const [surahs, words] = await Promise.all([
    prisma.surah.findMany({ select: { number: true, name: true }, orderBy: { number: 'asc' } }),
    load([...new Set([n, ...curatedSurahs])]),
  ]);
  const surahOf = (number: number) => {
    const name = surahs.find(s => s.number === number)?.name ?? '';
    return { number, name, plain: plainName(name) };
  };
  const mine = words.get(n) ?? [];
  if (mine.length === 0) notFound();
  const found = findShifts(mine);
  const curated: CuratedView[] = CURATED.map(c => {
    const all = words.get(c.surah) ?? [];
    const [lo, hi] = [c.parts[0][0], c.parts[c.parts.length - 1][1]];
    return {
      surah: surahOf(c.surah),
      note: c.note,
      parts: c.parts.map(([from, to]) => ({ from, to, ayat: all.slice(from - 1, to).map(w => w.display.join(' ')) })),
      arcs: findShifts(all).arcs.filter(a => a.a.ayah >= lo && a.b.ayah <= hi),
    };
  });

  return (
    <div dir="rtl" className="max-w-5xl mx-auto p-4 flex flex-col gap-6 text-gray-900 dark:text-gray-200">
      <header>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl">القرآن: تحولات داخل السورة</h1>
          <Badge text="تجريبي" color="amber" size="sm" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          عرض تجريبي لم يراجعه أحد من أهل العلم. النص برواية حفص. تُقارن الكلمات بعد حذف التشكيل وتوحيد صور بعض الحروف، ويدل التطابق على اشتراك اللفظ وحده.
        </p>
        <form method="get" className="flex flex-wrap items-center gap-2">
          <select name="s" aria-label="السورة" defaultValue={n} className="min-w-0 flex-1 rounded border border-amber-400 bg-white dark:bg-gray-900 px-2 py-1 text-sm">
            {surahs.map(s => <option key={s.number} value={s.number}>{`${s.number.toLocaleString('ar-EG')}. ${plainName(s.name)}`}</option>)}
          </select>
          <Button type="submit" size="sm" variant="outline">
            <FontAwesomeIcon icon={faEye} />
            اعرض
          </Button>
        </form>
        <div className="flex flex-wrap gap-2 mt-2">
          {EXAMPLES.map(([number, name]) => (
            <Button key={number} size="sm" href={`/quran/shifts?s=${number}`} active={number === n}>
              <FontAwesomeIcon icon={faLightbulb} />
              {name}
            </Button>
          ))}
        </div>
      </header>
      <ShiftsView
        key={n}
        surah={surahOf(n)}
        ayat={mine.map(w => w.display.join(' '))}
        arcs={found.arcs}
        refrains={found.refrains}
        openers={findOpeners(mine)}
        curated={curated}
      />
    </div>
  );
}
