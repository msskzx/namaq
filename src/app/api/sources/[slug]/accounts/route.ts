import { NextResponse } from 'next/server';
import { MAX_PAGES_PER_REQUEST, accountsPayload, pagesPayload } from '@/lib/history/sourceAccounts';

/**
 * The same reading the profile gets, scoped to a work rather than a person:
 * every entry this source holds, and one page of the one asked for.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const query = new URL(request.url).searchParams;
  const from = query.get('from');
  const requestedPage = Number(query.get('page') ?? '1');

  if (from !== null) {
    const start = Number(from);
    const end = Number(query.get('to') ?? from);
    const account = query.get('account');
    if (!account || !Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end - start >= MAX_PAGES_PER_REQUEST) {
      return NextResponse.json({ error: 'from and to must be a short run of page numbers, with an account' }, { status: 400 });
    }
    try {
      const { status, body } = await pagesPayload({ source: { slug } }, account, start, end, 'Unknown account in this source');
      return NextResponse.json(body, { status });
    } catch (error) {
      console.error('Source pages API error:', error);
      return NextResponse.json({ error: 'Failed to fetch these pages' }, { status: 500 });
    }
  }

  if (!Number.isInteger(requestedPage) || requestedPage < 1) {
    return NextResponse.json({ error: 'page must be a positive whole number' }, { status: 400 });
  }

  try {
    const { status, body } = await accountsPayload(
      { source: { slug } },
      query.get('account'),
      requestedPage,
      'Unknown account in this source',
    );
    return NextResponse.json(body, { status });
  } catch (error) {
    console.error('Source accounts API error:', error);
    return NextResponse.json({ error: 'Failed to fetch this source' }, { status: 500 });
  }
}
