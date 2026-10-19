import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { pageOfAyah, type ReaderPageData } from '@/lib/quran/readerPage';

export const dynamic = 'force-dynamic';

const load = async (page: number): Promise<ReaderPageData> => (await import(`../../../data/${page}.json`)).default;

export default async function AyahRedirect({ params }: { params: Promise<{ surah: string; ayah: string }> }) {
  const { surah, ayah } = await params;
  const [s, a] = [Number(surah), Number(ayah)];
  if (!Number.isInteger(s) || !Number.isInteger(a) || s < 1 || s > 114 || a < 1) notFound();
  const row = await prisma.surah.findFirst({ where: { number: s }, select: { page: true } });
  const page = await pageOfAyah(s, a, row?.page ?? 1, load);
  if (!page) notFound();
  redirect(`/quran/read/${page}?a=${s}:${a}`);
}
