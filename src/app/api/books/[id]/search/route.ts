import { NextResponse } from 'next/server';
import { searchBook } from '@shared/bookReader';
import { isReaderBook, pageName } from '@shared/readerBooks';
import { readerBook } from '@/lib/books/readerBook';

/** A search through one book of the reader (docs/plans/book-reader.md): each place with its page, 1-based. */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isReaderBook(id)) return NextResponse.json({ error: 'No such book' }, { status: 404 });
  const query = new URL(request.url).searchParams.get('q') ?? '';
  const { entries, pages } = await readerBook(id);
  const { hits, more } = searchBook(entries, pages, query.slice(0, 80));
  return NextResponse.json({ hits: hits.map(hit => ({ ...hit, page: hit.page + 1, name: pageName(id, pages[hit.page].part, pages[hit.page].page) })), more });
}
