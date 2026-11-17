import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { loadAyahText } from '@/lib/quran/readerAyat';
import QiraatView from './QiraatView';
import { variants } from './data/variants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: القراءات',
};

export default async function QuranQiraatPage() {
  const rows = await prisma.ayah.findMany({
    where: { OR: variants.map(v => ({ number: v.ayah, surah: { number: v.surah } })) },
    select: { number: true, surah: { select: { number: true, name: true } } },
  });
  const text = await loadAyahText();
  const entries = variants.flatMap(variant => {
    const row = rows.find(r => r.number === variant.ayah && r.surah.number === variant.surah);
    return row ? [{ variant, text: text(variant.surah, variant.ayah), surahName: row.surah.name }] : [];
  });
  return <QiraatView entries={entries} />;
}
