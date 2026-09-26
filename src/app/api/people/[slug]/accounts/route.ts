import { NextResponse } from 'next/server';
import { MAX_PAGES_PER_REQUEST, accountsPayload, pagesPayload } from '@/lib/history/sourceAccounts';

/**
 * Source accounts for a person, and one requested page of one of them. The
 * reading itself is shared with the bookshelf's route; only the `where`
 * differs (src/lib/history/sourceAccounts.ts).
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
      const { status, body } = await pagesPayload({ subjectKind: 'PERSON', subjectSlug: slug }, account, start, end, 'Unknown account for this person');
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
      { subjectKind: 'PERSON', subjectSlug: slug },
      query.get('account'),
      requestedPage,
      'Unknown account for this person',
    );
    return NextResponse.json(body, { status });
  } catch (error) {
    console.error('Source account API error:', error);
    return NextResponse.json({ error: 'Failed to fetch source accounts' }, { status: 500 });
  }
}
