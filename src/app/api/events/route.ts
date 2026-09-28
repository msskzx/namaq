import { NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { EventType } from '@/generated/prisma';
import { parseLimit } from '@/lib/apiParams';
import { apiError, CATALOG_CACHE_HEADERS } from '@/lib/apiError';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const search = searchParams.get('search');
  const year = searchParams.get('year');

  const where: Prisma.EventWhereInput = {};

  // Filter by event type if provided
  if (type) {
    where.type = type as EventType; // Type will be validated by Prisma
  }

  // Search in name and description
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { nameTransliterated: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Filter by year (Hijri or Gregorian)
  if (year) {
    const yearNum = parseInt(year, 10);
    if (!isNaN(yearNum)) {
      where.OR = [
        ...(where.OR || []),
        { hijriYear: yearNum },
        { gregorianYear: yearNum },
      ];
    }
  }

  try {
    const take = parseLimit(searchParams, { defaultLimit: 20, maxLimit: 100 });
    const events = await prisma.event.findMany({
      where,
      include: {
        people: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { hijriYear: 'asc' },
        { gregorianYear: 'asc' },
      ],
      take,
    });

    return NextResponse.json(events, { headers: CATALOG_CACHE_HEADERS });
  } catch (error) {
    return apiError('GET /api/events', error, 'Failed to fetch events');
  }
}
