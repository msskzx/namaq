import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 12) : undefined;
  try {
    const charities = await prisma.charity.findMany({
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      },
      take: limit,
    });

    return NextResponse.json(charities);
  } catch (error) {
    console.error('Error fetching charities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch charities' },
      { status: 500 }
    );
  }
}
