import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sectionIndex } from '@/lib/history/sourceAccounts';

/** The section index of one entry in one work, for the bookshelf's reader. */
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
      where: { id: accountId, source: { slug } },
      select: { id: true },
    });

    if (!account) {
      return NextResponse.json({ error: 'Unknown account in this source' }, { status: 404 });
    }

    return NextResponse.json({ sections: await sectionIndex(accountId) });
  } catch (error) {
    console.error('Source sections API error:', error);
    return NextResponse.json({ error: 'Failed to fetch the section index' }, { status: 500 });
  }
}
