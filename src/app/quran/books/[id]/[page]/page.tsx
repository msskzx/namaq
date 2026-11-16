import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageOfSpot } from '@shared/bookReader';
import { bookOf } from '@shared/books';
import { isReaderBook, pageName, quranpediaPage } from '@shared/readerBooks';
import { readerBook } from '@/lib/books/readerBook';
import { contentsOf, pageView } from '@/lib/books/bookView';
import BookReader from '../../BookReader';

export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: isReaderBook(id) ? bookOf(id).title : 'الكتب' };
}

/** One printed page of a book (docs/plans/book-reader.md); the page number in the address counts from the book's first. */
export default async function BookPage({ params }: { params: Promise<{ id: string; page: string }> }) {
  const { id, page } = await params;
  const number = Number(page);
  if (!isReaderBook(id) || String(number) !== page) notFound();
  const { entries, pages } = await readerBook(id);
  const here = pages[number - 1];
  if (!here) notFound();
  const contents = contentsOf(entries, entry => pageOfSpot(pages, { entry, at: 0 }));
  return (
    <BookReader id={id} title={bookOf(id).title} page={number} total={pages.length} name={pageName(id, here.part, here.page)}
      printed={{ part: here.part, page: here.page }} source={quranpediaPage(id, here.part, here.page)}
      slices={pageView(id, entries, here)} contents={contents} />
  );
}
