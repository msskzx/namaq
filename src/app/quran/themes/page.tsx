import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ayahWords } from '@/lib/quran/normalize';
import ThemesView from './ThemesView';
import themes from './data/themes.json';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: مواضع متقابلة بين سورتين (تجريبي)',
};

async function load(number: number) {
  const rows = await prisma.ayah.findMany({ where: { surah: { number } }, orderBy: { number: 'asc' }, select: { text: true } });
  return rows.map((r, i) => ayahWords(r.text, i === 0 && number !== 1 && number !== 9).display.join(' '));
}

export default async function QuranThemesPage() {
  const [a, b, surahs] = await Promise.all([
    load(16),
    load(43),
    prisma.surah.findMany({ where: { number: { in: [16, 43] } }, select: { number: true, name: true } }),
  ]);
  const name = (n: number) => surahs.find((s) => s.number === n)?.name ?? '';
  return <ThemesView a={{ number: 16, name: name(16), ayat: a }} b={{ number: 43, name: name(43), ayat: b }} themes={themes} />;
}
