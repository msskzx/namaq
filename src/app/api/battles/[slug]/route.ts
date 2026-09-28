import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { utteranceSelect } from '@/lib/utteranceSelect';
import { apiError, CATALOG_CACHE_HEADERS } from '@/lib/apiError';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const battle = await prisma.battle.findUnique({
      where: { slug },
      include: {
        participations: {
          include: {
            person: {
              select: {
                id: true,
                name: true,
                nameTransliterated: true,
                slug: true,
              },
            },
          },
        },
        utterances: { select: utteranceSelect, orderBy: { slug: 'asc' } },
      },
    });
    if (!battle) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(battle, { headers: CATALOG_CACHE_HEADERS });
  } catch (error) {
    return apiError('GET /api/battles/[slug]', error, 'Failed to fetch battle');
  }
}
