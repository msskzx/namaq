import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * The shelf: every work the evidence is read from, with how much of each has
 * been read. A source is one edition of one work rather than the work in the
 * abstract, so two editions are two shelf entries (docs/data-pipelines.md).
 */
export async function GET() {
  try {
    const sources = await prisma.historicalSource.findMany({
      orderBy: { title: 'asc' },
      select: {
        slug: true,
        title: true,
        author: true,
        editor: true,
        publisher: true,
        publicationYear: true,
        edition: true,
        digitalHost: true,
        url: true,
        notes: true,
        accounts: { select: { _count: { select: { pages: true } } } },
        volumes: { select: { number: true, name: true }, orderBy: { number: 'asc' } },
      },
    });

    return NextResponse.json({
      sources: sources.map(({ accounts, ...source }) => ({
        ...source,
        entryCount: accounts.length,
        pageCount: accounts.reduce((total, account) => total + account._count.pages, 0),
      })),
    });
  } catch (error) {
    console.error('Sources API error:', error);
    return NextResponse.json({ error: 'Failed to fetch the sources' }, { status: 500 });
  }
}
