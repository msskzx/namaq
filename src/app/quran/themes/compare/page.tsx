import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ayahWords } from '@/lib/quran/normalize';
import { getSharedTopics } from '@/lib/quran/topicEngine';
import ThemesView from '../ThemesView';
import { toThemeRows } from './toThemeRows';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: مواضع متقابلة بين سورتين',
};

async function load(number: number) {
  const rows = await prisma.ayah.findMany({ where: { surah: { number } }, orderBy: { number: 'asc' }, select: { text: true } });
  return rows.map((r, i) => ayahWords(r.text, i === 0 && number !== 1 && number !== 9).display.join(' '));
}

export default async function QuranThemesComparePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const x = Number(query.a) || 16;
  const y = Number(query.b) || 43;
  const [a, b, surahs, shared] = await Promise.all([
    load(x),
    load(y),
    prisma.surah.findMany({ where: { number: { in: [x, y] } }, select: { number: true, name: true } }),
    getSharedTopics(x, y),
  ]);
  const name = (n: number) => surahs.find((s) => s.number === n)?.name ?? '';
  return <ThemesView a={{ number: x, name: name(x), ayat: a }} b={{ number: y, name: name(y), ayat: b }} themes={toThemeRows(shared)} />;
}
