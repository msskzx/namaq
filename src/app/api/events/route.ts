import { NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { EventType } from '@/generated/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const search = searchParams.get('search');
  const year = searchParams.get('year');
  const limit = searchParams.get('limit');

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

  // Set up pagination
  const take = limit ? parseInt(limit, 10) : 20;
  
  try {
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
        battle: {
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
      take: Math.min(take, 100), // Limit to 100 items max for safety
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
