import { notFound, redirect } from 'next/navigation';
import { surahList } from '@/lib/quran/surahList';
import { pageOfAyah, type MushafPage } from '@shared/quran/readerPage';

export const dynamic = 'force-dynamic';

const load = async (page: number): Promise<MushafPage> => (await import(`../../../../../../../shared/data/quran/mushaf/${page}.json`)).default;

/** Recite and review links keep their own query; plain links mark the ayah. */
const KEEP = ['recite', 'upto', 'w', 'review', 'openings'];

export default async function AyahRedirect({ params, searchParams }: { params: Promise<{ surah: string; ayah: string }>; searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const { surah, ayah } = await params;
  const query = (await searchParams) ?? {};
  const [s, a] = [Number(surah), Number(ayah)];
  if (!Number.isInteger(s) || !Number.isInteger(a) || s < 1 || s > 114 || a < 1) notFound();
  const row = (await surahList()).find(entry => entry.number === s);
  const page = await pageOfAyah(s, a, row?.page ?? 1, load);
  if (!page) notFound();
  const kept = new URLSearchParams(KEEP.flatMap(name => (typeof query[name] === 'string' ? [[name, query[name] as string]] : [])));
  redirect(`/quran/read/${page}?${kept.has('recite') ? kept.toString() : `a=${s}:${a}`}`);
}
