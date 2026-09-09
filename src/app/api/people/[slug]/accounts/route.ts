import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const accountSummary = {
  id: true,
  subjectKind: true,
  subjectSlug: true,
  entryIdentifier: true,
  titleArabic: true,
  volume: true,
  extractionUrl: true,
  source: true,
  _count: { select: { pages: true } },
} as const;

/**
 * Source accounts for a person, and one requested page of one of them. A whole
 * account can run to dozens of printed pages, so the profile asks for the page
 * it is showing instead of every account's full text on load.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const query = new URL(request.url).searchParams;
  const requestedAccount = query.get('account');
  const requestedPage = Number(query.get('page') ?? '1');

  if (!Number.isInteger(requestedPage) || requestedPage < 1) {
    return NextResponse.json({ error: 'page must be a positive whole number' }, { status: 400 });
  }

  try {
    const rows = await prisma.sourceAccount.findMany({
      where: { subjectKind: 'PERSON', subjectSlug: slug },
      select: accountSummary,
      orderBy: { createdAt: 'asc' },
    });

    const accounts = rows.map(({ _count, ...account }) => ({ ...account, pageCount: _count.pages }));

    if (accounts.length === 0) {
      return NextResponse.json({ accounts: [], account: null, page: null });
    }

    const selected = requestedAccount
      ? accounts.find((account) => account.id === requestedAccount)
      : accounts[0];

    if (!selected) {
      return NextResponse.json({ error: 'Unknown account for this person' }, { status: 404 });
    }

    const page = await prisma.sourceAccountPage.findUnique({
      where: { accountId_sequence: { accountId: selected.id, sequence: requestedPage } },
      select: {
        sequence: true,
        printedPage: true,
        bodyMarkdown: true,
        notesMarkdown: true,
        extractionUrl: true,
      },
    });

    if (!page) {
      return NextResponse.json(
        { error: `Page ${requestedPage} is outside this account`, pageCount: selected.pageCount },
        { status: 404 },
      );
    }

    return NextResponse.json({ accounts, account: selected, page });
  } catch (error) {
    console.error('Source account API error:', error);
    return NextResponse.json({ error: 'Failed to fetch source accounts' }, { status: 500 });
  }
}
