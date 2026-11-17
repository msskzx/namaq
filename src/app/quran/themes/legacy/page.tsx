import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ayahWords } from '@shared/quran/normalize';
import ThemesView from '../ThemesView';
import pairs from './data/index';
import { surahName } from '@shared/quran/surahNames';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: مواضع متقابلة بين سورتين',
};

async function load(number: number) {
  const rows = await prisma.ayah.findMany({ where: { surah: { number } }, orderBy: { number: 'asc' }, select: { text: true } });
  return rows.map((r, i) => ayahWords(r.text, i === 0 && number !== 1 && number !== 9).display.join(' '));
}

export default async function QuranThemesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const key = `${query.a}-${query.b}`;
  const [x, y] = (key in pairs ? key : '16-43').split('-').map(Number);
  const [a, b] = await Promise.all([load(x), load(y)]);
  const name = surahName;
  return (
    <div className="max-w-5xl mx-auto p-4">
      <ThemesView a={{ number: x, name: name(x), ayat: a }} b={{ number: y, name: name(y), ayat: b }} themes={pairs[`${x}-${y}`]} />
    </div>
  );
}
