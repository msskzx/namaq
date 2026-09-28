import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiError, CATALOG_CACHE_HEADERS } from '@/lib/apiError';

export async function GET() {
  try {
    const titles = await prisma.title.findMany({
      select: {
        id: true,
        name: true,
        nameTransliterated: true,
        slug: true,
        _count: { select: { people: true } },
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(
      titles.map(({ _count, ...title }) => ({ ...title, peopleCount: _count.people })),
      { headers: CATALOG_CACHE_HEADERS }
    );
  } catch (error) {
    return apiError('GET /api/titles', error, 'Failed to fetch titles');
  }
}