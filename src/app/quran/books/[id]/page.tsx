import { notFound, redirect } from 'next/navigation';
import { entryOfAyah, pageOfSpot } from '@shared/bookReader';
import { isReaderBook } from '@shared/readerBooks';
import { readerBook } from '@/lib/books/readerBook';
import OpenLastBookPage from '../OpenLastBookPage';

/**
 * A book's address: with ?ayah=2:5 (the mushaf's tafsir, i'rab and balagha sheets) it opens the page of the passage on
 * that ayah; with ?spot=entry:at (a saved paragraph) the page holding that paragraph, lit; with ?at=entry:at (the فاصلة,
 * a page) that page, nothing lit; otherwise the page the book was last open at on this device.
 */
export default async function BookOpen({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ayah?: string; spot?: string; at?: string }> }) {
  const { id } = await params;
  if (!isReaderBook(id)) notFound();
  const { entries, pages } = await readerBook(id);
  const asked = await searchParams;
  const [entry, at] = String(asked.spot ?? '').split(':').map(Number);
  if (entry >= 0 && at >= 0 && entry < entries.length) redirect(`/quran/books/${id}/${pageOfSpot(pages, { entry, at }) + 1}?lit=${entry}:${at}`);
  const [pageEntry, pageAt] = String(asked.at ?? '').split(':').map(Number);
  if (pageEntry >= 0 && pageAt >= 0 && pageEntry < entries.length) redirect(`/quran/books/${id}/${pageOfSpot(pages, { entry: pageEntry, at: pageAt }) + 1}`);
  const [surah, ayah] = String(asked.ayah ?? '').split(':').map(Number);
  if (surah > 0 && ayah > 0) redirect(`/quran/books/${id}/${pageOfSpot(pages, { entry: entryOfAyah(entries, surah, ayah), at: 0 }) + 1}`);
  return <OpenLastBookPage id={id} starts={pages.map(page => [page.slices[0]?.entry ?? 0, page.slices[0]?.from ?? 0])} />;
}
