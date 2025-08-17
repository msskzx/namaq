import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const person = await prisma.person.findUnique({
      where: { slug },
      include: {
        titles: true,
        relationsFrom: {
          include: { to: true },
        },
        relationsTo: {
          include: { from: true },
        },
        participations: {
          include: { battle: true },
        },
        events: {
          include: { battle: true },
        },
        ayat: true,
      },
    });

    if (!person) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(person);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch person' },
      { status: 500 }
    );
  }
} 