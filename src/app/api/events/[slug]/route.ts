import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
        battle: {
          select: {
            id: true,
            name: true,
            slug: true,
            hijriYear: true,
            gregorianYear: true,
            location: true,
          },
        },
        articles: {
          select: {
            id: true,
            title: true,
            slug: true,
            special: true,
            summary: true,
            summaryEn: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error(`Error fetching event with slug ${slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}