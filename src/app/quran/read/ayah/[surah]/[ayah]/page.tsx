import { notFound, redirect } from 'next/navigation';
import { surahList } from '@/lib/quran/surahList';
import { pageOfAyah, type MushafPage } from '@/lib/quran/readerPage';

export const dynamic = 'force-dynamic';

const load = async (page: number): Promise<MushafPage> => (await import(`../../../mushaf/${page}.json`)).default;

export default async function AyahRedirect({ params }: { params: Promise<{ surah: string; ayah: string }> }) {
  const { surah, ayah } = await params;
  const [s, a] = [Number(surah), Number(ayah)];
  if (!Number.isInteger(s) || !Number.isInteger(a) || s < 1 || s > 114 || a < 1) notFound();
  const row = (await surahList()).find(entry => entry.number === s);
  const page = await pageOfAyah(s, a, row?.page ?? 1, load);
  if (!page) notFound();
  redirect(`/quran/read/${page}?a=${s}:${a}`);
}
