import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pageHeadings } from '@/lib/history/sectionHeadings';

/**
 * An account's own section index: every heading its pages declare, so the
 * reader can jump straight to a section of نص المصدر instead of only paging
 * through it one printed page at a time. Separate from the page-serving
 * route because building it reads every page's body, which a single-page
 * view has no reason to pay for.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const accountId = new URL(request.url).searchParams.get('account');

  if (!accountId) {
    return NextResponse.json({ error: 'account is required' }, { status: 400 });
  }

  try {
    const account = await prisma.sourceAccount.findFirst({
      where: { id: accountId, subjectKind: 'PERSON', subjectSlug: slug },
      select: { id: true },
    });

    if (!account) {
      return NextResponse.json({ error: 'Unknown account for this person' }, { status: 404 });
    }

    const pages = await prisma.sourceAccountPage.findMany({
      where: { accountId },
      select: { sequence: true, printedPage: true, bodyMarkdown: true },
      orderBy: { sequence: 'asc' },
    });

    const sections = pages.flatMap((page) =>
      pageHeadings(page.bodyMarkdown).map((heading) => ({
        sequence: page.sequence,
        printedPage: page.printedPage,
        heading: heading.text,
      })),
    );

    return NextResponse.json({ sections });
  } catch (error) {
    console.error('Source account sections API error:', error);
    return NextResponse.json({ error: 'Failed to fetch the section index' }, { status: 500 });
  }
}
