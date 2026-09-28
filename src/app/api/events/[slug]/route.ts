import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { utteranceSelect } from '@/lib/utteranceSelect';
import { apiError, CATALOG_CACHE_HEADERS } from '@/lib/apiError';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: 'Event slug is required' },
      { status: 400 }
    );
  }

  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        people: {
          select: {
            id: true,
            name: true,
            slug: true,
            fullName: true,
            titles: true,
          },
          orderBy: { name: 'asc' },
        },
        utterances: { select: utteranceSelect, orderBy: { slug: 'asc' } },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event, { headers: CATALOG_CACHE_HEADERS });
  } catch (error) {
    return apiError('GET /api/events/[slug]', error, 'Failed to fetch event');
  }
}