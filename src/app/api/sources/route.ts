import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiError, CATALOG_CACHE_HEADERS } from '@/lib/apiError';

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
        language: true,
        author: true,
        editor: true,
        publisher: true,
        publicationYear: true,
        edition: true,
        digitalHost: true,
        url: true,
        notes: true,
        _count: { select: { accounts: true } },
        volumes: {
          select: { number: true, name: true, _count: { select: { pages: true } } },
          orderBy: { number: 'asc' },
        },
      },
    });

    return NextResponse.json(
      {
        sources: sources.map(({ _count, volumes, ...source }) => ({
          ...source,
          volumes: volumes.map((volume) => ({ number: volume.number, name: volume.name })),
          entryCount: _count.accounts,
          pageCount: volumes.reduce((total, volume) => total + volume._count.pages, 0),
        })),
      },
      { headers: CATALOG_CACHE_HEADERS }
    );
  } catch (error) {
    return apiError('GET /api/sources', error, 'Failed to fetch the sources');
  }
}
